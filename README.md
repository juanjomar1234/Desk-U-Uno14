# Aplicación Web basada en Microservicios

Sistema completo de microservicios con frontend en Next.js y tema oscuro profesional.

## Requisitos

- Node.js 16+
- npm 7+
- PowerShell 5+ (Windows) o Bash (Linux/Mac)

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/nombre-repositorio.git
cd nombre-repositorio
```

2. Iniciar los servicios:

Windows:
```powershell
.\start_services.ps1
```

Linux/Mac:
```bash
./start_services.sh
```

3. Ejecutar pruebas:

Windows:
```powershell
.\run_direct_tests.ps1
```

Linux/Mac:
```bash
./run_direct_tests.sh
```

## Estructura del Proyecto

- `/gateway-service` - API Gateway (Puerto 3000)
- `/user-service` - Gestión de usuarios (Puerto 3001)
- `/message-service` - Mensajería (Puerto 3002)
- `/file-service` - Gestión de archivos (Puerto 3003)
- ... [otros servicios]

## Documentación

Ver archivos:
- [Arquitectura](architecture.md)
- [Despliegue](DEPLOY.md)

## Licencia

MIT

## Configuración del Entorno
- [x] Crear directorio principal del proyecto
- [x] Instalar dependencias necesarias
- [x] Verificar herramientas de desarrollo

## Creación de la Aplicación Next.js con Tema Oscuro
- [x] Crear aplicación base con Next.js
- [x] Configurar Tailwind CSS
- [x] Implementar tema oscuro profesional

## Diseño de Arquitectura de Microservicios
- [x] Definir estructura de comunicación entre servicios
- [x] Diseñar esquema de base de datos
- [x] Crear diagrama de arquitectura

## Implementación de Servicios
- [x] Frontend Service (Interfaz de usuario web)
- [x] User Service (Gestión de usuarios y autenticación)
- [x] Message Service (Procesamiento de mensajes)
- [x] Platform Integration Service (Integración con plataformas) - Implementado
- [x] Analytics Service (Análisis y métricas) - Implementado
- [x] File Service (Gestión de archivos)
- [x] Gateway Service (API Gateway)
- [x] Task Service (Gestión de tareas) - Corregido
- [x] Schedule Service (Gestión de calendario)
- [x] Billing Service (Facturación y pagos)
- [x] MCP Service (Protocolo de contexto para modelos IA)
- [x] Contacts Service (Gestión de contactos)
- [x] Boards Service (Tableros Kanban)
- [x] Lists Service (Gestión de listas)
- [x] Cards Service (Gestión de tarjetas)
- [x] Collaboration Service (Colaboración en tiempo real)
- [x] Branding Service (Personalización de marca)
- [x] Automation Service (Automatizaciones)
- [x] CRM Service (Gestión de clientes)
- [x] Dependencies Service (Gestión de dependencias)
- [x] Timeline Service (Visualización temporal)

## Integración y Pruebas
- [x] Crear script para iniciar todos los microservicios
- [x] Crear script para detener todos los microservicios
- [x] Crear script de pruebas de integración
- [x] Ejecutar pruebas de integración
- [x] Verificar comunicación entre servicios
- [x] Corregir problemas de integración
- [x] Verificar funcionalidad completa

## Despliegue
- [x] Preparar aplicación para despliegue
- [x] Desplegar aplicación
- [x] Demostrar funcionalidad
- [x] Crear documentación completa
