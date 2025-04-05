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

// GET /api/users - Obtener usuarios
export async function GET(request: NextRequest) {
  try {
    const user = await authenticate(request);
    
    // Verificar si el usuario tiene permisos de administrador
    if (user.role !== 'ADMIN') {
      logger.warn('Intento de acceso no autorizado a lista de usuarios', { userId: user.id });
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Obtener usuarios con paginación
    const users = await prisma.user.findMany({
      take: limit,
      skip: (page - 1) * limit,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    // Obtener el total de usuarios para la paginación
    const total = await prisma.user.count();
    
    logger.info('Lista de usuarios consultada', { userId: user.id, count: users.length });
    
    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    logger.error('Error al obtener usuarios', { error: error.message });
    return NextResponse.json(
      { error: 'Error al obtener usuarios' },
      { status: 500 }
    );
  }
}

// POST /api/users - Crear un nuevo usuario
export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request);
    
    // Verificar si el usuario tiene permisos de administrador
    if (user.role !== 'ADMIN') {
      logger.warn('Intento de creación de usuario no autorizado', { userId: user.id });
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { name, email, password, role, image } = body;
    
    // Validación básica
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Se requieren los campos name, email y password' },
        { status: 400 }
      );
    }
    
    // Verificar si el email ya está en uso
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está en uso' },
        { status: 400 }
      );
    }
    
    // En una implementación real, hashearíamos la contraseña
    // const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear usuario
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password, // En producción: hashedPassword
        role: role || 'USER',
        image,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
      },
    });
    
    logger.info('Usuario creado', { 
      adminId: user.id, 
      newUserId: newUser.id, 
      newUserEmail: newUser.email 
    });
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    logger.error('Error al crear usuario', { error: error.message });
    return NextResponse.json(
      { error: 'Error al crear usuario' },
      { status: 500 }
    );
  }
}
