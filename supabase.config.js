// Configuración para Supabase (alternativa a Railway)

// Este archivo contiene instrucciones para configurar PostgreSQL en Supabase
// Supabase proporciona una interfaz gráfica para gestionar la base de datos,
// por lo que gran parte de la configuración se realiza a través de su panel web.

// 1. Crear un nuevo proyecto en Supabase (https://supabase.com)
// 2. Obtener la URL de conexión y la clave anon/service_role
// 3. Configurar las siguientes variables de entorno en el proyecto de Vercel:

/*
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://postgres:your-password@your-project-id.supabase.co:5432/postgres
*/

// 4. Ejecutar las migraciones de Prisma contra la base de datos de Supabase:
// npx prisma migrate deploy

// 5. Para desarrollo local, configurar estas variables en el archivo .env
