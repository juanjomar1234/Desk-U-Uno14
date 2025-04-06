import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import logger from '@/lib/logger';

// GET /api/logs - Obtener logs con filtros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parámetros de filtrado
    const level = searchParams.get('level');
    const source = searchParams.get('source');
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '100');
    const page = parseInt(searchParams.get('page') || '1');
    
    // Construir filtro
    const filter: any = {};
    
    if (level) {
      filter.level = level;
    }
    
    if (source) {
      filter.source = source;
    }
    
    if (userId) {
      filter.userId = userId;
    }
    
    // Filtro de fechas
    if (startDate || endDate) {
      filter.timestamp = {};
      
      if (startDate) {
        filter.timestamp.gte = new Date(startDate);
      }
      
      if (endDate) {
        filter.timestamp.lte = new Date(endDate);
      }
    }
    
    // Obtener logs con paginación
    const logs = await prisma.log.findMany({
      where: filter,
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
      skip: (page - 1) * limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    
    // Obtener el total de logs para la paginación
    const total = await prisma.log.count({
      where: filter,
    });
    
    // Registrar la consulta
    logger.info('Logs consultados', { 
      filter, 
      count: logs.length,
      total,
      page,
      limit 
    });
    
    return NextResponse.json({
      logs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    logger.error('Error al obtener logs', { error: error.message });
    return NextResponse.json(
      { error: 'Error al obtener logs' },
      { status: 500 }
    );
  }
}

// POST /api/logs - Crear un nuevo log
export async function POST(request: NextRequest) {
  try {
    // Crear algunos logs de prueba
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

export async function getLatestLogs() {
  try {
    // Obtener los últimos 100 logs ordenados por fecha
    const logs = await prisma.log.findMany({
      orderBy: {
        timestamp: 'desc'
      },
      take: 100
    });

    console.log('Logs encontrados:', logs.length); // Debug

    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json({ error: 'Error fetching logs' }, { status: 500 });
  }
}
