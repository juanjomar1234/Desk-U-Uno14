#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}🚀 Iniciando servicios...${NC}"

# Función para iniciar un servicio
start_service() {
    local service=$1
    local port=$2
    echo -e "Iniciando $service en puerto $port..."
    
    cd $service
    npm install --legacy-peer-deps
    node server.js &
    cd ..
    
    # Esperar a que el servicio esté disponible
    for i in {1..10}; do
        if curl -s "http://localhost:$port/health" > /dev/null; then
            echo -e "${GREEN}✓ $service iniciado correctamente${NC}"
            return 0
        fi
        sleep 2
    done
    
    echo -e "${RED}❌ Error iniciando $service${NC}"
    return 1
}

# Iniciar servicios principales
start_service "gateway-service" 3000
start_service "user-service" 3001
start_service "message-service" 3002
start_service "file-service" 3003

# Verificar que todos los servicios están corriendo
echo -e "\n${GREEN}Verificando servicios activos:${NC}"
ps aux | grep node
netstat -tulpn | grep LISTEN
