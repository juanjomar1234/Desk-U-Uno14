import { NextRequest, NextResponse } from 'next/server';

// Simplificar al máximo para debug
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  console.log('🔍 Middleware path:', path);
  
  // Permitir todo acceso
  return NextResponse.next();
}

// Matcher mínimo
export const config = {
  matcher: ['/((?!_next/static|favicon.ico).*)']
};
