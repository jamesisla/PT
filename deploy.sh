#!/bin/sh
set -e

echo "=================================================="
echo "🐾 Desplegando actualización de Sania Pet..."
echo "=================================================="

# 1. Bajar últimos cambios
echo "📥 1/4 Descargando cambios desde GitHub..."
git pull origin main

# 2. Compilar Frontend (React 19 + Vite optimizado)
echo "⚡ 2/4 Compilando frontend optimizado..."
npm run build

# 3. Compilar Go con dist embebido
echo "🔨 3/4 Compilando binario único nativo Go..."
go build -o saniapet main.go

# 4. Reiniciar servicio OpenRC
echo "🔄 4/4 Reiniciando servicio saniapet..."
sudo rc-service saniapet restart
sudo rc-service saniapet status

echo "=================================================="
echo "✅ ¡Despliegue completado con éxito en https://pet.oci.lat!"
echo "💡 Recuerda hacer Hard Refresh en tu navegador: Ctrl + Shift + R"
echo "=================================================="
