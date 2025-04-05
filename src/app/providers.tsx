'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { SessionProvider } from 'next-auth/react';
import useStore from '@/store';
import logger from '@/lib/logger';
import { Session, User } from '@/types/session';

function SessionSync() {
  const { data: authSession } = useSession();
  const setSession = useStore((state) => state.setSession);

  useEffect(() => {
    if (authSession?.user) {
      const user: User = {
        id: authSession.user.id,
        name: authSession.user.name || '',
        email: authSession.user.email || '',
        image: authSession.user.image || undefined,
        role: (authSession.user as any).role || 'user'
      };

      const session: Session = { user };
      setSession(session);
      
      logger.info('Sesión sincronizada', {
        userId: user.id,
        userName: user.name
      });
    } else {
      setSession(null);
    }
  }, [authSession, setSession]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionSync />
      {children}
    </SessionProvider>
  );
}
