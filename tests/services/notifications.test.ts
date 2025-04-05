import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';
import { PrismaClient, Prisma } from '@prisma/client';
import fetch from 'node-fetch';

// Asegurarnos que fetch está mockeado
jest.mock('node-fetch');



const prisma = new PrismaClient();
const API_URL = 'http://localhost:3000/api';

const testUser: Prisma.UserCreateInput = {
  email: 'notifications-test@example.com',
  password: 'password123',
  name: 'Test User',
  role: 'USER'
};

let authToken = '';
let userId: string;

describe('Servicio de Notificaciones', () => {
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

  it('Debe enviar una notificación', async () => {
    const notificationData = {
      title: 'Test Notification',
      message: 'Test Message',
      type: 'INFO'
    };

    const response = await fetch(`${API_URL}/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(notificationData)
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.title).toBe(notificationData.title);
  });

  it('Debe listar notificaciones', async () => {
    const response = await fetch(`${API_URL}/notifications`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.notifications)).toBe(true);
  });
}); 