import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';

// Simplificar el middleware para debug
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Log cada request para debug
  console.log('🔍 Middleware ejecutándose:', {
    path,
    method: request.method,
    url: request.url
  });

  // Redirigir la raíz a /logs
  if (path === '/') {
    console.log('🔄 Redirigiendo / a /logs');
    return NextResponse.redirect(new URL('/logs', request.url));
  }

  // Permitir todo acceso a /logs
  if (path === '/logs' || path.startsWith('/api/logs')) {
    console.log('✅ Acceso a logs permitido');
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|favicon.ico).*)']
};
