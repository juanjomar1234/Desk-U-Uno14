import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  return NextResponse.next()
}

// Deshabilitar completamente el middleware
export const config = {
  matcher: []
};
