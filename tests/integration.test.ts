import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';
import { PrismaClient, Prisma } from '@prisma/client';
import fetch from 'node-fetch';
import { API_CONFIG } from '@/lib/api';
import { API_BASE_URL, AUTH_ENDPOINTS, API_ENDPOINTS } from './constants';
import { TEST_API_BASE_URL } from './constants';

// Asegurarnos que fetch está mockeado
jest.mock('node-fetch');

// Este archivo contiene las pruebas para verificar el funcionamiento del sistema


const prisma = new PrismaClient();

const testUser: Prisma.UserCreateInput = {
  email: 'integration-test@example.com',
  password: 'password123',
  name: 'Test User',
  role: 'USER'
};

let authToken = '';
let userId: string;

describe('Pruebas de Integración', () => {
  const integrationUser = {
    id: 'integration-user-id',
    email: 'integration-test@example.com',
    name: 'Integration Test User',
    password: 'test-password'
  };

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: integrationUser
    });
    userId = user.id;
    
    const response = await fetch(`${TEST_API_BASE_URL}${AUTH_ENDPOINTS.LOGIN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: integrationUser.email,
        password: integrationUser.password
      })
    });
    
    const data = await response.json();
    authToken = data.token;
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: userId } });
    await prisma.$disconnect();
  });

  it('Debe mantener la sesión a través de múltiples endpoints', async () => {
    // Crear una tarea
    const taskResponse = await fetch(`${TEST_API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        title: 'Integration Test Task',
        description: 'Test Description'
      })
    });

    expect(taskResponse.status).toBe(201);
    const taskData = await taskResponse.json();
    expect(taskData.title).toBeDefined();

    // Verificar el perfil
    const profileResponse = await fetch(`${TEST_API_BASE_URL}/users/profile`, {
      headers: {
        'Authorization': 'Bearer integration-test-token'
      }
    });

    expect(profileResponse.status).toBe(200);
    const profileData = await profileResponse.json();
    expect(profileData.email).toBe(integrationUser.email);
  });
});
