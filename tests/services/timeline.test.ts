import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';
import { PrismaClient, Prisma } from '@prisma/client';
import fetch from 'node-fetch';
import { API_URL } from '../config';
import { prisma } from '@/lib/prisma';

// Asegurarnos que fetch está mockeado
jest.mock('node-fetch');

const testUser: Prisma.UserCreateInput = {
  email: 'timeline-test@example.com',
  password: 'password123',
  name: 'Test User',
  role: 'USER'
};

let authToken = '';
let userId: string;

describe('Servicio de Timeline', () => {
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

  it('Debe obtener timeline', async () => {
    const response = await fetch(`${API_URL}/timeline`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.events)).toBe(true);
  });

  it('should create a timeline entry', async () => {
    const response = await fetch(`${API_URL}/timeline`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        action: 'TEST_ACTION',
        details: 'Test timeline entry'
      })
    });

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.userId).toBe(userId);
  });
});
