#!/bin/bash

echo "🚀 INICIANDO PROJETO EDENRED 100% FUNCIONAL"
echo "============================================="

# Limpar processos antigos
echo "🧹 Limpando processos antigos..."
pkill -f "node.*server.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
lsof -ti :3001 | xargs kill -9 2>/dev/null || true
lsof -ti :5173 | xargs kill -9 2>/dev/null || true

echo "✅ Ambiente limpo"

# Função para capturar Ctrl+C e finalizar ambos os processos
cleanup() {
    echo ""
    echo "🛑 Encerrando serviços..."
    pkill -f "node.*server.js" 2>/dev/null || true
    pkill -f "vite" 2>/dev/null || true
    exit 0
}

# Registrar a função de cleanup para SIGINT (Ctrl+C)
trap cleanup SIGINT

# Iniciar backend
echo "🔧 Iniciando Backend (Porta 3001)..."
cd backend
node src/server.js > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Aguardar backend inicializar
echo "⏳ Aguardando backend inicializar (5s)..."
sleep 5

# Verificar se backend está rodando
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ Backend funcionando!"
else
    echo "❌ Backend falhou. Verifique backend.log"
    exit 1
fi

# Iniciar frontend
echo "🎨 Iniciando Frontend (Porta 5173)..."
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!

# Aguardar frontend inicializar
echo "⏳ Aguardando frontend inicializar (3s)..."
sleep 3

echo ""
echo "🌟 PROJETO EDENRED FUNCIONANDO 100%!"
echo "=================================="
echo "📡 Frontend: http://localhost:5173"
echo "🔌 Backend:  http://localhost:3001"
echo "💚 Health:   http://localhost:3001/health"
echo ""
echo "🔑 CREDENCIAIS DE LOGIN:"
echo "   Admin: admin@edenred.com.br / 123456"
echo "   Consultor: consultor@edenred.com.br / consultor123"
echo ""
echo "💡 Para parar os serviços, pressione Ctrl+C"
echo ""

# Aguardar indefinidamente
wait
