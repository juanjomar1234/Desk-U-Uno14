import { PrismaClient, Prisma } from '@prisma/client';
import fetch from 'node-fetch';

// Asegurarnos que fetch está mockeado
jest.mock('node-fetch');


const prisma = new PrismaClient();
const API_URL = 'http://localhost:3000/api';

const testUser: Prisma.UserCreateInput = {
  email: 'branding-test@example.com',
  password: 'password123',
  name: 'Test User',
  role: 'USER'
};

let authToken = '';
let userId: string;

describe('Servicio de Branding', () => {
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

  it('Debe actualizar configuración de marca', async () => {
    const brandingData = {
      name: 'Test Brand',
      logo: 'test-logo.png',
      colors: {
        primary: '#FF0000',
        secondary: '#00FF00'
      }
    };

    const response = await fetch(`${API_URL}/branding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(brandingData)
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.name).toBe(brandingData.name);
  });

  it('Debe obtener configuración de marca', async () => {
    const response = await fetch(`${API_URL}/branding`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.branding).toBeDefined();
  });
});
