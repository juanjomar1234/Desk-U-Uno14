'use client';

import { useEffect, useState } from 'react'
import { useLogs } from '@/hooks/useLogs'

type LogEntry = {
  timestamp: string;
  level: string;
  message: string;
  metadata?: Record<string, unknown>;
  source: string;
}

export default function LogsPage() {
  const { logs, loading, error, createLog } = useLogs()
  const logEntries = logs as LogEntry[]

  const handleCreateTestLogs = async () => {
    try {
      const response = await fetch('/api/logs', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to create test logs');
      window.location.reload();
    } catch (err) {
      console.error('Error creating test logs:', err);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error': return 'bg-red-100 text-red-800';
      case 'warn': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="p-4 bg-red-100 text-red-700 rounded">
      Error: {error}
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Server Logs</h1>
        <button 
          onClick={handleCreateTestLogs}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Create Test Logs
        </button>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {logEntries.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No logs found. Create some test logs to get started.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {logEntries.map((log, i) => (
              <div key={i} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(log.level)}`}>
                      {log.level}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {log.source}
                    </span>
                  </div>
                </div>
                <div className="text-gray-900">{log.message}</div>
                {log.metadata && (
                  <pre className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600 overflow-auto">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
