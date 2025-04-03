# Despliegue de la Aplicación de Microservicios

Esta aplicación está compuesta por 19 microservicios y un frontend con tema oscuro profesional.

## Requisitos

- Node.js 16+
- npm 7+
- PM2 (para gestión de procesos en producción)

## Instalación

1. Instalar dependencias para cada servicio:

```bash
cd gateway-service && npm install
cd ../user-service && npm install
cd ../message-service && npm install
cd ../file-service && npm install
cd ../task-service && npm install
cd ../schedule-service && npm install
cd ../billing-service && npm install
cd ../mcp-service && npm install
cd ../contacts-service && npm install
cd ../boards-service && npm install
cd ../lists-service && npm install
cd ../cards-service && npm install
cd ../collaboration-service && npm install
cd ../branding-service && npm install
cd ../automation-service && npm install
cd ../crm-service && npm install
cd ../dependencies-service && npm install
cd ../timeline-service && npm install
cd ../frontend-service && npm install
```

## Despliegue en Desarrollo

Para iniciar todos los servicios en modo desarrollo:

```bash
./start_services.sh
```

Para detener todos los servicios:

```bash
./stop_services.sh
```

## Despliegue en Producción

Para desplegar en producción con PM2:

```bash
npm install -g pm2
pm2 start deploy.config.js
```

Para monitorear los servicios:

```bash
pm2 monit
```

Para detener todos los servicios:

```bash
pm2 stop all
```

## Pruebas

Para ejecutar pruebas de integración:

```bash
./run_integration_tests.sh
```

Para ejecutar pruebas directas a cada servicio:

```bash
./run_direct_tests.sh
```

## Acceso

- Frontend: http://localhost:3030
- API Gateway: http://localhost:3000
