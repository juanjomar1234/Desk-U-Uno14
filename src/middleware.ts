import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import logger from '@/lib/logger';

// Rutas que no requieren autenticación
const publicPaths = [
  '/login', 
  '/api/auth', 
  '/_next', 
  '/static', 
  '/favicon.ico',
  '/logs',           // Ruta de la página
  '/api/logs'        // Ruta de la API
];

// Middleware para autenticación y logging
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Log para debug
  logger.info('Middleware request', { 
    path,
    method: request.method,
    url: request.url
  });

  // Permitir acceso a rutas públicas sin autenticación
  if (publicPaths.some(p => path.startsWith(p))) {
    logger.info('Acceso público permitido', { path });
    return NextResponse.next();
  }

  // Para otras rutas, verificar autenticación
  const token = await getToken({ req: request });
  
  if (!token) {
    logger.warn('Unauthorized access attempt', { path });
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Registrar acceso a rutas protegidas
  if (path.startsWith('/api/')) {
    logger.info('Acceso a API', {
      userId: token?.sub,
      path,
      method: request.method
    });
  }

  logger.info('API request', {
    path: request.nextUrl.pathname,
    method: request.method,
    userId: token?.sub
  });

  return NextResponse.next();
}

// Configurar en qué rutas se ejecuta el middleware
export const config = {
  matcher: [
    '/',
    '/login',
    '/dashboard/:path*',
    '/api/:path*',
    '/logs',
    '/api/logs'
  ]
};
