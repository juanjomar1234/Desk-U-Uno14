import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';
import { PrismaClient, Prisma } from '@prisma/client';
import fetch from 'node-fetch';

// Asegurarnos que fetch está mockeado
jest.mock('node-fetch');


const prisma = new PrismaClient();
const API_URL = 'http://localhost:3000/api';

// Datos de prueba
const testUser: Prisma.UserCreateInput = {
  email: 'messages-test@example.com',
  password: 'password123',
  name: 'Test User',
  role: 'USER'
};

let authToken = '';
let userId: string;

describe('Servicio de Mensajes', () => {
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

  it('Debe enviar un mensaje', async () => {
    const messageData = {
      content: 'Test Message',
      recipientId: userId
    };

    const response = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(messageData)
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.content).toBe(messageData.content);
  });

  it('Debe obtener mensajes recibidos', async () => {
    const response = await fetch(`${API_URL}/messages/received`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.messages)).toBe(true);
  });
});
