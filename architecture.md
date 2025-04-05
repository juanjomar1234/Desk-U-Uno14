# Arquitectura de Microservicios con Next.js 14

## Visión General

Este documento describe la arquitectura de la aplicación de microservicios basada en Next.js 14 con App Router. La aplicación utiliza un enfoque de monorepo para simplificar el desarrollo y despliegue, aprovechando las API Routes de Next.js para implementar los servicios backend.

## Estructura del Proyecto

```
nextjs-microservices/
├── src/
│   ├── app/                      # App Router de Next.js
│   │   ├── (auth)/               # Rutas protegidas por autenticación
│   │   │   ├── dashboard/        # Dashboard principal
│   │   │   ├── users/            # Gestión de usuarios
│   │   │   ├── messages/         # Sistema de mensajería
│   │   │   ├── files/            # Gestión de archivos
│   │   │   ├── tasks/            # Gestión de tareas
│   │   │   ├── schedule/         # Gestión de calendario
│   │   │   ├── billing/          # Facturación y pagos
│   │   │   ├── contacts/         # Gestión de contactos
│   │   │   ├── boards/           # Tableros Kanban
│   │   │   ├── lists/            # Gestión de listas
│   │   │   ├── cards/            # Gestión de tarjetas
│   │   │   ├── collaboration/    # Colaboración en tiempo real
│   │   │   ├── branding/         # Personalización de marca
│   │   │   ├── automation/       # Automatizaciones
│   │   │   ├── crm/              # Gestión de clientes
│   │   │   ├── dependencies/     # Gestión de dependencias
│   │   │   ├── timeline/         # Visualización temporal
│   │   │   ├── logs/             # Visualización de logs (nuevo)
│   │   │   └── layout.tsx        # Layout para rutas autenticadas
│   │   ├── api/                  # API Routes (microservicios)
│   │   │   ├── auth/             # Autenticación (Next-Auth)
│   │   │   ├── users/            # API de usuarios
│   │   │   ├── messages/         # API de mensajes
│   │   │   ├── files/            # API de archivos
│   │   │   ├── tasks/            # API de tareas
│   │   │   ├── schedule/         # API de calendario
│   │   │   ├── billing/          # API de facturación
│   │   │   ├── contacts/         # API de contactos
│   │   │   ├── boards/           # API de tableros
│   │   │   ├── lists/            # API de listas
│   │   │   ├── cards/            # API de tarjetas
│   │   │   ├── collaboration/    # API de colaboración
│   │   │   ├── branding/         # API de marca
│   │   │   ├── automation/       # API de automatizaciones
│   │   │   ├── crm/              # API de CRM
│   │   │   ├── dependencies/     # API de dependencias
│   │   │   ├── timeline/         # API de timeline
│   │   │   ├── platform/         # API de integración con plataformas
│   │   │   ├── analytics/        # API de análisis
│   │   │   └── logs/             # API de logs (nuevo)
│   │   ├── login/                # Página de login
│   │   ├── register/             # Página de registro
│   │   ├── layout.tsx            # Layout principal
│   │   └── page.tsx              # Página principal
│   ├── components/               # Componentes reutilizables
│   │   ├── ui/                   # Componentes de UI
│   │   ├── forms/                # Componentes de formularios
│   │   └── layout/               # Componentes de layout
│   ├── lib/                      # Utilidades y configuraciones
│   │   ├── prisma/               # Cliente Prisma y esquemas
│   │   ├── auth/                 # Configuración de Next-Auth
│   │   ├── logger/               # Configuración de Winston
│   │   └── utils/                # Funciones de utilidad
│   ├── hooks/                    # Custom hooks
│   └── store/                    # Estado global con Zustand
├── prisma/                       # Configuración de Prisma
│   ├── schema.prisma             # Esquema de la base de datos
│   └── migrations/               # Migraciones de la base de datos
├── public/                       # Archivos estáticos
├── docker/                       # Configuración de Docker
│   ├── docker-compose.yml        # Configuración para desarrollo
│   └── Dockerfile                # Dockerfile para desarrollo
├── .env                          # Variables de entorno
├── .env.example                  # Ejemplo de variables de entorno
├── package.json                  # Dependencias y scripts
└── tsconfig.json                 # Configuración de TypeScript
```

