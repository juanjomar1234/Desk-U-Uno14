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

// GET /api/boards - Obtener tableros del usuario
export async function GET(request: NextRequest) {
  try {
    const user = await authenticate(request);
    const { searchParams } = new URL(request.url);
    
    // Parámetros de filtrado
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    
    // Construir filtro
    const filter: any = {
      ownerId: user.id,
    };
    
    if (search) {
      filter.name = {
        contains: search,
        mode: 'insensitive',
      };
    }
    
    // Obtener tableros con paginación
    const boards = await prisma.board.findMany({
      where: filter,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        columns: {
          orderBy: {
            position: 'asc',
          },
        },
      },
    });
    
    // Obtener el total de tableros para la paginación
    const total = await prisma.board.count({
      where: filter,
    });
    
    logger.info('Tableros consultados', { 
      userId: user.id, 
      count: boards.length,
      search: search || undefined
    });
    
    return NextResponse.json({
      boards,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    logger.error('Error al obtener tableros', { error: error.message });
    return NextResponse.json(
      { error: 'Error al obtener tableros' },
      { status: 500 }
    );
  }
}

// POST /api/boards - Crear un nuevo tablero
export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request);
    const body = await request.json();
    const { name, columns = [] } = body;
    
    // Validación básica
    if (!name) {
      return NextResponse.json(
        { error: 'Se requiere el campo name' },
        { status: 400 }
      );
    }
    
    // Crear tablero con columnas iniciales
    const board = await prisma.board.create({
      data: {
        name,
        ownerId: user.id,
        columns: {
          create: columns.length > 0 
            ? columns.map((column: any, index: number) => ({
                name: column.name,
                position: index,
              }))
            : [
                { name: 'Por hacer', position: 0 },
                { name: 'En progreso', position: 1 },
                { name: 'Completado', position: 2 },
              ],
        },
      },
      include: {
        columns: {
          orderBy: {
            position: 'asc',
          },
        },
      },
    });
    
    logger.info('Tablero creado', { 
      userId: user.id, 
      boardId: board.id, 
      boardName: board.name,
      columnsCount: board.columns.length
    });
    
    return NextResponse.json(board, { status: 201 });
  } catch (error: any) {
    logger.error('Error al crear tablero', { error: error.message });
    return NextResponse.json(
      { error: 'Error al crear tablero' },
      { status: 500 }
    );
  }
}

// PUT /api/boards/:id - Actualizar un tablero
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request);
    const { id } = params;
    const body = await request.json();
    const { name } = body;
    
    // Verificar si el tablero existe
    const board = await prisma.board.findUnique({
      where: { id },
    });
    
    if (!board) {
      return NextResponse.json(
        { error: 'Tablero no encontrado' },
        { status: 404 }
      );
    }
    
    // Verificar si el usuario tiene permiso para actualizar el tablero
    if (board.ownerId !== user.id) {
      logger.warn('Intento de actualizar tablero ajeno', { 
        userId: user.id, 
        boardId: id,
        ownerId: board.ownerId
      });
      
      return NextResponse.json(
        { error: 'No tienes permiso para actualizar este tablero' },
        { status: 403 }
      );
    }
    
    // Actualizar tablero
    const updatedBoard = await prisma.board.update({
      where: { id },
      data: {
        name: name !== undefined ? name : board.name,
      },
      include: {
        columns: {
          orderBy: {
            position: 'asc',
          },
        },
      },
    });
    
    logger.info('Tablero actualizado', { 
      userId: user.id, 
      boardId: id, 
      boardName: updatedBoard.name
    });
    
    return NextResponse.json(updatedBoard);
  } catch (error: any) {
    logger.error('Error al actualizar tablero', { error: error.message });
    return NextResponse.json(
      { error: 'Error al actualizar tablero' },
      { status: 500 }
    );
  }
}

// DELETE /api/boards/:id - Eliminar un tablero
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request);
    const { id } = params;
    
    // Verificar si el tablero existe
    const board = await prisma.board.findUnique({
      where: { id },
    });
    
    if (!board) {
      return NextResponse.json(
        { error: 'Tablero no encontrado' },
        { status: 404 }
      );
    }
    
    // Verificar si el usuario tiene permiso para eliminar el tablero
    if (board.ownerId !== user.id) {
      logger.warn('Intento de eliminar tablero ajeno', { 
        userId: user.id, 
        boardId: id,
        ownerId: board.ownerId
      });
      
      return NextResponse.json(
        { error: 'No tienes permiso para eliminar este tablero' },
        { status: 403 }
      );
    }
    
    // Eliminar tablero (las columnas y tarjetas se eliminarán en cascada)
    await prisma.board.delete({
      where: { id },
    });
    
    logger.info('Tablero eliminado', { 
      userId: user.id, 
      boardId: id, 
      boardName: board.name 
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    logger.error('Error al eliminar tablero', { error: error.message });
    return NextResponse.json(
      { error: 'Error al eliminar tablero' },
      { status: 500 }
    );
  }
}
