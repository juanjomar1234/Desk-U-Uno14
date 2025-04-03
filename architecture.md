# Arquitectura de Microservicios

## Visión General
Esta arquitectura está diseñada para soportar una aplicación web profesional basada en 21 microservicios independientes que se comunican entre sí. Cada microservicio tiene una responsabilidad única y bien definida, siguiendo los principios de diseño de microservicios.

## Estructura de Comunicación

### Patrón de Comunicación
Utilizaremos una combinación de comunicación síncrona (REST API) y asíncrona (eventos) entre los microservicios:

1. **API Gateway (Gateway Service)**: Punto de entrada único para todas las solicitudes de clientes.
   - Enruta solicitudes a los microservicios apropiados
   - Maneja autenticación y autorización
   - Implementa limitación de tasa y balanceo de carga

2. **Comunicación Síncrona**: REST API para operaciones que requieren respuesta inmediata
   - Formato JSON para intercambio de datos
   - Autenticación mediante JWT

3. **Comunicación Asíncrona**: Sistema de mensajería para operaciones que no requieren respuesta inmediata
   - Publicación/suscripción para eventos
   - Colas de mensajes para tareas en segundo plano

### Descubrimiento de Servicios
- Registro de servicios centralizado
- Resolución de nombres basada en servicios
- Comprobaciones de salud para garantizar disponibilidad

## Esquema de Base de Datos

Cada microservicio tendrá su propia base de datos para garantizar el desacoplamiento. Utilizaremos la base de datos D1 de Cloudflare para todos los servicios.

### Esquemas por Servicio

