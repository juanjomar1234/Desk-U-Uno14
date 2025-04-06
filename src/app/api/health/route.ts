import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
      uptime: process.uptime()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({ status: 'error', error: error.message }, { status: 500 });
  }
} 