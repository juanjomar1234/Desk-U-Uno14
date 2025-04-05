// Constantes para tests
export const TEST_API_BASE_URL = 'http://localhost:3000/api';

// Constantes compartidas
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout'
} as const;

export const API_ENDPOINTS = {
  USERS: '/users',
  PROFILE: '/users/profile',
  TASKS: '/tasks',
  DASHBOARD: '/dashboard',
  LOGS: '/logs'
} as const; 