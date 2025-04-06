'use client';

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Header from '@/components/layout/header'
import Sidebar from '@/components/layout/sidebar'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="flex-1 w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
