'use client';

import { useEffect, useState } from 'react'
import { useLogs } from '@/hooks/useLogs'

export default function LogsPage() {
  const { logs, loading, error } = useLogs()

  if (loading) return <div>Loading logs...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Server Logs</h1>
      <div className="bg-white shadow rounded-lg p-4">
        <pre className="whitespace-pre-wrap">
          {logs.map((log, i) => (
            <div key={i} className="mb-2">
              {JSON.stringify(log, null, 2)}
            </div>
          ))}
        </pre>
      </div>
    </div>
  )
}
