import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { PrismaClient, Prisma } from '@prisma/client';
import fetch from 'node-fetch';
import { API_ENDPOINTS } from '@/lib/api';
import { API_BASE_URL } from '../constants';

// Asegurarnos que fetch está mockeado
jest.mock('node-fetch');

const prisma = new PrismaClient();

const testUser: Prisma.UserCreateInput = {
  email: 'auth-test@example.com',
  password: 'password123',
  name: 'Test User',
  role: 'USER'
};

describe('Servicio de Autenticación', () => {
  beforeAll(async () => {
    await prisma.user.create({
      data: testUser
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: testUser.email }
    });
    await prisma.$disconnect();
  });

  it('Debe permitir iniciar sesión con credenciales válidas', async () => {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.login}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.token).toBeDefined();
  });

  it('Debe rechazar credenciales inválidas', async () => {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.login}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'invalid@example.com',
        password: 'wrong'
      })
    });

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe('Invalid credentials');
  });

  it('Debe permitir cerrar sesión', async () => {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.logout}`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer test-token' }
    });

    expect(response.status).toBe(200);
  });
});
