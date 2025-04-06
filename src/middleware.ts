import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Permitir todo acceso y solo registrar
  console.log('🔍 Request:', request.nextUrl.pathname);
  return NextResponse.next();
}

// Reducir el matcher al mínimo
export const config = {
  matcher: ['/api/:path*']
};
