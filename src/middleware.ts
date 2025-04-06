import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import logger from '@/lib/logger';

// Rutas que no requieren autenticación
const publicPaths = ['/login', '/api/auth', '/_next', '/static', '/favicon.ico'];

// Middleware para autenticación y logging
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Redirigir la ruta raíz a login
  if (path === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Permitir rutas públicas inmediatamente
  if (publicPaths.some(p => path.startsWith(p))) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request });
  const isAuthPage = path.startsWith('/login');

  // Redirigir a login si no hay token y no es página de auth
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirigir a dashboard si hay token y está en página de auth
  if (token && isAuthPage) {
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
    // Cambiar el matcher para ser más específico
    '/',
    '/login',
    '/dashboard/:path*',
    '/api/:path*'
  ]
};
