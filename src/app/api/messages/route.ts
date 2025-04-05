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

// GET /api/messages - Obtener mensajes del usuario
export async function GET(request: NextRequest) {
  try {
    const user = await authenticate(request);
    const { searchParams } = new URL(request.url);
    
    // Parámetros de filtrado
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type') || 'received'; // received o sent
    
    // Construir filtro según el tipo
    const filter = type === 'sent' 
      ? { senderId: user.id } 
      : { recipientId: user.id };
    
    // Obtener mensajes con paginación
    const messages = await prisma.message.findMany({
      where: filter,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
    
    // Obtener el total de mensajes para la paginación
    const total = await prisma.message.count({
      where: filter,
    });
    
    logger.info('Mensajes consultados', { 
      userId: user.id, 
      type, 
      count: messages.length 
    });
    
    return NextResponse.json({
      messages,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    logger.error('Error al obtener mensajes', { error: error.message });
    return NextResponse.json(
      { error: 'Error al obtener mensajes' },
      { status: 500 }
    );
  }
}

// POST /api/messages - Enviar un nuevo mensaje
export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request);
    const body = await request.json();
    const { recipientId, content } = body;
    
    // Validación básica
    if (!recipientId || !content) {
      return NextResponse.json(
        { error: 'Se requieren los campos recipientId y content' },
        { status: 400 }
      );
    }
    
    // Verificar si el destinatario existe
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
    });
    
    if (!recipient) {
      return NextResponse.json(
        { error: 'El destinatario no existe' },
        { status: 400 }
      );
    }
    
    // Crear mensaje
    const message = await prisma.message.create({
      data: {
        content,
        senderId: user.id,
        recipientId,
        status: 'sent',
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
    
    logger.info('Mensaje enviado', { 
      senderId: user.id, 
      recipientId, 
      messageId: message.id 
    });
    
    return NextResponse.json(message, { status: 201 });
  } catch (error: any) {
    logger.error('Error al enviar mensaje', { error: error.message });
    return NextResponse.json(
      { error: 'Error al enviar mensaje' },
      { status: 500 }
    );
  }
}
