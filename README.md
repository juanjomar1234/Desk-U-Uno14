# Documentación del Sistema de Microservicios con Next.js 14

## Introducción

Este documento proporciona una descripción detallada del sistema de microservicios implementado con Next.js 14 y tecnologías modernas consolidadas. El sistema está diseñado para ofrecer una plataforma completa de gestión empresarial con funcionalidades que incluyen gestión de usuarios, mensajería, archivos, tareas, calendario, y un nuevo servicio de logs para el registro de actividades del sistema y de los usuarios.

## Arquitectura

### Visión General

El sistema utiliza un enfoque de monorepo basado en Next.js 14 con App Router, donde los microservicios se implementan como API Routes. Esta arquitectura proporciona beneficios como:

- Desarrollo y despliegue simplificados
- Integración nativa entre frontend y backend
- Compartición de tipos y modelos entre servicios
- Despliegue unificado en Vercel

### Tecnologías Utilizadas

#### Frontend
- **Next.js 14** (App Router): Framework React con renderizado del lado del servidor
- **React 18.2**: Biblioteca para construir interfaces de usuario
- **Tailwind CSS 3**: Framework CSS utilitario
- **Zustand**: Gestión de estado global (más simple que Redux)
- **TypeScript 5.3**: Superset tipado de JavaScript

#### Backend
- **Node.js 18 LTS**: Entorno de ejecución JavaScript
- **Next.js API Routes**: Endpoints de API integrados en Next.js
- **Prisma**: ORM para bases de datos
- **PostgreSQL**: Sistema de gestión de bases de datos relacional
- **JWT + Next-Auth**: Autenticación y autorización

#### Logging
- **Winston**: Biblioteca de logging
- **PostgreSQL**: Almacenamiento de logs (usando Prisma)
- **API Routes de Next.js**: Consultas de logs

#### Despliegue
- **Vercel**: Plataforma optimizada para Next.js
- **Railway/Supabase**: Hosting para PostgreSQL
- **Docker**: Desarrollo local

