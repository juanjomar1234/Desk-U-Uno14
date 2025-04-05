import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';
import { PrismaClient, Prisma } from '@prisma/client';
import fetch from 'node-fetch';

// Asegurarnos que fetch está mockeado
jest.mock('node-fetch');


const prisma = new PrismaClient();
const API_URL = 'http://localhost:3000/api';

// Datos de prueba
const testUser: Prisma.UserCreateInput = {
  email: 'tasks-test@example.com',
  password: 'password123',
  name: 'Test User',
  role: 'USER'
};

let authToken = '';
let userId: string;

describe('Servicio de Tareas', () => {
  beforeAll(async () => {
    const user = await prisma.user.create({
      data: testUser
    });
    userId = user.id;
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
    
    const data = await response.json();
    authToken = data.token;
  });

  afterAll(async () => {
    await prisma.user.delete({
      where: { id: userId }
    });
    await prisma.$disconnect();
  });

  it('Debe crear una tarea', async () => {
    const taskData = {
      title: 'Test Task',
      description: 'Test Description',
      priority: 'HIGH'
    };

    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(taskData)
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.title).toBe(taskData.title);
  });

  it('Debe obtener tareas', async () => {
    const response = await fetch(`${API_URL}/tasks`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.tasks)).toBe(true);
  });
});
