import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import logger from '@/lib/logger';

// Rutas que no requieren autenticación
const publicPaths = ['/login', '/api/auth'];

// Middleware para autenticación y logging
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const path = request.nextUrl.pathname;
  const isAuthPage = path.startsWith('/login');

  // Redirigir a login si no hay token y no es página de auth
  if (!token && !isAuthPage) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirigir a dashboard si hay token y está en página de auth
  if (token && isAuthPage) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Permitir rutas públicas
  if (publicPaths.some(p => path.startsWith(p))) {
    return NextResponse.next();
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
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
