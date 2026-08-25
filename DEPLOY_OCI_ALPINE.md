# Guía de Despliegue Nativo en Oracle Cloud Infrastructure (OCI) con Alpine Linux 🏔️⚡

Esta guía documenta la instalación, configuración y ejecución **100% nativa (Bare Metal / VM)** de **Sania Pet** en una máquina virtual con **Alpine Linux** en Oracle Cloud Infrastructure (OCI).

> [!TIP]
> **¿Por qué despliegue nativo en Alpine Linux?**
> * **Rendimiento Máximo**: Sin sobrecarga de capas de red ni virtualización de Docker.
> * **Consumo Mínimo de RAM**: El sistema completo (PostgreSQL + FastAPI + Nginx) utiliza apenas ~80-150 MB de RAM.
> * **Gestión Nativa con OpenRC**: Servicios livianos, arranque ultrarrápido y reinicio automático tras fallos o reinicios del servidor.

---

## 📋 Arquitectura en el Servidor

```
[ Cliente / Navegador ]
         │ (Puerto 80 / 443)
         ▼
[ Nginx Nativo (Alpine Linux) ]
   ├── Archivos Estáticos React/Vite (/var/www/saniapet/dist)
   └── Proxy /api/ ───► [ FastAPI / Uvicorn Nativo (127.0.0.1:8000) ]
                                   │
                                   ▼ (Puerto 5432)
                        [ PostgreSQL 15 Nativo ]
```

---

## 🛠️ Paso 1: Instalar Paquetes del Sistema en Alpine

Conéctate por SSH a tu máquina OCI y actualiza el sistema:

```bash
# Actualizar repositorios
apk update && apk upgrade

# Instalar herramientas de compilación, Python, Node.js, PostgreSQL y Nginx
apk add git curl \
    python3 py3-pip py3-virtualenv python3-dev \
    gcc musl-dev libpq-dev postgresql-dev \
    postgresql postgresql-contrib \
    nodejs npm \
    nginx openrc iptables
```

---

## 🗄️ Paso 2: Configuración y Arranque de PostgreSQL Nativo

### 1. Inicializar el clúster de base de datos
```bash
/etc/init.d/postgresql setup
```

### 2. Habilitar e iniciar el servicio PostgreSQL
```bash
rc-update add postgresql default
rc-service postgresql start
```

### 3. Crear usuario y base de datos `saniapetdb`
```bash
su - postgres -c "psql -c \"CREATE USER saniauser WITH PASSWORD 'saniapassword';\""
su - postgres -c "psql -c \"CREATE DATABASE saniapetdb OWNER saniauser;\""
su - postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE saniapetdb TO saniauser;\""
```

### 4. Configurar métodos de autenticación local
Edita el archivo `/var/lib/postgresql/data/pg_hba.conf` y asegúrate de que las conexiones locales usen `md5` o `scram-sha-256`:

```text
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             all                                     md5
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                 md5
```

Recarga la configuración:
```bash
rc-service postgresql reload
```

---

## 📥 Paso 3: Clonar el Repositorio de Sania Pet

Clona el proyecto en `/var/www/saniapet` (o la ruta de tu preferencia):

```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/jamesisla/saniapet.git
cd /var/www/saniapet
```

---

## 🐍 Paso 4: Configurar el Backend FastAPI (Python Nativo)

### 1. Crear el Entorno Virtual e Instalar Dependencias
```bash
cd /var/www/saniapet/backend

# Crear entorno virtual
python3 -m venv venv
source venv/bin/activate

# Instalar dependencias
pip install --upgrade pip
pip install -r requirements.txt
```

### 2. Crear Servicio OpenRC para el Backend
Crea el script de servicio en `/etc/init.d/saniapet-backend`:

```bash
cat << 'EOF' > /etc/init.d/saniapet-backend
#!/sbin/openrc-run

name="saniapet-backend"
description="Sania Pet FastAPI Backend Service"
supervisor="supervise-daemon"

directory="/var/www/saniapet/backend"
command="/var/www/saniapet/backend/venv/bin/uvicorn"
command_args="main:app --host 127.0.0.1 --port 8000 --workers 2"
command_user="root"

output_log="/var/log/saniapet-backend.log"
error_log="/var/log/saniapet-backend.err"

export DATABASE_URL="postgresql://saniauser:saniapassword@localhost:5432/saniapetdb"

depend() {
    need net postgresql
    after postgresql
}
EOF

# Dar permisos de ejecución
chmod +x /etc/init.d/saniapet-backend
```

