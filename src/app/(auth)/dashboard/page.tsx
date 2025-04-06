'use client';

import { useSession } from 'next-auth/react'

export default function DashboardPage() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="grid gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Welcome {session?.user?.name}</h2>
            <p className="text-gray-600">This is your dashboard</p>
          </div>
          {/* Aquí puedes agregar más widgets o secciones */}
        </div>
      </div>
    </div>
  )
}
