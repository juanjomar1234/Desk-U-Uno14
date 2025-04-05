'use client';

import { useStore } from '@/store';

export default function Header() {
  const session = useStore((state) => state.session);

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-600">
          {session?.user?.email}
        </div>
      </div>
    </header>
  );
}
