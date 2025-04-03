#!/bin/bash

# Script para iniciar todos los microservicios
# Este script inicia todos los servicios en orden, comenzando con el Gateway

echo "Iniciando microservicios..."

# Directorio base
BASE_DIR="/home/ubuntu/microservices-app"

# Iniciar Gateway Service primero (puerto 3000)
echo "Iniciando Gateway Service en puerto 3000..."
cd $BASE_DIR/gateway-service
node server.js > gateway.log 2>&1 &
GATEWAY_PID=$!
echo "Gateway Service iniciado con PID: $GATEWAY_PID"
sleep 2

# Iniciar User Service (puerto 3001)
echo "Iniciando User Service en puerto 3001..."
cd $BASE_DIR/user-service
node server.js > user.log 2>&1 &
USER_PID=$!
echo "User Service iniciado con PID: $USER_PID"
sleep 2

# Iniciar Message Service (puerto 3002)
echo "Iniciando Message Service en puerto 3002..."
cd $BASE_DIR/message-service
node server.js > message.log 2>&1 &
MESSAGE_PID=$!
echo "Message Service iniciado con PID: $MESSAGE_PID"
sleep 2

# Iniciar File Service (puerto 3003)
echo "Iniciando File Service en puerto 3003..."
cd $BASE_DIR/file-service
node server.js > file.log 2>&1 &
FILE_PID=$!
echo "File Service iniciado con PID: $FILE_PID"
sleep 2

# Iniciar Task Service (puerto 3007)
echo "Iniciando Task Service en puerto 3007..."
cd $BASE_DIR/task-service
node server.js > task.log 2>&1 &
TASK_PID=$!
echo "Task Service iniciado con PID: $TASK_PID"
sleep 2

# Iniciar Schedule Service (puerto 3008)
echo "Iniciando Schedule Service en puerto 3008..."
cd $BASE_DIR/schedule-service
node server.js > schedule.log 2>&1 &
SCHEDULE_PID=$!
echo "Schedule Service iniciado con PID: $SCHEDULE_PID"
sleep 2

# Iniciar Billing Service (puerto 3009)
echo "Iniciando Billing Service en puerto 3009..."
cd $BASE_DIR/billing-service
node server.js > billing.log 2>&1 &
BILLING_PID=$!
echo "Billing Service iniciado con PID: $BILLING_PID"
sleep 2

# Iniciar MCP Service (puerto 3010)
echo "Iniciando MCP Service en puerto 3010..."
cd $BASE_DIR/mcp-service
node server.js > mcp.log 2>&1 &
MCP_PID=$!
echo "MCP Service iniciado con PID: $MCP_PID"
sleep 2

# Iniciar Contacts Service (puerto 3011)
echo "Iniciando Contacts Service en puerto 3011..."
cd $BASE_DIR/contacts-service
node server.js > contacts.log 2>&1 &
CONTACTS_PID=$!
echo "Contacts Service iniciado con PID: $CONTACTS_PID"
sleep 2

# Iniciar Boards Service (puerto 3012)
echo "Iniciando Boards Service en puerto 3012..."
cd $BASE_DIR/boards-service
node server.js > boards.log 2>&1 &
BOARDS_PID=$!
echo "Boards Service iniciado con PID: $BOARDS_PID"
sleep 2

# Iniciar Lists Service (puerto 3013)
echo "Iniciando Lists Service en puerto 3013..."
cd $BASE_DIR/lists-service
node server.js > lists.log 2>&1 &
LISTS_PID=$!
echo "Lists Service iniciado con PID: $LISTS_PID"
sleep 2

# Iniciar Cards Service (puerto 3014)
echo "Iniciando Cards Service en puerto 3014..."
cd $BASE_DIR/cards-service
node server.js > cards.log 2>&1 &
CARDS_PID=$!
echo "Cards Service iniciado con PID: $CARDS_PID"
sleep 2

# Iniciar Collaboration Service (puerto 3015)
echo "Iniciando Collaboration Service en puerto 3015..."
cd $BASE_DIR/collaboration-service
node server.js > collaboration.log 2>&1 &
COLLABORATION_PID=$!
echo "Collaboration Service iniciado con PID: $COLLABORATION_PID"
sleep 2

# Iniciar Branding Service (puerto 3016)
echo "Iniciando Branding Service en puerto 3016..."
cd $BASE_DIR/branding-service
node server.js > branding.log 2>&1 &
BRANDING_PID=$!
echo "Branding Service iniciado con PID: $BRANDING_PID"
sleep 2

# Iniciar Automation Service (puerto 3017)
echo "Iniciando Automation Service en puerto 3017..."
cd $BASE_DIR/automation-service
node server.js > automation.log 2>&1 &
AUTOMATION_PID=$!
echo "Automation Service iniciado con PID: $AUTOMATION_PID"
sleep 2

# Iniciar CRM Service (puerto 3018)
echo "Iniciando CRM Service en puerto 3018..."
cd $BASE_DIR/crm-service
node server.js > crm.log 2>&1 &
CRM_PID=$!
echo "CRM Service iniciado con PID: $CRM_PID"
sleep 2

# Iniciar Dependencies Service (puerto 3019)
echo "Iniciando Dependencies Service en puerto 3019..."
cd $BASE_DIR/dependencies-service
node server.js > dependencies.log 2>&1 &
DEPENDENCIES_PID=$!
echo "Dependencies Service iniciado con PID: $DEPENDENCIES_PID"
sleep 2

# Iniciar Timeline Service (puerto 3020)
echo "Iniciando Timeline Service en puerto 3020..."
cd $BASE_DIR/timeline-service
node server.js > timeline.log 2>&1 &
TIMELINE_PID=$!
echo "Timeline Service iniciado con PID: $TIMELINE_PID"
sleep 2

# Iniciar Frontend Service (puerto 3030)
echo "Iniciando Frontend Service en puerto 3030..."
cd $BASE_DIR/frontend-service
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend Service iniciado con PID: $FRONTEND_PID"

echo "Todos los microservicios han sido iniciados."
echo "Para detener todos los servicios, ejecute: ./stop_services.sh"

# Guardar PIDs para poder detener los servicios después
echo "GATEWAY_PID=$GATEWAY_PID" > service_pids.txt
echo "USER_PID=$USER_PID" >> service_pids.txt
echo "MESSAGE_PID=$MESSAGE_PID" >> service_pids.txt
echo "FILE_PID=$FILE_PID" >> service_pids.txt
echo "TASK_PID=$TASK_PID" >> service_pids.txt
echo "SCHEDULE_PID=$SCHEDULE_PID" >> service_pids.txt
echo "BILLING_PID=$BILLING_PID" >> service_pids.txt
echo "MCP_PID=$MCP_PID" >> service_pids.txt
echo "CONTACTS_PID=$CONTACTS_PID" >> service_pids.txt
echo "BOARDS_PID=$BOARDS_PID" >> service_pids.txt
echo "LISTS_PID=$LISTS_PID" >> service_pids.txt
echo "CARDS_PID=$CARDS_PID" >> service_pids.txt
echo "COLLABORATION_PID=$COLLABORATION_PID" >> service_pids.txt
echo "BRANDING_PID=$BRANDING_PID" >> service_pids.txt
echo "AUTOMATION_PID=$AUTOMATION_PID" >> service_pids.txt
echo "CRM_PID=$CRM_PID" >> service_pids.txt
echo "DEPENDENCIES_PID=$DEPENDENCIES_PID" >> service_pids.txt
echo "TIMELINE_PID=$TIMELINE_PID" >> service_pids.txt
echo "FRONTEND_PID=$FRONTEND_PID" >> service_pids.txt
