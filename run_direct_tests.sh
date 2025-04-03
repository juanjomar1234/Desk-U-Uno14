#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Crear directorio para logs si no existe
mkdir -p logs

# Archivo de log
LOG_FILE="logs/integration_tests.log"

# Función para escribir en el log
log() {
    echo "$1" | tee -a "$LOG_FILE"
}

# Limpiar archivo de log anterior
> "$LOG_FILE"

log "🚀 Iniciando pruebas directas..."

# Verificar que los servicios están corriendo
check_service() {
    local service=$1
    local port=$2
    log "📝 Verificando $service en puerto $port..."
    
    if curl -s "http://localhost:$port/health" > /dev/null; then
        log "${GREEN}✓ $service está funcionando${NC}"
        return 0
    else
        log "${RED}❌ $service no responde${NC}"
        return 1
    fi
}

# Ejecutar pruebas básicas
run_tests() {
    local errors=0

    # Verificar Gateway
    check_service "Gateway" 3000 || ((errors++))
    
    # Verificar User Service
    check_service "User Service" 3001 || ((errors++))
    
    # Verificar Message Service
    check_service "Message Service" 3002 || ((errors++))
    
    # Verificar File Service
    check_service "File Service" 3003 || ((errors++))

    return $errors
}

# Ejecutar las pruebas
log "🔍 Ejecutando pruebas..."
run_tests
test_result=$?

if [ $test_result -eq 0 ]; then
    log "${GREEN}✅ Todas las pruebas pasaron exitosamente${NC}"
    exit 0
else
    log "${RED}❌ Algunas pruebas fallaron${NC}"
    exit 1
fi
