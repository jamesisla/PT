#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$DIR"

echo "🚀 Iniciando Sania Pet (Go Backend + Vite Dev)..."

# 1. Iniciar Backend Go
echo "📦 Iniciando Backend Go en puerto 8080..."
PORT=8080 go run main.go &
BACKEND_PID=$!

# 2. Iniciar Frontend Vite
echo "💻 Iniciando Frontend Vite en puerto 5173..."
npm run dev &
FRONTEND_PID=$!

cleanup() {
    echo ""
    echo "🛑 Deteniendo servicios..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    wait $BACKEND_PID 2>/dev/null || true
    wait $FRONTEND_PID 2>/dev/null || true
    echo "✨ Servicios detenidos limpiamente."
}
trap cleanup SIGINT SIGTERM EXIT

echo ""
echo "✅ Sania Pet corriendo en:"
echo "   - Frontend Dev: http://localhost:5173"
echo "   - Backend API: http://localhost:8080"
echo ""

wait
