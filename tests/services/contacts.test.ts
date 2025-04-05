import { PrismaClient, Prisma } from '@prisma/client';
import fetch from 'node-fetch';

// Asegurarnos que fetch está mockeado
jest.mock('node-fetch');


const prisma = new PrismaClient();
const API_URL = 'http://localhost:3000/api';

const testUser: Prisma.UserCreateInput = {
  email: 'contacts-test@example.com',
  password: 'password123',
  name: 'Test User',
  role: 'USER'
};

let authToken = '';
let userId: string;

describe('Servicio de Contactos', () => {
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

  it('Debe crear un contacto', async () => {
    const contactData = {
      name: 'Test Contact',
      email: 'contact@test.com',
      phone: '1234567890'
    };

    const response = await fetch(`${API_URL}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(contactData)
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.name).toBe(contactData.name);
  });

  it('Debe listar contactos', async () => {
    const response = await fetch(`${API_URL}/contacts`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.contacts)).toBe(true);
  });
});