1. **User Service**
```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

CREATE TABLE user_roles (
    user_id TEXT NOT NULL,
    role TEXT NOT NULL,
    PRIMARY KEY (user_id, role),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

2. **Message Service**
```sql
CREATE TABLE messages (
    id TEXT PRIMARY KEY,
    sender_id TEXT NOT NULL,
    recipient_id TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

CREATE TABLE message_attachments (
    id TEXT PRIMARY KEY,
    message_id TEXT NOT NULL,
    file_id TEXT NOT NULL,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
);
```

3. **File Service**
```sql
CREATE TABLE files (
    id TEXT PRIMARY KEY,
    owner_id TEXT NOT NULL,
    name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size INTEGER NOT NULL,
    storage_path TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

CREATE TABLE file_permissions (
    file_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    permission TEXT NOT NULL,
    PRIMARY KEY (file_id, user_id),
    FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
);
```

4. **Task Service**
```sql
CREATE TABLE tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL,
    priority TEXT NOT NULL,
    owner_id TEXT NOT NULL,
    assignee_id TEXT,
    due_date INTEGER,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

CREATE TABLE task_dependencies (
    task_id TEXT NOT NULL,
    depends_on_task_id TEXT NOT NULL,
    PRIMARY KEY (task_id, depends_on_task_id),
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (depends_on_task_id) REFERENCES tasks(id) ON DELETE CASCADE
);
```

5. **Schedule Service**
```sql
CREATE TABLE events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    start_time INTEGER NOT NULL,
    end_time INTEGER NOT NULL,
    owner_id TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

CREATE TABLE event_attendees (
    event_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    status TEXT NOT NULL,
    PRIMARY KEY (event_id, user_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);
```

6. **Billing Service**
```sql
CREATE TABLE subscriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    plan_id TEXT NOT NULL,
    status TEXT NOT NULL,
    start_date INTEGER NOT NULL,
    end_date INTEGER,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

CREATE TABLE invoices (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    amount REAL NOT NULL,
    status TEXT NOT NULL,
    due_date INTEGER NOT NULL,
    paid_date INTEGER,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);
```

7. **Contacts Service**
```sql
CREATE TABLE contacts (
    id TEXT PRIMARY KEY,
    owner_id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

CREATE TABLE contact_groups (
    id TEXT PRIMARY KEY,
    owner_id TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

CREATE TABLE contact_group_members (
    group_id TEXT NOT NULL,
    contact_id TEXT NOT NULL,
    PRIMARY KEY (group_id, contact_id),
    FOREIGN KEY (group_id) REFERENCES contact_groups(id) ON DELETE CASCADE,
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);
```

8. **Boards Service**
```sql
CREATE TABLE boards (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    owner_id TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

CREATE TABLE board_columns (
    id TEXT PRIMARY KEY,
    board_id TEXT NOT NULL,
    name TEXT NOT NULL,
    position INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
);
```

9. **Cards Service**
```sql
CREATE TABLE cards (
    id TEXT PRIMARY KEY,
    column_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    position INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (column_id) REFERENCES board_columns(id) ON DELETE CASCADE
);

CREATE TABLE card_assignments (
    card_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    PRIMARY KEY (card_id, user_id),
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
);
```

10. **Lists Service**
```sql
CREATE TABLE lists (
    id TEXT PRIMARY KEY,
    owner_id TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

CREATE TABLE list_items (
    id TEXT PRIMARY KEY,
    list_id TEXT NOT NULL,
    content TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT 0,
    position INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE
);
```

## Diagrama de Arquitectura

```
+-------------------+
|                   |
|  Cliente (Browser)|
|                   |
+--------+----------+
         |
         v
+--------+----------+     +-------------------+
|                   |     |                   |
|  Frontend Service +---->+ Gateway Service   |
|                   |     |                   |
+-------------------+     +--------+----------+
                                   |
                                   v
+------------------------------------------------------------------+
|                                                                  |
|                        Servicios Principales                      |
|                                                                  |
| +----------------+  +----------------+  +-------------------+    |
| |                |  |                |  |                   |    |
| | User Service   |  | Message Service|  | File Service      |    |
| |                |  |                |  |                   |    |
| +----------------+  +----------------+  +-------------------+    |
|                                                                  |
| +----------------+  +----------------+  +-------------------+    |
| |                |  |                |  |                   |    |
| | Task Service   |  | Schedule Service| | Billing Service   |    |
| |                |  |                |  |                   |    |
| +----------------+  +----------------+  +-------------------+    |
+------------------------------------------------------------------+
                                   |
                                   v
+------------------------------------------------------------------+
|                                                                  |
|                     Servicios Especializados                      |
|                                                                  |
| +----------------+  +----------------+  +-------------------+    |
| |                |  |                |  |                   |    |
| | Boards Service |  | Lists Service  |  | Cards Service     |    |
| |                |  |                |  |                   |    |
| +----------------+  +----------------+  +-------------------+    |
|                                                                  |
| +----------------+  +----------------+  +-------------------+    |
| |                |  |                |  |                   |    |
| | Contacts Service|  | CRM Service   |  | Timeline Service  |    |
| |                |  |                |  |                   |    |
| +----------------+  +----------------+  +-------------------+    |
|                                                                  |
| +----------------+  +----------------+  +-------------------+    |
| |                |  |                |  |                   |    |
| | MCP Service    |  | Analytics      |  | Platform          |    |
| |                |  | Service        |  | Integration Service|    |
| +----------------+  +----------------+  +-------------------+    |
|                                                                  |
| +----------------+  +----------------+  +-------------------+    |
| |                |  |                |  |                   |    |
| | Collaboration  |  | Branding       |  | Automation        |    |
| | Service        |  | Service        |  | Service           |    |
| +----------------+  +----------------+  +-------------------+    |
|                                                                  |
| +----------------+                                               |
| |                |                                               |
| | Dependencies   |                                               |
| | Service        |                                               |
| +----------------+                                               |
+------------------------------------------------------------------+
```

## Tecnologías Utilizadas

1. **Frontend**: Next.js con Tailwind CSS (tema oscuro)
2. **Backend**: Next.js API Routes + Cloudflare Workers
3. **Base de Datos**: Cloudflare D1 (SQLite compatible)
4. **Autenticación**: JWT con OAuth 2.0
5. **Comunicación**: REST API + WebSockets para tiempo real
6. **Despliegue**: Cloudflare Pages + Workers

## Estrategia de Implementación

1. Desarrollar servicios core primero (User, Gateway, Frontend)
2. Implementar servicios secundarios de forma incremental
3. Integrar servicios mediante API Gateway
4. Implementar comunicación en tiempo real para colaboración
5. Desplegar en Cloudflare para alta disponibilidad
