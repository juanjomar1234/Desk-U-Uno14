import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  console.log('🔍 Middleware path:', path);

  // Permitir acceso a archivos estáticos y rutas específicas
  if (
    path === '/' || 
    path === '/favicon.ico' ||
    path.startsWith('/api/logs')
  ) {
    console.log('✅ Permitiendo acceso a:', path);
    return NextResponse.next();
  }

  // Para otras rutas, permitir acceso por defecto
  console.log('👉 Acceso por defecto a:', path);
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image).*)',
  ],
};
