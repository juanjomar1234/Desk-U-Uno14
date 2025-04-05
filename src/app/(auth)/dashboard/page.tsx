'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import useStore from '@/store';
import logger from '@/lib/logger';

// Página principal del dashboard
export default function DashboardPage() {
  const [stats, setStats] = useState({
    users: 0,
    messages: 0,
    files: 0,
    tasks: 0,
    events: 0,
    logs: 0
  });
  
  const [loading, setLoading] = useState(true);
  
  // Cargar estadísticas al montar el componente
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // En una implementación real, obtendríamos estos datos de las APIs
        // Por ahora, simulamos datos
        setStats({
          users: 24,
          messages: 156,
          files: 87,
          tasks: 42,
          events: 18,
          logs: 312
        });
        
        logger.info('Dashboard cargado con estadísticas');
      } catch (error: any) {
        logger.error('Error al cargar estadísticas del dashboard', { error: error.message });
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tarjeta de usuarios */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Usuarios</h2>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.users}</p>
              </div>
            </div>
          </div>
          
          {/* Tarjeta de mensajes */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-500 dark:text-green-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Mensajes</h2>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.messages}</p>
              </div>
            </div>
          </div>
          
          {/* Tarjeta de archivos */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-500 dark:text-yellow-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Archivos</h2>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.files}</p>
              </div>
            </div>
          </div>
          
          {/* Tarjeta de tareas */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-500 dark:text-purple-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Tareas</h2>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.tasks}</p>
              </div>
            </div>
          </div>
          
          {/* Tarjeta de eventos */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Eventos</h2>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.events}</p>
              </div>
            </div>
          </div>
          
          {/* Tarjeta de logs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-500 dark:text-indigo-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Logs</h2>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.logs}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Actividad reciente</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Sistema de microservicios implementado con Next.js 14, React 18.2, Tailwind CSS, Prisma y PostgreSQL.
          Incluye un nuevo servicio de logs para registrar actividades del sistema y de los usuarios.
        </p>
      </div>
    </div>
  );
}
