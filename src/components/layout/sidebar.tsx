'use client';

import Link from 'next/link';
import { useStore } from '@/store';

export default function Sidebar() {
  const sidebarOpen = useStore((state) => state.sidebarOpen);

  return (
    <aside className={`bg-gray-800 text-white ${sidebarOpen ? 'w-64' : 'w-20'} min-h-screen p-4`}>
      <nav>
        <ul>
          <li className="mb-2">
            <Link href="/dashboard" className="block p-2 hover:bg-gray-700 rounded">
              Dashboard
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/logs" className="block p-2 hover:bg-gray-700 rounded">
              Logs
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
