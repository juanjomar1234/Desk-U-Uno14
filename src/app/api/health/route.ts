import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
      uptime: process.uptime()
    });
  } catch (error: any) {
    console.error('Health check failed:', error);
    const errorMessage = error?.message || 'Unknown error';
    return NextResponse.json(
      { status: 'error', message: errorMessage },
      { status: 500 }
    );
  }
} 