## Tecnologías Utilizadas

### Frontend
- Next.js 14 (App Router)
- React 18.2
- Tailwind CSS 3
- Zustand para estado global
- TypeScript 5.3

### Backend
- Node.js 18 LTS
- Next.js API Routes
- Prisma como ORM
- PostgreSQL para base de datos
- JWT + Next-Auth para autenticación

### Logging
- Winston integrado con Next.js
- PostgreSQL para almacenamiento de logs
- API Routes de Next.js para consultas

### Despliegue
- Vercel (optimizado para Next.js)
- Railway o Supabase para PostgreSQL
- Docker para desarrollo local

## Microservicios

La aplicación implementa los siguientes microservicios a través de API Routes de Next.js:

1. **Auth Service**: Gestión de autenticación y autorización
2. **User Service**: Gestión de usuarios y perfiles
3. **Message Service**: Sistema de mensajería
4. **File Service**: Gestión de archivos
5. **Task Service**: Gestión de tareas
6. **Schedule Service**: Gestión de calendario
7. **Billing Service**: Facturación y pagos
8. **Contacts Service**: Gestión de contactos
9. **Boards Service**: Tableros Kanban
10. **Lists Service**: Gestión de listas
11. **Cards Service**: Gestión de tarjetas
12. **Collaboration Service**: Colaboración en tiempo real
13. **Branding Service**: Personalización de marca
14. **Automation Service**: Automatizaciones
15. **CRM Service**: Gestión de clientes
16. **Dependencies Service**: Gestión de dependencias
17. **Timeline Service**: Visualización temporal
18. **Platform Integration Service**: Integración con plataformas externas
19. **Analytics Service**: Análisis y métricas
20. **Log Service**: Registro y consulta de logs (nuevo)

## Modelo de Datos

El esquema de Prisma definirá los modelos para todos los servicios, incluyendo:

- User
- Message
- File
- Task
- Event
- Subscription
- Invoice
- Contact
- Board
- List
- Card
- Theme
- Rule
- Customer
- Dependency
- TimelineEvent
- PlatformIntegration
- AnalyticsEvent
- Log (nuevo)

## Comunicación entre Servicios

Los servicios se comunican entre sí a través de:

1. **Llamadas directas**: Utilizando el cliente Prisma para acceder a la base de datos
2. **API internas**: Llamadas entre API Routes
3. **Eventos**: Utilizando un sistema de eventos para comunicación asíncrona

## Log Service (Nuevo)

El nuevo Log Service proporcionará:

1. **Registro de actividad del sistema**:
   - Errores y excepciones
   - Rendimiento y métricas
   - Eventos del sistema

2. **Registro de actividad de usuarios**:
   - Inicios de sesión
   - Acciones importantes
   - Cambios en datos críticos

3. **Interfaz de consulta**:
   - Filtrado por tipo, nivel, fecha, usuario
   - Exportación de logs
   - Alertas configurables

4. **Integración con otros servicios**:
   - Middleware para registro automático
   - API para registro manual
   - Hooks para eventos importantes

## Seguridad

- Autenticación mediante Next-Auth
- JWT para tokens de sesión
- RBAC (Control de acceso basado en roles)
- Validación de datos con Zod
- HTTPS para todas las comunicaciones
- Sanitización de entradas

## Escalabilidad

- Optimización de rendimiento con Next.js
- Caché de datos con SWR
- Paginación y carga incremental
- Optimizaciones de base de datos con Prisma

## Desarrollo y Despliegue

### Desarrollo Local
- Docker Compose para PostgreSQL
- Prisma Studio para gestión de base de datos
- Next.js en modo desarrollo

### CI/CD
- GitHub Actions para integración continua
- Pruebas automatizadas
- Despliegue automático a Vercel

### Producción
- Despliegue en Vercel
- Base de datos en Railway o Supabase
- Monitoreo y alertas
