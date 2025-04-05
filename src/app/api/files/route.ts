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

// GET /api/files - Obtener archivos del usuario
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
    
    // Obtener archivos con paginación
    const files = await prisma.file.findMany({
      where: filter,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    // Obtener el total de archivos para la paginación
    const total = await prisma.file.count({
      where: filter,
    });
    
    logger.info('Archivos consultados', { 
      userId: user.id, 
      count: files.length,
      search: search || undefined
    });
    
    return NextResponse.json({
      files,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    logger.error('Error al obtener archivos', { error: error.message });
    return NextResponse.json(
      { error: 'Error al obtener archivos' },
      { status: 500 }
    );
  }
}

// POST /api/files - Subir un nuevo archivo
export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request);
    
    // En una implementación real, procesaríamos el archivo subido
    // Por ahora, simulamos la creación de un registro de archivo
    const body = await request.json();
    const { name, size, mimeType } = body;
    
    // Validación básica
    if (!name || !size || !mimeType) {
      return NextResponse.json(
        { error: 'Se requieren los campos name, size y mimeType' },
        { status: 400 }
      );
    }
    
    // Simular ruta de archivo
    const path = `/uploads/${user.id}/${Date.now()}_${name}`;
    
    // Crear registro de archivo
    const file = await prisma.file.create({
      data: {
        name,
        path,
        size,
        mimeType,
        ownerId: user.id,
      },
    });
    
    logger.info('Archivo subido', { 
      userId: user.id, 
      fileId: file.id, 
      fileName: file.name,
      fileSize: file.size
    });
    
    return NextResponse.json(file, { status: 201 });
  } catch (error: any) {
    logger.error('Error al subir archivo', { error: error.message });
    return NextResponse.json(
      { error: 'Error al subir archivo' },
      { status: 500 }
    );
  }
}

// DELETE /api/files/:id - Eliminar un archivo
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request);
    const { id } = params;
    
    // Verificar si el archivo existe y pertenece al usuario
    const file = await prisma.file.findUnique({
      where: { id },
    });
    
    if (!file) {
      return NextResponse.json(
        { error: 'Archivo no encontrado' },
        { status: 404 }
      );
    }
    
    if (file.ownerId !== user.id) {
      logger.warn('Intento de eliminar archivo ajeno', { 
        userId: user.id, 
        fileId: id,
        ownerId: file.ownerId
      });
      
      return NextResponse.json(
        { error: 'No tienes permiso para eliminar este archivo' },
        { status: 403 }
      );
    }
    
    // En una implementación real, eliminaríamos el archivo físico
    // Por ahora, solo eliminamos el registro
    await prisma.file.delete({
      where: { id },
    });
    
    logger.info('Archivo eliminado', { 
      userId: user.id, 
      fileId: id, 
      fileName: file.name 
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    logger.error('Error al eliminar archivo', { error: error.message });
    return NextResponse.json(
      { error: 'Error al eliminar archivo' },
      { status: 500 }
    );
  }
}
