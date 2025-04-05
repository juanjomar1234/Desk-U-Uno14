import { describe, it, expect, beforeAll } from '@jest/globals';
import { PrismaClient, Prisma } from '@prisma/client';
import fetch from 'node-fetch';

const prisma = new PrismaClient();
const API_URL = 'http://localhost:3000/api';

// Datos de prueba
const testUser: Prisma.UserCreateInput = {
  email: 'test-user@example.com',
  password: 'password123',
  name: 'Test User',
  role: 'USER'
};

describe('Servicio de Usuarios', () => {
  let authToken: string;

  beforeAll(async () => {
    // Crear usuario de prueba si no existe
    const existingUser = await prisma.user.findUnique({
      where: { email: testUser.email }
    });
    
    if (!existingUser) {
      const user = await prisma.user.create({
        data: testUser
      });
    }
    
    // Login para obtener token
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

  it('Debe obtener el perfil del usuario autenticado', async () => {
    const response = await fetch(`${API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.email).toBe(testUser.email);
    expect(data.name).toBe(testUser.name);
  });

  it('Debe listar usuarios', async () => {
    const response = await fetch(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.users)).toBe(true);
  });

  it('Debe obtener un usuario por ID', async () => {
    const response = await fetch(`${API_URL}/users/test-id`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.email).toBe(testUser.email);
    expect(data.name).toBe(testUser.name);
  });
});
