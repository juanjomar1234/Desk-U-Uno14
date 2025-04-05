import { PrismaClient, Prisma } from '@prisma/client';
import fetch from 'node-fetch';

// Asegurarnos que fetch está mockeado
jest.mock('node-fetch');


const prisma = new PrismaClient();
const API_URL = 'http://localhost:3000/api';

// Datos de prueba
const testUser: Prisma.UserCreateInput = {
  email: 'files-test@example.com',
  password: 'password123',
  name: 'Test User',
  role: 'USER'
};

let authToken = '';
let userId: string;

describe('Servicio de Archivos', () => {
  // Configuración inicial
  beforeAll(async () => {
    const user = await prisma.user.create({
      data: testUser
    });
    userId = user.id;
    
    // Obtener token de autenticación
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
  
  it('Debe listar archivos', async () => {
    const response = await fetch(`${API_URL}/files`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(Array.isArray(data.files)).toBe(true);
  });
  
  it('Debe subir un archivo', async () => {
    // Crear un FormData para simular la subida de un archivo
    const formData = new FormData();
    const fileContent = 'Contenido de prueba para el archivo';
    const file = new Blob([fileContent], { type: 'text/plain' });
    formData.append('file', file, 'test.txt');
    
    const response = await fetch(`${API_URL}/files`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: formData
    });
    
    const data = await response.json();
    expect(response.status).toBe(201);
    expect(data.id).toBeDefined();
    expect(data.name).toBe('test.txt');
    
    // Guardar el ID del archivo para eliminarlo después
    const fileId = data.id;
    
    // Eliminar el archivo creado
    await fetch(`${API_URL}/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
  });
});
