import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Tipos para los logs
export type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';

export interface Log {
  id: string;
  level: LogLevel;
  message: string;
  metadata: any;
  source: string;
  timestamp: string;
  userId?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface LogPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface LogsResponse {
  logs: Log[];
  pagination: LogPagination;
}

// Hook personalizado para gestionar los logs
export function useLogs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [pagination, setPagination] = useState<LogPagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Función para obtener logs con filtros
  const fetchLogs = async (
    page: number = 1,
    limit: number = 10,
    level?: LogLevel,
    source?: string,
    userId?: string,
    startDate?: string,
    endDate?: string
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      // Construir URL con parámetros
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      if (level) params.append('level', level);
      if (source) params.append('source', source);
      if (userId) params.append('userId', userId);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      // Realizar la petición
      const response = await fetch(`/api/logs?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Error al obtener logs');
      }
      
      const data: LogsResponse = await response.json();
      
      setLogs(data.logs);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };
  
  // Función para crear un nuevo log
  const createLog = async (
    level: LogLevel,
    message: string,
    metadata?: any,
    source?: string,
    userId?: string
  ) => {
    try {
      const response = await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          level,
          message,
          metadata,
          source,
          userId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Error al crear log');
      }
      
      // Refrescar la lista de logs
      fetchLogs(pagination.page, pagination.limit);
      
      return await response.json();
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
      throw err;
    }
  };
  
  // Cargar logs iniciales
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const level = searchParams.get('level') as LogLevel | undefined;
    const source = searchParams.get('source') || undefined;
    const userId = searchParams.get('userId') || undefined;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    
    fetchLogs(page, limit, level, source, userId, startDate, endDate);
  }, [searchParams]);
  
  return {
    logs,
    pagination,
    loading,
    error,
    fetchLogs,
    createLog,
  };
}
