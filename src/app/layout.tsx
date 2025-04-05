import { ReactNode } from 'react';
import { Metadata } from 'next';
import Providers from './providers';

// Metadatos de la aplicación
export const metadata: Metadata = {
  title: 'Portal de Colaboradores',
  description: 'Aplicación de microservicios con Next.js 14, React 18.2, Tailwind CSS y Prisma',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Layout principal de la aplicación
export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-background">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
