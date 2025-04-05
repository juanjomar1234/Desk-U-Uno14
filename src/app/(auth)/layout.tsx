'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '@/store';
import Sidebar from '../../components/layout/sidebar';
import Header from '../../components/layout/header';

// Layout para rutas autenticadas
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const session = useStore((state) => state.session);

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="flex-1 overflow-y-auto p-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
