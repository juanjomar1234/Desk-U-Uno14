// Helper para construir URLs
export const getApiUrl = (path: string): string => {
  if (typeof window === 'undefined') {
    return `/api${path}`;
  }
  const base = process.env.NEXT_PUBLIC_API_URL || window.location.origin + '/api';
  return `${base}${path}`;
};

// Helper para cliente
export const getClientApiUrl = (path: string): string => {
  if (typeof window === 'undefined') {
    return `/api${path}`;
  }
  const base = process.env.NEXT_PUBLIC_API_URL || window.location.origin + '/api';
  try {
    return new URL(path, base).toString();
  } catch {
    return `${base}${path}`;
  }
};

// Helper para rutas absolutas
export const getAbsoluteUrl = (path: string): string => {
  if (typeof window === 'undefined') {
    return path;
  }
  return `${window.location.origin}${path}`;
};

// Endpoints de la API
export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout'
  }
} as const;

// Helper para llamadas a la API
export const fetchApi = async (path: string, options: RequestInit = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(path, {
    ...options,
    headers: defaultHeaders,
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  return response.json();
}; 