### 3. Iniciar y Habilitar el Servicio Backend
```bash
rc-update add saniapet-backend default
rc-service saniapet-backend start
```

Verifica el estado y los logs:
```bash
rc-service saniapet-backend status
tail -n 20 /var/log/saniapet-backend.log
```

---

## ⚛️ Paso 5: Compilar el Frontend y Configurar Nginx

### 1. Instalar Dependencias y Compilar el Frontend React
```bash
cd /var/www/saniapet

# Instalar paquetes npm
npm install --legacy-peer-deps

# Generar el build de producción en /var/www/saniapet/dist
npm run build
```

### 2. Configurar Nginx Nativo en Alpine
Crea el archivo de configuración del sitio en `/etc/nginx/http.d/saniapet.conf`:

```bash
cat << 'EOF' > /etc/nginx/http.d/saniapet.conf
server {
    listen 80;
    server_name _;

    root /var/www/saniapet/dist;
    index index.html index.htm;

    # Compresión Gzip para máxima velocidad
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy inverso transparente hacia FastAPI
    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache de estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
EOF
```

### 3. Iniciar y Habilitar Nginx
```bash
rc-update add nginx default
rc-service nginx restart
```

---

## 🛡️ Paso 6: Configurar Puertos y Firewall en OCI

### A. Reglas de Entrada en la Consola OCI (VCN Security Lists)
1. Entra a tu consola de Oracle Cloud: **Networking** > **Virtual Cloud Networks**.
2. Entra en tu VCN > **Security Lists** > **Default Security List**.
3. Añade una **Ingress Rule**:
   * **Source CIDR**: `0.0.0.0/0`
   * **IP Protocol**: `TCP`
   * **Destination Port Range**: `80, 443`
   * **Description**: `HTTP/HTTPS Sania Pet`

### B. Firewall Nativo en Alpine Linux (`iptables`)
En tu terminal de Alpine, permite el tráfico de entrada en el puerto 80 y 443:

```bash
iptables -I INPUT 1 -p tcp --dport 80 -j ACCEPT
iptables -I INPUT 1 -p tcp --dport 443 -j ACCEPT

# Guardar reglas persistentes
/etc/init.d/iptables save
rc-update add iptables default
```

---

## 🔄 Paso 7: Script de Actualización Automática (deploy.sh)

Para actualizar tu servidor en un solo paso tras hacer cambios en GitHub, crea el script `/var/www/saniapet/deploy.sh`:

```bash
cat << 'EOF' > /var/www/saniapet/deploy.sh
#!/bin/sh
set -e

echo "==> Actualizando código desde Git..."
cd /var/www/saniapet
git pull origin main

echo "==> Actualizando dependencias backend..."
cd /var/www/saniapet/backend
./venv/bin/pip install -r requirements.txt

echo "==> Recompilando frontend..."
cd /var/www/saniapet
npm install --legacy-peer-deps
npm run build

echo "==> Reiniciando servicios en OpenRC..."
rc-service saniapet-backend restart
rc-service nginx reload

echo "✅ ¡Despliegue nativo actualizado con éxito!"
EOF

chmod +x /var/www/saniapet/deploy.sh
```

Cada vez que quieras actualizar el servidor, simplemente ejecutas:
```bash
/var/www/saniapet/deploy.sh
```

---

## 🩺 Comandos Útiles de Mantenimiento en Alpine

| Acción | Comando |
| :--- | :--- |
| **Estado de servicios** | `rc-status` |
| **Reiniciar Backend** | `rc-service saniapet-backend restart` |
| **Reiniciar PostgreSQL** | `rc-service postgresql restart` |
| **Reiniciar Nginx** | `rc-service nginx restart` |
| **Ver logs del Backend** | `tail -f /var/log/saniapet-backend.log` |
| **Ver logs de Nginx** | `tail -f /var/log/nginx/error.log` |
| **Conectar a PostgreSQL** | `psql -U saniauser -d saniapetdb -h localhost` |
