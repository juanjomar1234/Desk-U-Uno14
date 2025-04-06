import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import logger from '@/lib/logger';

// Rutas que no requieren autenticación
const publicPaths = ['/login', '/api/auth'];

// Middleware para autenticación y logging
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const path = request.nextUrl.pathname;

  // Redirigir / a /login si no hay sesión
  if (path === '/' && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Permitir rutas públicas
  if (publicPaths.some(p => path.startsWith(p))) {
    return NextResponse.next();
  }

  // Redirigir a login si no hay token
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirigir / a /dashboard si hay sesión
  if (path === '/' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Registrar acceso a rutas protegidas
  if (path.startsWith('/api/')) {
    logger.info('Acceso a API', {
      userId: token?.sub,
      path,
      method: request.method
    });
  }

  return NextResponse.next();
}

// Configurar en qué rutas se ejecuta el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico (icono)
     * - public (archivos públicos)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
