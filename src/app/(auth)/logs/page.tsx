'use client';

import { useEffect, useState } from 'react'
import { useLogs } from '@/hooks/useLogs'

type LogEntry = {
  timestamp: string;
  level: string;
  message: string;
  meta?: Record<string, unknown>;
}

export default function LogsPage() {
  const { logs, loading, error } = useLogs()
  const logEntries = logs as LogEntry[]

  if (loading) return <div>Loading logs...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Server Logs</h1>
      <div className="bg-white shadow rounded-lg p-4">
        <pre className="whitespace-pre-wrap text-sm">
          {logEntries.map((log, i) => (
            <div key={i} className="mb-2 p-2 border-b">
              <div className="font-bold">{new Date(log.timestamp).toLocaleString()}</div>
              <div className="text-blue-600">{log.level}</div>
              <div>{log.message}</div>
              {log.meta && (
                <div className="text-gray-600">
                  {JSON.stringify(log.meta, null, 2)}
                </div>
              )}
            </div>
          ))}
        </pre>
      </div>
    </div>
  )
}
