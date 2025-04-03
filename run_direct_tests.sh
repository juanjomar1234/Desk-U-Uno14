#!/bin/bash

# Script para probar la integración de los microservicios
# Este script realiza pruebas básicas para verificar que los servicios se comunican correctamente

echo "Iniciando pruebas de integración..."

# Directorio base
BASE_DIR="/home/ubuntu/microservices-app"
LOG_FILE="$BASE_DIR/integration_tests.log"

# Función para realizar peticiones HTTP y registrar resultados
test_endpoint() {
    local service=$1
    local endpoint=$2
    local method=${3:-GET}
    local data=$4
    local token=$5
    
    echo "Probando $service - $endpoint ($method)" | tee -a $LOG_FILE
    
    local headers=""
    if [ ! -z "$token" ]; then
        headers="-H 'Authorization: Bearer $token'"
    fi
    
    local curl_cmd="curl -s -X $method"
    
    if [ ! -z "$data" ]; then
        curl_cmd="$curl_cmd -H 'Content-Type: application/json' -d '$data'"
    fi
    
    if [ ! -z "$headers" ]; then
        curl_cmd="$curl_cmd $headers"
    fi
    
    curl_cmd="$curl_cmd $endpoint"
    
    # Ejecutar comando curl y guardar resultado
    local result=$(eval $curl_cmd)
    local status=$?
    
    if [ $status -eq 0 ]; then
        echo "✅ Éxito: $service - $endpoint" | tee -a $LOG_FILE
        echo "$result" >> $LOG_FILE
    else
        echo "❌ Error: $service - $endpoint" | tee -a $LOG_FILE
        echo "Comando: $curl_cmd" >> $LOG_FILE
        echo "Resultado: $result" >> $LOG_FILE
    fi
    
    echo "" | tee -a $LOG_FILE
    
    # Devolver el resultado para su uso posterior
    echo "$result"
}

# Inicializar archivo de log
echo "=== PRUEBAS DE INTEGRACIÓN DE MICROSERVICIOS ===" > $LOG_FILE
echo "Fecha: $(date)" >> $LOG_FILE
echo "=======================================" >> $LOG_FILE
echo "" >> $LOG_FILE

# Probar Gateway Service (punto de entrada)
echo "=== Probando Gateway Service ===" | tee -a $LOG_FILE
gateway_health=$(test_endpoint "Gateway" "http://localhost:3000/health")

# Probar User Service a través del Gateway
echo "=== Probando User Service ===" | tee -a $LOG_FILE
user_health=$(test_endpoint "User Service" "http://localhost:3001/health")

# Registrar un usuario de prueba
echo "Registrando usuario de prueba..." | tee -a $LOG_FILE
register_data='{"username":"testuser","email":"test@example.com","password":"Password123!"}'
register_response=$(test_endpoint "User Service - Register" "http://localhost:3001/register" "POST" "$register_data")

# Extraer token de autenticación
echo "Iniciando sesión con usuario de prueba..." | tee -a $LOG_FILE
login_data='{"email":"test@example.com","password":"Password123!"}'
login_response=$(test_endpoint "User Service - Login" "http://localhost:3001/login" "POST" "$login_data")

# Extraer token usando jq si está disponible, o grep como alternativa
if command -v jq &> /dev/null; then
    token=$(echo $login_response | jq -r '.token')
else
    token=$(echo $login_response | grep -o '"token":"[^"]*' | sed 's/"token":"//')
fi

if [ -z "$token" ] || [ "$token" == "null" ]; then
    echo "❌ Error: No se pudo obtener token de autenticación" | tee -a $LOG_FILE
    echo "Respuesta de login: $login_response" >> $LOG_FILE
    exit 1
else
    echo "✅ Token de autenticación obtenido correctamente" | tee -a $LOG_FILE
fi

# Probar Message Service con autenticación
echo "=== Probando Message Service ===" | tee -a $LOG_FILE
message_health=$(test_endpoint "Message Service" "http://localhost:3002/health")

# Crear un mensaje de prueba
echo "Creando mensaje de prueba..." | tee -a $LOG_FILE
message_data='{"recipient_id":"system","subject":"Test Message","content":"This is a test message from integration tests"}'
create_message=$(test_endpoint "Message Service - Create" "http://localhost:3002/messages" "POST" "$message_data" "$token")

# Probar File Service
echo "=== Probando File Service ===" | tee -a $LOG_FILE
file_health=$(test_endpoint "File Service" "http://localhost:3003/health")

# Probar Task Service
echo "=== Probando Task Service ===" | tee -a $LOG_FILE
task_health=$(test_endpoint "Task Service" "http://localhost:3007/health")

# Crear una tarea de prueba
echo "Creando tarea de prueba..." | tee -a $LOG_FILE
task_data='{"title":"Test Task","description":"This is a test task from integration tests","due_date":"2025-12-31T23:59:59.999Z","priority":"medium"}'
create_task=$(test_endpoint "Task Service - Create" "http://localhost:3007/tasks" "POST" "$task_data" "$token")

# Extraer ID de la tarea creada
if command -v jq &> /dev/null; then
    task_id=$(echo $create_task | jq -r '.task.id')
else
    task_id=$(echo $create_task | grep -o '"id":"[^"]*' | sed 's/"id":"//')
fi

if [ ! -z "$task_id" ] && [ "$task_id" != "null" ]; then
    echo "✅ Tarea creada con ID: $task_id" | tee -a $LOG_FILE
    
    # Probar Dependencies Service con la tarea creada
    echo "=== Probando Dependencies Service ===" | tee -a $LOG_FILE
    dependencies_health=$(test_endpoint "Dependencies Service" "http://localhost:3019/health")
    
    # Crear una dependencia de prueba
    echo "Creando dependencia de prueba..." | tee -a $LOG_FILE
    dependency_data='{"source_type":"task","source_id":"'$task_id'","target_type":"system","target_id":"system","dependency_type":"1","description":"Test dependency"}'
    create_dependency=$(test_endpoint "Dependencies Service - Create" "http://localhost:3019/dependencies" "POST" "$dependency_data" "$token")
fi

# Probar Timeline Service
echo "=== Probando Timeline Service ===" | tee -a $LOG_FILE
timeline_health=$(test_endpoint "Timeline Service" "http://localhost:3020/health")

# Registrar un evento en la línea de tiempo
echo "Registrando evento en la línea de tiempo..." | tee -a $LOG_FILE
event_data='{"entity_type":"integration_test","entity_id":"test_run_1","event_type":"test_executed","event_data":{"result":"success"}}'
create_event=$(test_endpoint "Timeline Service - Create Event" "http://localhost:3020/events" "POST" "$event_data" "$token")

# Probar Frontend Service
echo "=== Probando Frontend Service ===" | tee -a $LOG_FILE
frontend_health=$(test_endpoint "Frontend" "http://localhost:3030")

# Resumen de las pruebas
echo "=== RESUMEN DE PRUEBAS ===" | tee -a $LOG_FILE
echo "Pruebas completadas: $(date)" | tee -a $LOG_FILE
echo "Ver detalles completos en: $LOG_FILE" | tee -a $LOG_FILE

echo "Pruebas de integración finalizadas."
