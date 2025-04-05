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

// GET /api/tasks - Obtener tareas del usuario
export async function GET(request: NextRequest) {
  try {
    const user = await authenticate(request);
    const { searchParams } = new URL(request.url);
    
    // Parámetros de filtrado
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || undefined;
    const priority = searchParams.get('priority') || undefined;
    
    // Construir filtro
    const filter: any = {
      OR: [
        { ownerId: user.id },
        { assigneeId: user.id }
      ]
    };
    
    if (status) {
      filter.status = status;
    }
    
    if (priority) {
      filter.priority = priority;
    }
    
    // Obtener tareas con paginación
    const tasks = await prisma.task.findMany({
      where: filter,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: [
        { dueDate: 'asc' },
        { createdAt: 'desc' }
      ],
    });
    
    // Obtener el total de tareas para la paginación
    const total = await prisma.task.count({
      where: filter,
    });
    
    logger.info('Tareas consultadas', { 
      userId: user.id, 
      count: tasks.length,
      status: status || undefined,
      priority: priority || undefined
    });
    
    return NextResponse.json({
      tasks,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    logger.error('Error al obtener tareas', { error: error.message });
    return NextResponse.json(
      { error: 'Error al obtener tareas' },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Crear una nueva tarea
export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request);
    const body = await request.json();
    const { title, description, priority, assigneeId, dueDate } = body;
    
    // Validación básica
    if (!title) {
      return NextResponse.json(
        { error: 'Se requiere el campo title' },
        { status: 400 }
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
    
    // Crear tarea
    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority || 'MEDIUM',
        ownerId: user.id,
        assigneeId,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: 'PENDING',
      },
    });
    
    logger.info('Tarea creada', { 
      userId: user.id, 
      taskId: task.id, 
      taskTitle: task.title,
      assigneeId: task.assigneeId || undefined
    });
    
    return NextResponse.json(task, { status: 201 });
  } catch (error: any) {
    logger.error('Error al crear tarea', { error: error.message });
    return NextResponse.json(
      { error: 'Error al crear tarea' },
      { status: 500 }
    );
  }
}

// PUT /api/tasks/:id - Actualizar una tarea
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request);
    const { id } = params;
    const body = await request.json();
    const { title, description, status, priority, assigneeId, dueDate } = body;
    
    // Verificar si la tarea existe
    const task = await prisma.task.findUnique({
      where: { id },
    });
    
    if (!task) {
      return NextResponse.json(
        { error: 'Tarea no encontrada' },
        { status: 404 }
      );
    }
    
    // Verificar si el usuario tiene permiso para actualizar la tarea
    if (task.ownerId !== user.id && task.assigneeId !== user.id) {
      logger.warn('Intento de actualizar tarea ajena', { 
        userId: user.id, 
        taskId: id,
        ownerId: task.ownerId
      });
      
      return NextResponse.json(
        { error: 'No tienes permiso para actualizar esta tarea' },
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
    
    // Actualizar tarea
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: title !== undefined ? title : task.title,
        description: description !== undefined ? description : task.description,
        status: status !== undefined ? status : task.status,
        priority: priority !== undefined ? priority : task.priority,
        assigneeId: assigneeId !== undefined ? assigneeId : task.assigneeId,
        dueDate: dueDate !== undefined ? new Date(dueDate) : task.dueDate,
      },
    });
    
    logger.info('Tarea actualizada', { 
      userId: user.id, 
      taskId: id, 
      taskTitle: updatedTask.title,
      newStatus: status !== undefined ? status : undefined
    });
    
    return NextResponse.json(updatedTask);
  } catch (error: any) {
    logger.error('Error al actualizar tarea', { error: error.message });
    return NextResponse.json(
      { error: 'Error al actualizar tarea' },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/:id - Eliminar una tarea
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request);
    const { id } = params;
    
    // Verificar si la tarea existe
    const task = await prisma.task.findUnique({
      where: { id },
    });
    
    if (!task) {
      return NextResponse.json(
        { error: 'Tarea no encontrada' },
        { status: 404 }
      );
    }
    
    // Verificar si el usuario tiene permiso para eliminar la tarea
    if (task.ownerId !== user.id) {
      logger.warn('Intento de eliminar tarea ajena', { 
        userId: user.id, 
        taskId: id,
        ownerId: task.ownerId
      });
      
      return NextResponse.json(
        { error: 'No tienes permiso para eliminar esta tarea' },
        { status: 403 }
      );
    }
    
    // Eliminar tarea
    await prisma.task.delete({
      where: { id },
    });
    
    logger.info('Tarea eliminada', { 
      userId: user.id, 
      taskId: id, 
      taskTitle: task.title 
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    logger.error('Error al eliminar tarea', { error: error.message });
    return NextResponse.json(
      { error: 'Error al eliminar tarea' },
      { status: 500 }
    );
  }
}
