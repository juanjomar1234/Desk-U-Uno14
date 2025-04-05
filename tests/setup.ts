// Archivo de configuración para las pruebas
import { PrismaClient } from '@prisma/client';
import '@testing-library/jest-dom'
import { API_BASE_URL, AUTH_ENDPOINTS, API_ENDPOINTS as TEST_API_ENDPOINTS } from './constants';
import { API_ENDPOINTS, getApiUrl } from '@/lib/api';  // Actualizar importación

// Definir el tipo correcto para el mock de fetch
type FetchMock = jest.Mock<Promise<Response>, [RequestInfo | URL, RequestInit?]>;

// Definir interfaces para los tipos de body
interface RequestBody {
  title?: string;
  description?: string;
  email?: string;
  id?: string;
  password?: string;
  [key: string]: any;
}

// Definir el tipo de usuario de prueba
interface TestUser {
  id: string;
  email: string;
  name: string;
  password: string;
}

// Variables globales para tests
const testUser: TestUser = {
  id: 'test-user-id',
  email: 'test-user@example.com',
  name: 'Test User',
  password: 'test-password'
};

const integrationUser: TestUser = {
  id: 'integration-user-id', 
  email: 'integration-test@example.com',
  name: 'Integration Test User',
  password: 'test-password'
};

// Función auxiliar para normalizar URLs
const normalizeUrl = (url: string): string => {
  return url.replace(API_BASE_URL, '').replace(/^\/api/, '');
};

// Funciones auxiliares para el mock
const parseRequestBody = (body: any): RequestBody => {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as RequestBody;
    } catch {
      return {} as RequestBody;
    }
  } else if (body instanceof FormData) {
    return Object.fromEntries(body.entries()) as RequestBody;
  }
  return {} as RequestBody;
};

// Mock básico de fetch para tests
const mockFetch: FetchMock = jest.fn().mockImplementation(
  async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = input.toString();
    const body = parseRequestBody(init?.body);
    let status = 200;

    // Normalizar la URL para que coincida con los tests
    const normalizedUrl = normalizeUrl(url);

    // Manejar autenticación
    if (normalizedUrl.includes('/auth/login')) {
      if (init?.method !== 'POST') {
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }), 
          { status: 405 }
        );
      }

      if (body.email === 'invalid@example.com') {
        return new Response(
          JSON.stringify({ error: 'Invalid credentials' }), 
          { status: 401 }
        );
      }

      return new Response(
        JSON.stringify({ token: 'test-token' }), 
        { status: 200 }
      );
    }

    if (normalizedUrl.includes('/auth/logout')) {
      status = 200;
      return new Response(
        JSON.stringify({ message: 'Logged out' }), 
        { status }
      );
    }

    // Files
    if (normalizedUrl.includes('/files')) {
      if (init?.method === 'POST') {
        status = 201;
        return new Response(JSON.stringify({
          id: 'test-file-id',
          name: 'test.txt',
          size: 1024
        }), { status });
      }
      return new Response(JSON.stringify({
        id: 'test-file-id',
        name: 'test.txt',
        size: 1024,
        files: []
      }), { status });
    }

    const headers = init?.headers as Record<string, string>;

    // Mock específico para cada endpoint
    const responseData = (() => {
      // Timeline
      if (normalizedUrl.includes('/timeline')) {
        const timelineData = {
          id: 'test-timeline-id',
          userId: init?.method === 'POST' ? body.userId : testUser.id,
          events: []
        };
        if (init?.method === 'POST') {
          status = 201;
        }
        return timelineData;
      }

      // POST requests por defecto (excepto auth y timeline que ya están manejados)
      if (init?.method === 'POST' && !normalizedUrl.includes('/auth') && !normalizedUrl.includes('/timeline')) {
        status = 201;
      }

      // Users
      if (normalizedUrl.includes('/users/profile')) {
        if (headers?.Authorization?.includes('integration-test-token')) {
          return integrationUser;
        }
        return testUser;
      }

      if (normalizedUrl.includes('/users')) {
        return {
          ...testUser,
          users: []
        };
      }

      // Cards
      if (normalizedUrl.includes('/cards')) {
        if (init?.method === 'PUT') {
          return {
            id: 'test-card-id',
            title: body.title,
            description: body.description
          };
        }
        if (init?.method === 'POST') {
          status = 201;
        }
        return {
          id: 'test-card-id',
          title: 'Test Card',
          description: 'Test Description',
          cards: []
        };
      }

      // Boards y Cards
      if (normalizedUrl.includes('/boards')) {
        return {
          id: 'test-board-id',
          title: 'Test Board',
          columns: [{ id: 'test-column-id', title: 'Test Column' }],
          boards: []
        };
      }

      if (normalizedUrl.includes('/events')) {
        return {
          id: 'test-event-id',
          title: 'Test Event',
          events: []
        };
      }

      // Otros servicios
      if (normalizedUrl.includes('/notifications')) {
        return {
          id: 'test-notification-id',
          title: 'Test Notification',
          notifications: []
        };
      }

      if (normalizedUrl.includes('/messages')) {
        return {
          id: 'test-message-id',
          content: 'Test Message',
          messages: []
        };
      }

      if (normalizedUrl.includes('/workspaces')) {
        return {
          id: 'test-workspace-id',
          name: 'Test Workspace',
          workspaces: []
        };
      }

      if (normalizedUrl.includes('/schedule')) {
        if (init?.method === 'POST') {
          return {
            id: 'test-schedule-id',
            title: body.title || 'Test Schedule',
            schedules: []
          };
        }
        return {
          id: 'test-schedule-id',
          title: 'Test Schedule',
          schedules: []
        };
      }

      if (normalizedUrl.includes('/settings')) {
        return {
          id: 'test-settings-id',
          theme: 'dark',
          settings: {}
        };
      }

      if (normalizedUrl.includes('/tasks')) {
        return {
          id: 'test-task-id',
          title: 'Test Task',
          tasks: []
        };
      }

      if (normalizedUrl.includes('/rules')) {
        return {
          id: 'test-rule-id',
          name: 'Test Rule',
          rules: []
        };
      }

      if (normalizedUrl.includes('/lists')) {
        return {
          id: 'test-list-id',
          title: 'Test List',
          lists: []
        };
      }

      if (normalizedUrl.includes('/branding')) {
        return {
          id: 'test-brand-id',
          name: 'Test Brand',
          branding: {}
        };
      }

      if (normalizedUrl.includes('/contacts')) {
        return {
          id: 'test-contact-id',
          name: 'Test Contact',
          contacts: []
        };
      }

      if (normalizedUrl.includes('/billing')) {
        return {
          id: 'test-invoice-id',
          amount: 100,
          invoices: []
        };
      }

      if (normalizedUrl.includes('/logs')) {
        return {
          id: 'test-log-id',
          message: 'Test Log',
          logs: []
        };
      }

      if (normalizedUrl.includes('/analytics')) {
        return {
          stats: { users: 0 },
          activity: []
        };
      }

      if (normalizedUrl.includes('/integrations')) {
        return {
          integrations: []
        };
      }

      if (normalizedUrl.includes('/dependencies')) {
        return {
          dependencies: []
        };
      }

      if (normalizedUrl.includes('/mcp')) {
        status = 200;
        return {
          response: { message: 'OK' }
        };
      }

      if (normalizedUrl.includes('/crm')) {
        return {
          id: 'test-client-id',
          name: 'Test Client',
          clients: []
        };
      }

      // Respuesta por defecto
      return {
        id: 'test-id',
        message: 'OK'
      };
    })();

    return Promise.resolve(new Response(JSON.stringify(responseData), { status }));
  }
);

