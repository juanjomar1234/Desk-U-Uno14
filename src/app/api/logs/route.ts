import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import logger from '@/lib/logger';

// GET /api/logs - Obtener logs con filtros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    
    // Obtener los últimos logs ordenados por fecha
    const logs = await prisma.log.findMany({
      orderBy: {
        timestamp: 'desc'
      },
      take: limit
    });

    console.log('Logs encontrados:', logs.length);

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json({ error: 'Error fetching logs' }, { status: 500 });
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
