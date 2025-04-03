import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster theme="dark" />
        </ThemeProvider>
      </body>
    </html>
  );
}

export const metadata = {
  title: 'Colaboradores UNO14',
  description: 'Sistema de gestión de colaboradores',
};
