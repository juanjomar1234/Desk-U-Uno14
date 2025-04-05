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

// GET /api/cards - Obtener tarjetas
export async function GET(request: NextRequest) {
  try {
    const user = await authenticate(request);
    const { searchParams } = new URL(request.url);
    
    // Parámetros de filtrado
    const columnId = searchParams.get('columnId');
    const assigneeId = searchParams.get('assigneeId');
    
    // Validación básica
    if (!columnId) {
      return NextResponse.json(
        { error: 'Se requiere el parámetro columnId' },
        { status: 400 }
      );
    }
    
    // Verificar si la columna existe y pertenece a un tablero del usuario
    const column = await prisma.column.findUnique({
      where: { id: columnId },
      include: {
        board: true,
      },
    });
    
    if (!column) {
      return NextResponse.json(
        { error: 'Columna no encontrada' },
        { status: 404 }
      );
    }
    
    if (column.board.ownerId !== user.id) {
      logger.warn('Intento de acceder a tarjetas de tablero ajeno', { 
        userId: user.id, 
        columnId,
        boardId: column.boardId,
        ownerId: column.board.ownerId
      });
      
      return NextResponse.json(
        { error: 'No tienes permiso para acceder a estas tarjetas' },
        { status: 403 }
      );
    }
    
    // Construir filtro
    const filter: any = {
      columnId,
    };
    
    if (assigneeId) {
      filter.assigneeId = assigneeId;
    }
    
    // Obtener tarjetas
    const cards = await prisma.card.findMany({
      where: filter,
      orderBy: {
        position: 'asc',
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
    
    logger.info('Tarjetas consultadas', { 
      userId: user.id, 
      columnId,
      boardId: column.boardId,
      count: cards.length
    });
    
    return NextResponse.json({ cards });
  } catch (error: any) {
    logger.error('Error al obtener tarjetas', { error: error.message });
    return NextResponse.json(
      { error: 'Error al obtener tarjetas' },
      { status: 500 }
    );
  }
}

// POST /api/cards - Crear una nueva tarjeta
export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request);
    const body = await request.json();
    const { title, description, columnId, assigneeId, position } = body;
    
    // Validación básica
    if (!title || !columnId) {
      return NextResponse.json(
        { error: 'Se requieren los campos title y columnId' },
        { status: 400 }
      );
    }
    
    // Verificar si la columna existe y pertenece a un tablero del usuario
    const column = await prisma.column.findUnique({
      where: { id: columnId },
      include: {
        board: true,
      },
    });
    
    if (!column) {
      return NextResponse.json(
        { error: 'Columna no encontrada' },
        { status: 404 }
      );
    }
    
    if (column.board.ownerId !== user.id) {
      logger.warn('Intento de crear tarjeta en tablero ajeno', { 
        userId: user.id, 
        columnId,
        boardId: column.boardId,
        ownerId: column.board.ownerId
      });
      
      return NextResponse.json(
        { error: 'No tienes permiso para crear tarjetas en este tablero' },
        { status: 403 }
      );
    }
    
    // Verificar si el asignado existe (si se proporciona)
    if (assigneeId) {
      const assignee = await prisma.user.findUnique({
        where: { id: assigneeId },
      });
      
      if (!assignee) {
        return NextResponse.json(
          { error: 'El usuario asignado no existe' },
          { status: 400 }
        );
      }
    }
    
    // Determinar la posición de la nueva tarjeta
    let cardPosition = position;
    
    if (cardPosition === undefined) {
      // Si no se proporciona posición, colocar al final
      const lastCard = await prisma.card.findFirst({
        where: { columnId },
        orderBy: { position: 'desc' },
      });
      
      cardPosition = lastCard ? lastCard.position + 1 : 0;
    }
    
    // Crear tarjeta
    const card = await prisma.card.create({
      data: {
        title,
        description,
        position: cardPosition,
        columnId,
        assigneeId,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
    
    logger.info('Tarjeta creada', { 
      userId: user.id, 
      cardId: card.id, 
      cardTitle: card.title,
      columnId,
      boardId: column.boardId
    });
    
    return NextResponse.json(card, { status: 201 });
  } catch (error: any) {
    logger.error('Error al crear tarjeta', { error: error.message });
    return NextResponse.json(
      { error: 'Error al crear tarjeta' },
      { status: 500 }
    );
  }
}

// PUT /api/cards/:id - Actualizar una tarjeta
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request);
    const { id } = params;
    const body = await request.json();
    const { title, description, columnId, assigneeId, position } = body;
    
    // Verificar si la tarjeta existe
    const card = await prisma.card.findUnique({
      where: { id },
      include: {
        column: {
          include: {
            board: true,
          },
        },
      },
    });
    
    if (!card) {
      return NextResponse.json(
        { error: 'Tarjeta no encontrada' },
        { status: 404 }
      );
    }
    
    // Verificar si el usuario tiene permiso para actualizar la tarjeta
    if (card.column.board.ownerId !== user.id) {
      logger.warn('Intento de actualizar tarjeta en tablero ajeno', { 
        userId: user.id, 
        cardId: id,
        boardId: card.column.boardId,
        ownerId: card.column.board.ownerId
      });
      
      return NextResponse.json(
        { error: 'No tienes permiso para actualizar esta tarjeta' },
        { status: 403 }
      );
    }
    
    // Verificar si la columna existe (si se proporciona)
    let targetColumnId = card.columnId;
    
    if (columnId && columnId !== card.columnId) {
      const targetColumn = await prisma.column.findUnique({
        where: { id: columnId },
        include: {
          board: true,
        },
      });
      
      if (!targetColumn) {
        return NextResponse.json(
          { error: 'Columna destino no encontrada' },
          { status: 400 }
        );
      }
      
      if (targetColumn.board.ownerId !== user.id) {
        return NextResponse.json(
          { error: 'No tienes permiso para mover la tarjeta a este tablero' },
          { status: 403 }
        );
      }
      
      targetColumnId = columnId;
    }
    
    // Verificar si el asignado existe (si se proporciona)
    if (assigneeId && assigneeId !== card.assigneeId) {
      const assignee = await prisma.user.findUnique({
        where: { id: assigneeId },
      });
      
      if (!assignee) {
        return NextResponse.json(
          { error: 'El usuario asignado no existe' },
          { status: 400 }
        );
      }
    }
    
    // Actualizar tarjeta
    const updatedCard = await prisma.card.update({
      where: { id },
      data: {
        title: title !== undefined ? title : card.title,
        description: description !== undefined ? description : card.description,
        columnId: targetColumnId,
        assigneeId: assigneeId !== undefined ? assigneeId : card.assigneeId,
        position: position !== undefined ? position : card.position,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
    
    logger.info('Tarjeta actualizada', { 
      userId: user.id, 
      cardId: id, 
      cardTitle: updatedCard.title,
      columnChanged: columnId !== undefined && columnId !== card.columnId,
      assigneeChanged: assigneeId !== undefined && assigneeId !== card.assigneeId
    });
    
    return NextResponse.json(updatedCard);
  } catch (error: any) {
    logger.error('Error al actualizar tarjeta', { error: error.message });
    return NextResponse.json(
      { error: 'Error al actualizar tarjeta' },
      { status: 500 }
    );
  }
}

// DELETE /api/cards/:id - Eliminar una tarjeta
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request);
    const { id } = params;
    
    // Verificar si la tarjeta existe
    const card = await prisma.card.findUnique({
      where: { id },
      include: {
        column: {
          include: {
            board: true,
          },
        },
      },
    });
    
    if (!card) {
      return NextResponse.json(
        { error: 'Tarjeta no encontrada' },
        { status: 404 }
      );
    }
    
    // Verificar si el usuario tiene permiso para eliminar la tarjeta
    if (card.column.board.ownerId !== user.id) {
      logger.warn('Intento de eliminar tarjeta en tablero ajeno', { 
        userId: user.id, 
        cardId: id,
        boardId: card.column.boardId,
        ownerId: card.column.board.ownerId
      });
      
      return NextResponse.json(
        { error: 'No tienes permiso para eliminar esta tarjeta' },
        { status: 403 }
      );
    }
    
    // Eliminar tarjeta
    await prisma.card.delete({
      where: { id },
    });
    
    logger.info('Tarjeta eliminada', { 
      userId: user.id, 
      cardId: id, 
      cardTitle: card.title,
      columnId: card.columnId,
      boardId: card.column.boardId
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    logger.error('Error al eliminar tarjeta', { error: error.message });
    return NextResponse.json(
      { error: 'Error al eliminar tarjeta' },
      { status: 500 }
    );
  }
}
