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

// GET /api/contacts - Obtener contactos del usuario
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
      filter.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // Obtener contactos con paginación
    const contacts = await prisma.contact.findMany({
      where: filter,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        name: 'asc',
      },
    });
    
    // Obtener el total de contactos para la paginación
    const total = await prisma.contact.count({
      where: filter,
    });
    
    logger.info('Contactos consultados', { 
      userId: user.id, 
      count: contacts.length,
      search: search || undefined
    });
    
    return NextResponse.json({
      contacts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    logger.error('Error al obtener contactos', { error: error.message });
    return NextResponse.json(
      { error: 'Error al obtener contactos' },
      { status: 500 }
    );
  }
}

// POST /api/contacts - Crear un nuevo contacto
export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request);
    const body = await request.json();
    const { name, email, phone, company } = body;
    
    // Validación básica
    if (!name) {
      return NextResponse.json(
        { error: 'Se requiere el campo name' },
        { status: 400 }
      );
    }
    
    // Crear contacto
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        company,
        ownerId: user.id,
      },
    });
    
    logger.info('Contacto creado', { 
      userId: user.id, 
      contactId: contact.id, 
      contactName: contact.name
    });
    
    return NextResponse.json(contact, { status: 201 });
  } catch (error: any) {
    logger.error('Error al crear contacto', { error: error.message });
    return NextResponse.json(
      { error: 'Error al crear contacto' },
      { status: 500 }
    );
  }
}

// PUT /api/contacts/:id - Actualizar un contacto
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request);
    const { id } = params;
    const body = await request.json();
    const { name, email, phone, company } = body;
    
    // Verificar si el contacto existe
    const contact = await prisma.contact.findUnique({
      where: { id },
    });
    
    if (!contact) {
      return NextResponse.json(
        { error: 'Contacto no encontrado' },
        { status: 404 }
      );
    }
    
    // Verificar si el usuario tiene permiso para actualizar el contacto
    if (contact.ownerId !== user.id) {
      logger.warn('Intento de actualizar contacto ajeno', { 
        userId: user.id, 
        contactId: id,
        ownerId: contact.ownerId
      });
      
      return NextResponse.json(
        { error: 'No tienes permiso para actualizar este contacto' },
        { status: 403 }
      );
    }
    
    // Actualizar contacto
    const updatedContact = await prisma.contact.update({
      where: { id },
      data: {
        name: name !== undefined ? name : contact.name,
        email: email !== undefined ? email : contact.email,
        phone: phone !== undefined ? phone : contact.phone,
        company: company !== undefined ? company : contact.company,
      },
    });
    
    logger.info('Contacto actualizado', { 
      userId: user.id, 
      contactId: id, 
      contactName: updatedContact.name
    });
    
    return NextResponse.json(updatedContact);
  } catch (error: any) {
    logger.error('Error al actualizar contacto', { error: error.message });
    return NextResponse.json(
      { error: 'Error al actualizar contacto' },
      { status: 500 }
    );
  }
}

// DELETE /api/contacts/:id - Eliminar un contacto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request);
    const { id } = params;
    
    // Verificar si el contacto existe
    const contact = await prisma.contact.findUnique({
      where: { id },
    });
    
    if (!contact) {
      return NextResponse.json(
        { error: 'Contacto no encontrado' },
        { status: 404 }
      );
    }
    
    // Verificar si el usuario tiene permiso para eliminar el contacto
    if (contact.ownerId !== user.id) {
      logger.warn('Intento de eliminar contacto ajeno', { 
        userId: user.id, 
        contactId: id,
        ownerId: contact.ownerId
      });
      
      return NextResponse.json(
        { error: 'No tienes permiso para eliminar este contacto' },
        { status: 403 }
      );
    }
    
    // Eliminar contacto
    await prisma.contact.delete({
      where: { id },
    });
    
    logger.info('Contacto eliminado', { 
      userId: user.id, 
      contactId: id, 
      contactName: contact.name 
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    logger.error('Error al eliminar contacto', { error: error.message });
    return NextResponse.json(
      { error: 'Error al eliminar contacto' },
      { status: 500 }
    );
  }
}
