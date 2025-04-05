import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import logger from '@/lib/logger';

// Middleware para verificar autenticación
async function authenticate(request: NextRequest) {
  // En una implementación real, verificaríamos el token JWT
  // Por ahora, simplemente simulamos un usuario autenticado
  return {
    id: '1',
    name: 'Usuario de Prueba',
    email: 'test@example.com',
    role: 'USER'
  };
}

// GET /api/events - Obtener eventos del calendario
export async function GET(request: NextRequest) {
  try {
    const user = await authenticate(request);
    const { searchParams } = new URL(request.url);
    
    // Parámetros de filtrado
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Construir filtro
    const filter: any = {
      ownerId: user.id
    };
    
    // Filtro de fechas
    if (startDate || endDate) {
      filter.OR = [];
      
      if (startDate && endDate) {
        // Eventos que comienzan o terminan dentro del rango
        filter.OR.push({
          startTime: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        });
        filter.OR.push({
          endTime: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        });
        // Eventos que abarcan todo el rango
        filter.OR.push({
          AND: [
            { startTime: { lte: new Date(startDate) } },
            { endTime: { gte: new Date(endDate) } }
          ]
        });
      } else if (startDate) {
        filter.startTime = { gte: new Date(startDate) };
      } else if (endDate) {
        filter.endTime = { lte: new Date(endDate) };
      }
    }
    
    // Obtener eventos con paginación
    const events = await prisma.event.findMany({
      where: filter,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        startTime: 'asc',
      },
    });
    
    // Obtener el total de eventos para la paginación
    const total = await prisma.event.count({
      where: filter,
    });
    
    logger.info('Eventos de calendario consultados', { 
      userId: user.id, 
      count: events.length,
      startDate: startDate || undefined,
      endDate: endDate || undefined
    });
    
    return NextResponse.json({
      events,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    logger.error('Error al obtener eventos de calendario', { error: error.message });
    return NextResponse.json(
      { error: 'Error al obtener eventos de calendario' },
      { status: 500 }
    );
  }
}

// POST /api/events - Crear un nuevo evento
export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request);
    const body = await request.json();
    const { title, description, startTime, endTime } = body;
    
    // Validación básica
    if (!title || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Se requieren los campos title, startTime y endTime' },
        { status: 400 }
      );
    }
    
    // Validar fechas
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: 'Formato de fecha inválido' },
        { status: 400 }
      );
    }
    
    if (start >= end) {
      return NextResponse.json(
        { error: 'La fecha de inicio debe ser anterior a la fecha de fin' },
        { status: 400 }
      );
    }
    
    // Crear evento
    const event = await prisma.event.create({
      data: {
        title,
        description,
        startTime: start,
        endTime: end,
        ownerId: user.id,
      },
    });
    
    logger.info('Evento de calendario creado', { 
      userId: user.id, 
      eventId: event.id, 
      eventTitle: event.title,
      startTime: event.startTime,
      endTime: event.endTime
    });
    
    return NextResponse.json(event, { status: 201 });
  } catch (error: any) {
    logger.error('Error al crear evento de calendario', { error: error.message });
    return NextResponse.json(
      { error: 'Error al crear evento de calendario' },
      { status: 500 }
    );
  }
}

// PUT /api/events/:id - Actualizar un evento
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request);
    const { id } = params;
    const body = await request.json();
    const { title, description, startTime, endTime } = body;
    
    // Verificar si el evento existe
    const event = await prisma.event.findUnique({
      where: { id },
    });
    
    if (!event) {
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      );
    }
    
    // Verificar si el usuario tiene permiso para actualizar el evento
    if (event.ownerId !== user.id) {
      logger.warn('Intento de actualizar evento ajeno', { 
        userId: user.id, 
        eventId: id,
        ownerId: event.ownerId
      });
      
      return NextResponse.json(
        { error: 'No tienes permiso para actualizar este evento' },
        { status: 403 }
      );
    }
    
    // Validar fechas si se proporcionan
    let start = event.startTime;
    let end = event.endTime;
    
    if (startTime) {
      start = new Date(startTime);
      if (isNaN(start.getTime())) {
        return NextResponse.json(
          { error: 'Formato de fecha de inicio inválido' },
          { status: 400 }
        );
      }
    }
    
    if (endTime) {
      end = new Date(endTime);
      if (isNaN(end.getTime())) {
        return NextResponse.json(
          { error: 'Formato de fecha de fin inválido' },
          { status: 400 }
        );
      }
    }
    
    if (start >= end) {
      return NextResponse.json(
        { error: 'La fecha de inicio debe ser anterior a la fecha de fin' },
        { status: 400 }
      );
    }
    
    // Actualizar evento
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title: title !== undefined ? title : event.title,
        description: description !== undefined ? description : event.description,
        startTime: start,
        endTime: end,
      },
    });
    
    logger.info('Evento de calendario actualizado', { 
      userId: user.id, 
      eventId: id, 
      eventTitle: updatedEvent.title
    });
    
    return NextResponse.json(updatedEvent);
  } catch (error: any) {
    logger.error('Error al actualizar evento de calendario', { error: error.message });
    return NextResponse.json(
      { error: 'Error al actualizar evento de calendario' },
      { status: 500 }
    );
  }
}

// DELETE /api/events/:id - Eliminar un evento
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request);
    const { id } = params;
    
    // Verificar si el evento existe
    const event = await prisma.event.findUnique({
      where: { id },
    });
    
    if (!event) {
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      );
    }
    
    // Verificar si el usuario tiene permiso para eliminar el evento
    if (event.ownerId !== user.id) {
      logger.warn('Intento de eliminar evento ajeno', { 
        userId: user.id, 
        eventId: id,
        ownerId: event.ownerId
      });
      
      return NextResponse.json(
        { error: 'No tienes permiso para eliminar este evento' },
        { status: 403 }
      );
    }
    
    // Eliminar evento
    await prisma.event.delete({
      where: { id },
    });
    
    logger.info('Evento de calendario eliminado', { 
      userId: user.id, 
      eventId: id, 
      eventTitle: event.title 
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    logger.error('Error al eliminar evento de calendario', { error: error.message });
    return NextResponse.json(
      { error: 'Error al eliminar evento de calendario' },
      { status: 500 }
    );
  }
}