### Estructura del Proyecto

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
│   │   │   ├── events/           # Gestión de calendario
│   │   │   ├── contacts/         # Gestión de contactos
│   │   │   ├── boards/           # Tableros Kanban
│   │   │   ├── logs/             # Visualización de logs
│   │   │   └── layout.tsx        # Layout para rutas autenticadas
│   │   ├── api/                  # API Routes (microservicios)
│   │   │   ├── auth/             # Autenticación (Next-Auth)
│   │   │   ├── users/            # API de usuarios
│   │   │   ├── messages/         # API de mensajes
│   │   │   ├── files/            # API de archivos
│   │   │   ├── tasks/            # API de tareas
│   │   │   ├── events/           # API de calendario
│   │   │   ├── contacts/         # API de contactos
│   │   │   ├── boards/           # API de tableros
│   │   │   ├── cards/            # API de tarjetas
│   │   │   └── logs/             # API de logs
│   │   ├── login/                # Página de login
│   │   ├── layout.tsx            # Layout principal
│   │   └── page.tsx              # Página principal
│   ├── components/               # Componentes reutilizables
│   │   ├── ui/                   # Componentes de UI
│   │   └── layout/               # Componentes de layout
│   ├── lib/                      # Utilidades y configuraciones
│   │   ├── prisma.ts             # Cliente Prisma
│   │   ├── auth.ts               # Configuración de Next-Auth
│   │   └── logger/               # Configuración de Winston
│   ├── hooks/                    # Custom hooks
│   └── store/                    # Estado global con Zustand
├── prisma/                       # Configuración de Prisma
│   └── schema.prisma             # Esquema de la base de datos
├── tests/                        # Pruebas
│   ├── integration.test.ts       # Pruebas de integración
│   └── setup.ts                  # Configuración de pruebas
├── jest.config.js                # Configuración de Jest
└── package.json                  # Dependencias y scripts
```

## Microservicios Implementados

### 1. Servicio de Autenticación (Auth Service)

**Descripción**: Gestiona la autenticación y autorización de usuarios.

**Endpoints**:
- `POST /api/auth/login`: Iniciar sesión
- `POST /api/auth/register`: Registrar nuevo usuario
- `GET /api/auth/session`: Obtener sesión actual
- `POST /api/auth/logout`: Cerrar sesión

**Tecnologías**: Next-Auth, JWT, Prisma

### 2. Servicio de Usuarios (User Service)

**Descripción**: Gestiona los usuarios y perfiles.

**Endpoints**:
- `GET /api/users`: Listar usuarios
- `GET /api/users/:id`: Obtener usuario específico
- `PUT /api/users/:id`: Actualizar usuario
- `DELETE /api/users/:id`: Eliminar usuario

**Tecnologías**: Next.js API Routes, Prisma

### 3. Servicio de Mensajes (Message Service)

**Descripción**: Sistema de mensajería entre usuarios.

**Endpoints**:
- `GET /api/messages`: Obtener mensajes recibidos
- `GET /api/messages?type=sent`: Obtener mensajes enviados
- `POST /api/messages`: Enviar mensaje
- `DELETE /api/messages/:id`: Eliminar mensaje

**Tecnologías**: Next.js API Routes, Prisma

### 4. Servicio de Archivos (File Service)

**Descripción**: Gestión de archivos con control de permisos.

**Endpoints**:
- `GET /api/files`: Listar archivos
- `POST /api/files`: Subir archivo
- `GET /api/files/:id`: Descargar archivo
- `DELETE /api/files/:id`: Eliminar archivo

**Tecnologías**: Next.js API Routes, Prisma

### 5. Servicio de Tareas (Task Service)

**Descripción**: Gestión de tareas y asignaciones.

**Endpoints**:
- `GET /api/tasks`: Listar tareas
- `POST /api/tasks`: Crear tarea
- `PUT /api/tasks/:id`: Actualizar tarea
- `DELETE /api/tasks/:id`: Eliminar tarea

**Tecnologías**: Next.js API Routes, Prisma

### 6. Servicio de Calendario (Event Service)

**Descripción**: Gestión de eventos y calendario.

**Endpoints**:
- `GET /api/events`: Listar eventos
- `POST /api/events`: Crear evento
- `PUT /api/events/:id`: Actualizar evento
- `DELETE /api/events/:id`: Eliminar evento

**Tecnologías**: Next.js API Routes, Prisma

### 7. Servicio de Contactos (Contact Service)

**Descripción**: Gestión de contactos personales.

**Endpoints**:
- `GET /api/contacts`: Listar contactos
- `POST /api/contacts`: Crear contacto
- `PUT /api/contacts/:id`: Actualizar contacto
- `DELETE /api/contacts/:id`: Eliminar contacto

**Tecnologías**: Next.js API Routes, Prisma

### 8. Servicio de Tableros (Board Service)

**Descripción**: Gestión de tableros Kanban.

**Endpoints**:
- `GET /api/boards`: Listar tableros
- `POST /api/boards`: Crear tablero
- `PUT /api/boards/:id`: Actualizar tablero
- `DELETE /api/boards/:id`: Eliminar tablero

**Tecnologías**: Next.js API Routes, Prisma

### 9. Servicio de Tarjetas (Card Service)

**Descripción**: Gestión de tarjetas en tableros Kanban.

**Endpoints**:
- `GET /api/cards?columnId=:columnId`: Listar tarjetas de una columna
- `POST /api/cards`: Crear tarjeta
- `PUT /api/cards/:id`: Actualizar tarjeta
- `DELETE /api/cards/:id`: Eliminar tarjeta

**Tecnologías**: Next.js API Routes, Prisma

### 10. Servicio de Logs (Log Service)

**Descripción**: Registro y consulta de logs del sistema y usuarios.

**Endpoints**:
- `GET /api/logs`: Consultar logs con filtros
- `POST /api/logs`: Crear nuevo log

**Tecnologías**: Winston, Next.js API Routes, Prisma

## Integración entre Servicios

### Autenticación Centralizada

La autenticación se maneja a través de Next-Auth, que proporciona:

- Autenticación basada en credenciales
- Sesiones con JWT
- Middleware para proteger rutas
- Integración con el sistema de logs

### Estado Global

El estado global se gestiona con Zustand, que proporciona:

- Estado de sesión compartido
- Estado de la interfaz de usuario
- Sistema de notificaciones

### Logging Centralizado

El sistema de logs utiliza Winston y se integra con todos los servicios para:

- Registrar actividades del sistema
- Registrar actividades de usuarios
- Proporcionar una interfaz de consulta
- Almacenar logs en PostgreSQL

## Modelo de Datos

El esquema de Prisma define los siguientes modelos:

### User (Usuario)
- id: String (cuid)
- name: String
- email: String (único)
- password: String (opcional)
- image: String (opcional)
- role: Enum (USER, ADMIN)
- createdAt: DateTime
- updatedAt: DateTime

### Message (Mensaje)
- id: String (cuid)
- content: String
- status: String
- senderId: String (relación con User)
- recipientId: String
- createdAt: DateTime
- updatedAt: DateTime

### File (Archivo)
- id: String (cuid)
- name: String
- path: String
- mimeType: String
- size: Int
- ownerId: String (relación con User)
- createdAt: DateTime
- updatedAt: DateTime

### Task (Tarea)
- id: String (cuid)
- title: String
- description: String (opcional)
- status: Enum (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
- priority: Enum (LOW, MEDIUM, HIGH)
- dueDate: DateTime (opcional)
- ownerId: String (relación con User)
- assigneeId: String (opcional)
- createdAt: DateTime
- updatedAt: DateTime

### Event (Evento)
- id: String (cuid)
- title: String
- description: String (opcional)
- startTime: DateTime
- endTime: DateTime
- ownerId: String (relación con User)
- createdAt: DateTime
- updatedAt: DateTime

### Contact (Contacto)
- id: String (cuid)
- name: String
- email: String (opcional)
- phone: String (opcional)
- company: String (opcional)
- ownerId: String (relación con User)
- createdAt: DateTime
- updatedAt: DateTime

### Board (Tablero)
- id: String (cuid)
- name: String
- ownerId: String (relación con User)
- columns: Relación con Column[]
- createdAt: DateTime
- updatedAt: DateTime

### Column (Columna)
- id: String (cuid)
- name: String
- position: Int
- boardId: String (relación con Board)
- cards: Relación con Card[]
- createdAt: DateTime
- updatedAt: DateTime

### Card (Tarjeta)
- id: String (cuid)
- title: String
- description: String (opcional)
- position: Int
- columnId: String (relación con Column)
- assigneeId: String (opcional, relación con User)
- createdAt: DateTime
- updatedAt: DateTime

### Log (Registro)
- id: String (cuid)
- level: Enum (ERROR, WARN, INFO, DEBUG)
- message: String
- metadata: Json (opcional)
- source: String
- userId: String (opcional, relación con User)
- timestamp: DateTime

## Seguridad

### Autenticación y Autorización
- Autenticación basada en JWT con Next-Auth
- Middleware para proteger rutas
- Control de acceso basado en roles (RBAC)
- Verificación de propiedad de recursos

### Protección de Datos
- Validación de entradas
- Sanitización de datos
- Protección contra inyección SQL (a través de Prisma)
- HTTPS para todas las comunicaciones

## Pruebas

### Pruebas de Integración
- Verificación de autenticación
- Verificación de operaciones CRUD en todos los servicios
- Verificación de integración entre servicios
- Verificación del sistema de logs

### Configuración de Pruebas
- Jest como framework de pruebas
- Entorno de pruebas aislado
- Base de datos de prueba separada

## Despliegue

### Desarrollo Local
- Docker para PostgreSQL
- Next.js en modo desarrollo
- Variables de entorno locales

### Producción
- Despliegue en Vercel
- Base de datos en Railway o Supabase
- Variables de entorno de producción

## Instrucciones de Uso

### Requisitos Previos
- Node.js 18 LTS o superior
- PostgreSQL (local o en la nube)
- Git

### Instalación
1. Clonar el repositorio
   ```
   git clone [URL_DEL_REPOSITORIO]
   cd nextjs-microservices
   ```

2. Instalar dependencias
   ```
   npm install
   ```

3. Configurar variables de entorno
   ```
   cp .env.example .env
   ```
   Editar el archivo `.env` con los valores adecuados.

4. Generar cliente Prisma
   ```
   npm run prisma:generate
   ```

5. Ejecutar migraciones de base de datos
   ```
   npm run prisma:migrate
   ```

### Ejecución
1. Iniciar en modo desarrollo
   ```
   npm run dev
   ```

2. Acceder a la aplicación
   ```
   http://localhost:3000
   ```

### Pruebas
1. Ejecutar pruebas
   ```
   npm test
   ```

## Conclusión

Este sistema de microservicios implementado con Next.js 14 y tecnologías modernas consolidadas proporciona una plataforma completa y escalable para gestión empresarial. La arquitectura basada en monorepo con API Routes simplifica el desarrollo y despliegue, mientras que la integración de un nuevo servicio de logs permite un seguimiento detallado de las actividades del sistema y de los usuarios.

La elección de tecnologías como React 18.2, Tailwind CSS, Prisma y PostgreSQL garantiza un equilibrio entre modernidad y estabilidad, proporcionando una base sólida para el desarrollo futuro.
