import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import logger from '@/lib/logger';

// GET /api/logs - Obtener logs con filtros
export async function GET() {
  console.log('📝 GET /api/logs called');
  try {
    const logs = await prisma.log.findMany({
      orderBy: { timestamp: 'desc' },
      take: 50
    });
    console.log(`✅ Found ${logs.length} logs`);
    return NextResponse.json({ logs });
  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

// POST /api/logs - Crear logs de prueba
export async function POST() {
  try {
    await prisma.log.createMany({
      data: [
        {
          level: 'INFO',
          message: 'Test log 1',
          timestamp: new Date(),
          source: 'test'
        },
        {
          level: 'ERROR',
          message: 'Test error log',
          timestamp: new Date(),
          source: 'test'
        },
        {
          level: 'WARN',
          message: 'Test warning',
          timestamp: new Date(),
          source: 'test'
        }
      ]
    });

    return NextResponse.json({ message: 'Test logs created' });
  } catch (error) {
    console.error('Error creating test logs:', error);
    return NextResponse.json({ error: 'Failed to create test logs' }, { status: 500 });
  }
}
