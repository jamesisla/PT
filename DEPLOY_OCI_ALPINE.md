# Guía de Despliegue Nativo en Oracle Cloud Infrastructure (OCI) con Go + SQLite 🏔️⚡

Esta guía documenta la instalación y ejecución de **Sania Pet** en **Alpine Linux** como un **Único Binario Estático en Go**, con base de datos **SQLite en modo WAL** y el **Frontend React + OpenStreetMap** embebido dentro del ejecutable.

> [!TIP]
> **Ventajas de esta arquitectura en Alpine Linux:**
> * **Un Solo Ejecutable (`./saniapet`)**: Contiene el servidor web, todas las APIs REST y el frontend compilado.
> * **Cero Demonios Externos**: No requiere PostgreSQL, ni Python, ni Uvicorn, ni entornos virtuales `venv`.
> * **Consumo de Memoria**: Apenas **~12 a 18 MB de RAM** en total.
> * **Latencia**: Respuestas de la base de datos en **microsegundos (< 0.5 ms)**.
> * **Auto-siembra**: Al arrancar por primera vez, crea la base de datos SQLite y siembra los registros automáticamente.

---

## 🛠️ Paso 1: Instalar Go, Node.js y Git en Alpine

Conéctate por SSH a tu servidor Alpine en OCI:

```bash
# Actualizar repositorios e instalar Go, Node.js, npm y Git
sudo apk update
sudo apk add go nodejs npm git
```

---

## 📥 Paso 2: Clonar el Repositorio

```bash
# Clonar en tu directorio home
cd ~
git clone https://github.com/jamesisla/PT.git ~/pet
cd ~/pet
```

---

## 🏗️ Paso 3: Compilar el Frontend y el Binario de Go

```bash
cd ~/pet

# 1. Compilar el Frontend React + Mapa OpenStreetMap
npm install --legacy-peer-deps
npm run build

# 2. Compilar el binario único de Go (con dist/ embebido adentro)
go build -o saniapet main.go
```

*(El comando genera el archivo ejecutable `saniapet` de ~20 MB que contiene todo el sistema)*.

---

## 🚀 Paso 4: Crear el Servicio OpenRC para Ejecución Continua

Crea el script de servicio en `/etc/init.d/saniapet`:

```bash
sudo sh -c 'cat << "EOF" > /etc/init.d/saniapet
#!/sbin/openrc-run

name="saniapet"
description="Sania Pet Go Single Binary Service"
supervisor="supervise-daemon"

directory="/home/alpine/pet"
command="/home/alpine/pet/saniapet"
command_user="alpine"

output_log="/var/log/saniapet.log"
error_log="/var/log/saniapet.err"

# Puerto en el que escuchará Go (ej. 8080 si usas Nginx de proxy, o 80 directo)
export PORT="8080"
export DATABASE_PATH="/home/alpine/pet/saniapet.db"

depend() {
    need net
}
EOF'

# Dar permisos y arrancar
sudo chmod +x /etc/init.d/saniapet
sudo rc-update add saniapet default
sudo rc-service saniapet start
sudo rc-service saniapet status
```

---

## 🔒 Paso 5: Configurar Nginx con SSL (`pet.oci.lat`)

Para gestionar el certificado HTTPS de Let's Encrypt y redirigir el tráfico al binario de Go en el puerto `8080`:

```bash
sudo sh -c 'cat << "EOF" > /etc/nginx/http.d/pet.oci.lat.conf
server {
    listen 80;
    listen 443 ssl;
    server_name pet.oci.lat;

    ssl_certificate /etc/letsencrypt/live/pet.oci.lat/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/pet.oci.lat/privkey.pem;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF'

sudo rc-update add nginx default
sudo rc-service nginx restart
```

---

## 🔄 Paso 6: Script de Actualización en 1 Paso (`deploy.sh`)

Crea `/home/alpine/pet/deploy.sh` para actualizar todo automáticamente cuando hagas cambios:

```bash
cat << 'EOF' > ~/pet/deploy.sh
#!/bin/sh
set -e

echo "==> 1. Descargando cambios de Git..."
cd /home/alpine/pet
git pull origin main

echo "==> 2. Recompilando Frontend..."
npm install --legacy-peer-deps
npm run build

echo "==> 3. Recompilando Binario Go..."
go build -o saniapet main.go

echo "==> 4. Reiniciando servicio..."
sudo rc-service saniapet restart

echo "✅ ¡Sania Pet actualizado y corriendo con éxito!"
EOF

chmod +x ~/pet/deploy.sh
```

---

## 📊 Comandos de Mantenimiento

| Tarea | Comando |
| :--- | :--- |
| **Ver estado del servicio** | `sudo rc-service saniapet status` |
| **Reiniciar servicio** | `sudo rc-service saniapet restart` |
| **Ver logs en tiempo real** | `tail -f /var/log/saniapet.log` |
| **Hacer backup de la base de datos** | `cp ~/pet/saniapet.db ~/backup_$(date +%F).db` |
