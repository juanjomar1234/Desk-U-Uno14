import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';
import { PrismaClient, Prisma } from '@prisma/client';
import fetch from 'node-fetch';

// Asegurarnos que fetch está mockeado
jest.mock('node-fetch');



const prisma = new PrismaClient();
const API_URL = 'http://localhost:3000/api';

const testUser: Prisma.UserCreateInput = {
  email: 'settings-test@example.com',
  password: 'password123',
  name: 'Test User',
  role: 'USER'
};

let authToken = '';
let userId: string;

describe('Servicio de Configuración', () => {
  beforeAll(async () => {
    const user = await prisma.user.create({
      data: testUser
    });
    userId = user.id;
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
    
    const data = await response.json();
    authToken = data.token;
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: userId } });
    await prisma.$disconnect();
  });

  it('Debe actualizar configuración', async () => {
    const settingsData = {
      theme: 'dark',
      language: 'es',
      notifications: {
        email: true,
        push: false
      }
    };

    const response = await fetch(`${API_URL}/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(settingsData)
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.theme).toBe(settingsData.theme);
  });

  it('Debe obtener configuración', async () => {
    const response = await fetch(`${API_URL}/settings`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.settings).toBeDefined();
  });
}); 