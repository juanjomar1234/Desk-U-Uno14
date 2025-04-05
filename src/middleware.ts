import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import logger from '@/lib/logger';

// Middleware para autenticación y logging
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = await getToken({ req: request });

  // Rutas públicas
  if (path === '/login' || path === '/register') {
    if (token) {
      logger.info('Usuario autenticado intentando acceder a ruta pública', {
        userId: token.sub,
        path
      });
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Rutas protegidas
  if (!token && (path.startsWith('/api/') || path.startsWith('/dashboard'))) {
    logger.warn('Acceso no autorizado', { path });
    
    if (path.startsWith('/api/')) {
      return new NextResponse(
        JSON.stringify({ error: 'No autorizado' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }
    
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

  return NextResponse.next();
}

// Configurar rutas para aplicar el middleware
export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
    '/login',
    '/register'
  ]
};
