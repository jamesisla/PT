#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$DIR"

echo "🏗️ Compilando Frontend React..."
npm install --legacy-peer-deps
npm run build

echo "🔨 Compilando binario único Go (con dist/ embebido)..."
go build -ldflags="-s -w" -o saniapet main.go

echo "✅ Binario generado exitosamente: ./saniapet ($(du -h saniapet | cut -f1))"
