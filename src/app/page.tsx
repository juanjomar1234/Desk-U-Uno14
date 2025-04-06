'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

type LogEntry = {
  timestamp: string;
  level: string;
  message: string;
  metadata?: Record<string, unknown>;
  source: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    async function fetchLogs() {
      try {
        const response = await fetch('/api/logs');
        if (!response.ok) throw new Error('Failed to fetch logs');
        const data = await response.json();
        setLogs(data.logs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching logs');
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, []);

  const getLevelColor = (level: string) => {
    const isDark = theme === 'dark';
    switch (level.toLowerCase()) {
      case 'error': return isDark ? 'bg-red-900/50 text-red-200' : 'bg-red-100 text-red-800';
      case 'warn': return isDark ? 'bg-yellow-900/50 text-yellow-200' : 'bg-yellow-100 text-yellow-800';
      case 'info': return isDark ? 'bg-blue-900/50 text-blue-200' : 'bg-blue-100 text-blue-800';
      default: return isDark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen dark:bg-gray-900">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-4 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded">
      Error: {error}
    </div>
  );

  return (
    <div className="p-8 dark:bg-gray-900">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">System Logs</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {theme === 'dark' ? '🌞' : '🌙'}
          </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {logs.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No logs found.
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {logs.map((log, i) => (
              <div key={i} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(log.level)}`}>
                      {log.level}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                      {log.source}
                    </span>
                  </div>
                </div>
                <div className="text-gray-900 dark:text-gray-100 mb-2">{log.message}</div>
                {log.metadata && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4">
                    <pre className="text-xs text-gray-600 dark:text-gray-300 overflow-auto">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 