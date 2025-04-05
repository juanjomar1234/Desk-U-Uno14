import { PrismaClient, Prisma } from '@prisma/client';
import fetch from 'node-fetch';

// Asegurarnos que fetch está mockeado
jest.mock('node-fetch');


const prisma = new PrismaClient();
const API_URL = 'http://localhost:3000/api';

const testUser: Prisma.UserCreateInput = {
  email: 'cards-test@example.com',
  password: 'password123',
  name: 'Test User',
  role: 'USER'
};

let authToken = '';
let userId: string;
let boardId = '';
let columnId = '';
let cardId = '';

describe('Servicio de Tarjetas', () => {
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
    
    // Crear un tablero para las pruebas
    const boardResponse = await fetch(`${API_URL}/boards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        name: 'Tablero para pruebas de tarjetas'
      })
    });
    
    const boardData = await boardResponse.json();
    boardId = boardData.id;
    columnId = boardData.columns[0].id;
  });

  it('Debe crear una tarjeta', async () => {
    const cardData = {
      title: 'Test Card',
      description: 'Test Description'
    };

    const response = await fetch(`${API_URL}/cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(cardData)
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.title).toBe(cardData.title);
    
    // Guardar el ID para usar en pruebas posteriores
    cardId = data.id;
  });

  it('Debe listar tarjetas', async () => {
    const response = await fetch(`${API_URL}/cards`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data.cards)).toBe(true);
  });

  it('Debe obtener tarjetas de una columna', async () => {
    const response = await fetch(`${API_URL}/cards?columnId=${columnId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.cards).toBeDefined();
    expect(Array.isArray(data.cards)).toBe(true);
  });
  
  it('Debe actualizar una tarjeta', async () => {
    // Primero asegurarse de que hay una tarjeta creada
    if (!cardId) {
      const createResponse = await fetch(`${API_URL}/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          title: 'Tarjeta para actualizar',
          columnId
        })
      });
      
      const createData = await createResponse.json();
      cardId = createData.id;
    }
    
    // Actualizar la tarjeta
    const updateData = {
      title: 'Tarjeta Actualizada',
      description: 'Nueva descripción'
    };
    
    const response = await fetch(`${API_URL}/cards/${cardId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(updateData)
    });
    
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.id).toBe(cardId);
    expect(data.title).toBe(updateData.title);
    expect(data.description).toBe(updateData.description);
  });
});
