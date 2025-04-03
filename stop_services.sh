#!/bin/bash

# Script para detener todos los microservicios
# Este script detiene todos los servicios iniciados por start_services.sh

echo "Deteniendo microservicios..."

# Cargar PIDs desde el archivo
if [ -f service_pids.txt ]; then
    source service_pids.txt
    
    # Detener cada servicio
    if [ ! -z "$GATEWAY_PID" ]; then
        echo "Deteniendo Gateway Service (PID: $GATEWAY_PID)..."
        kill -15 $GATEWAY_PID 2>/dev/null || echo "Gateway Service ya no está en ejecución"
    fi
    
    if [ ! -z "$USER_PID" ]; then
        echo "Deteniendo User Service (PID: $USER_PID)..."
        kill -15 $USER_PID 2>/dev/null || echo "User Service ya no está en ejecución"
    fi
    
    if [ ! -z "$MESSAGE_PID" ]; then
        echo "Deteniendo Message Service (PID: $MESSAGE_PID)..."
        kill -15 $MESSAGE_PID 2>/dev/null || echo "Message Service ya no está en ejecución"
    fi
    
    if [ ! -z "$FILE_PID" ]; then
        echo "Deteniendo File Service (PID: $FILE_PID)..."
        kill -15 $FILE_PID 2>/dev/null || echo "File Service ya no está en ejecución"
    fi
    
    if [ ! -z "$TASK_PID" ]; then
        echo "Deteniendo Task Service (PID: $TASK_PID)..."
        kill -15 $TASK_PID 2>/dev/null || echo "Task Service ya no está en ejecución"
    fi
    
    if [ ! -z "$SCHEDULE_PID" ]; then
        echo "Deteniendo Schedule Service (PID: $SCHEDULE_PID)..."
        kill -15 $SCHEDULE_PID 2>/dev/null || echo "Schedule Service ya no está en ejecución"
    fi
    
    if [ ! -z "$BILLING_PID" ]; then
        echo "Deteniendo Billing Service (PID: $BILLING_PID)..."
        kill -15 $BILLING_PID 2>/dev/null || echo "Billing Service ya no está en ejecución"
    fi
    
    if [ ! -z "$MCP_PID" ]; then
        echo "Deteniendo MCP Service (PID: $MCP_PID)..."
        kill -15 $MCP_PID 2>/dev/null || echo "MCP Service ya no está en ejecución"
    fi
    
    if [ ! -z "$CONTACTS_PID" ]; then
        echo "Deteniendo Contacts Service (PID: $CONTACTS_PID)..."
        kill -15 $CONTACTS_PID 2>/dev/null || echo "Contacts Service ya no está en ejecución"
    fi
    
    if [ ! -z "$BOARDS_PID" ]; then
        echo "Deteniendo Boards Service (PID: $BOARDS_PID)..."
        kill -15 $BOARDS_PID 2>/dev/null || echo "Boards Service ya no está en ejecución"
    fi
    
    if [ ! -z "$LISTS_PID" ]; then
        echo "Deteniendo Lists Service (PID: $LISTS_PID)..."
        kill -15 $LISTS_PID 2>/dev/null || echo "Lists Service ya no está en ejecución"
    fi
    
    if [ ! -z "$CARDS_PID" ]; then
        echo "Deteniendo Cards Service (PID: $CARDS_PID)..."
        kill -15 $CARDS_PID 2>/dev/null || echo "Cards Service ya no está en ejecución"
    fi
    
    if [ ! -z "$COLLABORATION_PID" ]; then
        echo "Deteniendo Collaboration Service (PID: $COLLABORATION_PID)..."
        kill -15 $COLLABORATION_PID 2>/dev/null || echo "Collaboration Service ya no está en ejecución"
    fi
    
    if [ ! -z "$BRANDING_PID" ]; then
        echo "Deteniendo Branding Service (PID: $BRANDING_PID)..."
        kill -15 $BRANDING_PID 2>/dev/null || echo "Branding Service ya no está en ejecución"
    fi
    
    if [ ! -z "$AUTOMATION_PID" ]; then
        echo "Deteniendo Automation Service (PID: $AUTOMATION_PID)..."
        kill -15 $AUTOMATION_PID 2>/dev/null || echo "Automation Service ya no está en ejecución"
    fi
    
    if [ ! -z "$CRM_PID" ]; then
        echo "Deteniendo CRM Service (PID: $CRM_PID)..."
        kill -15 $CRM_PID 2>/dev/null || echo "CRM Service ya no está en ejecución"
    fi
    
    if [ ! -z "$DEPENDENCIES_PID" ]; then
        echo "Deteniendo Dependencies Service (PID: $DEPENDENCIES_PID)..."
        kill -15 $DEPENDENCIES_PID 2>/dev/null || echo "Dependencies Service ya no está en ejecución"
    fi
    
    if [ ! -z "$TIMELINE_PID" ]; then
        echo "Deteniendo Timeline Service (PID: $TIMELINE_PID)..."
        kill -15 $TIMELINE_PID 2>/dev/null || echo "Timeline Service ya no está en ejecución"
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        echo "Deteniendo Frontend Service (PID: $FRONTEND_PID)..."
        kill -15 $FRONTEND_PID 2>/dev/null || echo "Frontend Service ya no está en ejecución"
    fi
    
    echo "Todos los microservicios han sido detenidos."
    rm service_pids.txt
else
    echo "No se encontró el archivo service_pids.txt. ¿Se iniciaron los servicios con start_services.sh?"
fi

# Verificar si hay procesos de node en ejecución y detenerlos si es necesario
NODE_PIDS=$(pgrep -f "node server.js")
if [ ! -z "$NODE_PIDS" ]; then
    echo "Deteniendo procesos de node adicionales..."
    kill -15 $NODE_PIDS 2>/dev/null
fi

NEXT_PIDS=$(pgrep -f "npm run dev")
if [ ! -z "$NEXT_PIDS" ]; then
    echo "Deteniendo procesos de Next.js adicionales..."
    kill -15 $NEXT_PIDS 2>/dev/null
fi

echo "Limpieza completa."
