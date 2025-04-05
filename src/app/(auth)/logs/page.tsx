'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useLogs, LogLevel } from '@/hooks/useLogs';
import { useRouter } from 'next/navigation';
import useStore from '@/store';

// Componente para visualizar logs
export default function LogsPage() {
  const router = useRouter();
  const session = useStore((state) => state.session);

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  // Estado para filtros
  const [level, setLevel] = useState<LogLevel | ''>('');
  const [source, setSource] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Usar el hook de logs
  const { logs, pagination, loading, error, fetchLogs } = useLogs();
  
  // Manejar cambio de página
  const handlePageChange = (newPage: number) => {
    fetchLogs(
      newPage,
      pagination.limit,
      level as LogLevel | undefined,
      source || undefined,
      undefined,
      startDate || undefined,
      endDate || undefined
    );
  };
  
  // Manejar búsqueda con filtros
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs(
      1,
      pagination.limit,
      level as LogLevel | undefined,
      source || undefined,
      undefined,
      startDate || undefined,
      endDate || undefined
    );
  };
  
  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Función para obtener color según nivel de log
  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case 'ERROR':
        return 'text-red-600';
      case 'WARN':
        return 'text-yellow-600';
      case 'INFO':
        return 'text-blue-600';
      case 'DEBUG':
        return 'text-gray-600';
      default:
        return '';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Registros del Sistema</h1>
      
      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nivel</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as LogLevel | '')}
              className="w-full p-2 border rounded"
            >
              <option value="">Todos</option>
              <option value="ERROR">Error</option>
              <option value="WARN">Advertencia</option>
              <option value="INFO">Información</option>
              <option value="DEBUG">Debug</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Fuente</label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Fuente del log"
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Fecha inicio</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Fecha fin</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="md:col-span-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Mensajes de error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Tabla de logs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Nivel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Mensaje
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Fuente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Detalles
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  {loading ? 'Cargando...' : 'No hay registros disponibles'}
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td className={`px-6 py-4 whitespace-nowrap ${getLevelColor(log.level)}`}>
                    {log.level}
                  </td>
                  <td className="px-6 py-4">
                    {log.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {log.source}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {log.user ? log.user.name : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(log.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {log.metadata ? (
                      <button
                        onClick={() => alert(JSON.stringify(log.metadata, null, 2))}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Ver detalles
                      </button>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Paginación */}
      {pagination.pages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div>
            Mostrando {pagination.page} de {pagination.pages} páginas
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1 || loading}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages || loading}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