// Configuración global
global.fetch = mockFetch;
jest.mock('node-fetch', () => mockFetch);

// Mock de PrismaClient
const mockPrismaClient = {
  user: {
    findUnique: jest.fn().mockImplementation((args) => {
      // Retornar usuario de integración si coincide el ID
      if (args?.where?.id === integrationUser.id) {
        return Promise.resolve(integrationUser);
      }
      // Por defecto retornar el usuario de prueba
      return Promise.resolve(testUser);
    }),
    create: jest.fn().mockImplementation((args) => {
      // Retornar el usuario que se está creando
      return Promise.resolve(args.data);
    }),
    findMany: jest.fn().mockResolvedValue([testUser]),
    update: jest.fn().mockImplementation((args) => {
      return Promise.resolve({ ...testUser, ...args.data });
    }),
    delete: jest.fn().mockResolvedValue(testUser),
    deleteMany: jest.fn().mockResolvedValue({ count: 1 })
  },
  log: {
    create: jest.fn(),
    findMany: jest.fn().mockResolvedValue([]),
    deleteMany: jest.fn().mockResolvedValue({ count: 1 })
  },
  board: {
    deleteMany: jest.fn().mockResolvedValue({ count: 1 })
  },
  card: {
    deleteMany: jest.fn().mockResolvedValue({ count: 1 })
  },
  message: {
    deleteMany: jest.fn().mockResolvedValue({ count: 1 })
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  $transaction: jest.fn(async (operations) => Promise.all(operations))
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient)
}));

// Limpiar mocks después de cada test
afterEach(() => {
  mockFetch.mockClear();
  jest.clearAllMocks();
});

// Configuración global para las pruebas
let prisma: PrismaClient;

beforeAll(async () => {
  prisma = new PrismaClient();
  try {
    await prisma.$connect();
    console.log('Conexión a la base de datos establecida para pruebas');
    if (process.env.CI === 'true') {
      await prisma.$transaction([
        prisma.user.deleteMany({}),
        prisma.log.deleteMany({}),
        prisma.board.deleteMany({}),
        prisma.card.deleteMany({}),
        prisma.message.deleteMany({})
      ]);
    }
  } catch (error) {
    console.error('Error al conectar/limpiar BD:', error);
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});

// Extend expect matchers
expect.extend({});

// Mock del router de Next.js
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => "",
  useSearchParams: () => new URLSearchParams(),
}));

// Exportar las constantes actualizadas
export { API_BASE_URL as TEST_API_BASE_URL, AUTH_ENDPOINTS, TEST_API_ENDPOINTS };

// Configurar URL base para tests
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';
