import { PrismaClient, Prisma } from '@prisma/client';
import fetch from 'node-fetch';

// Asegurarnos que fetch está mockeado
jest.mock('node-fetch');


const prisma = new PrismaClient();
const API_URL = 'http://localhost:3000/api';

const testUser: Prisma.UserCreateInput = {
  email: 'billing-test@example.com',
  password: 'password123',
  name: 'Test User',
  role: 'USER'
};

let authToken = '';
let userId: string;

describe('Servicio de Facturación', () => {
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

  it('Debe crear una factura', async () => {
    const invoiceData = {
      amount: 100,
      description: 'Test Invoice'
    };

    const response = await fetch(`${API_URL}/billing/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(invoiceData)
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.amount).toBe(invoiceData.amount);
  });

  it('Debe listar facturas', async () => {
    const response = await fetch(`${API_URL}/billing/invoices`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.invoices)).toBe(true);
  });
});
