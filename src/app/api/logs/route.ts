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
    const body = await request.json();
    const { level, message, metadata, source, userId } = body;
    
    // Validación básica
    if (!level || !message) {
      return NextResponse.json(
        { error: 'Se requieren los campos level y message' },
        { status: 400 }
      );
    }
    
    // Crear log en la base de datos
    const log = await prisma.log.create({
      data: {
        level,
        message,
        metadata: metadata ? metadata : null,
        source: source || 'api',
        userId,
      },
    });
    
    // Registrar la creación del log
    logger.info('Log creado a través de API', { logId: log.id });
    
    return NextResponse.json(log, { status: 201 });
  } catch (error: any) {
    logger.error('Error al crear log', { error: error.message });
    return NextResponse.json(
      { error: 'Error al crear log' },
      { status: 500 }
    );
  }
}
