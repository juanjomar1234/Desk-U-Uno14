'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, FileText, Users, Bell, Settings, Calendar } from 'lucide-react';

export default function Home() {
  useEffect(() => {
    // Verificar si hay token
    const token = localStorage.getItem('token');
    if (!token) {
      redirect('/login');
    }
  }, []);

  const modules = [
    {
      title: "Mensajes",
      description: "Gestión de comunicaciones internas",
      icon: MessageSquare,
      href: "/messages"
    },
    {
      title: "Archivos",
      description: "Documentos y recursos compartidos",
      icon: FileText,
      href: "/files"
    },
    {
      title: "Usuarios",
      description: "Administración de colaboradores",
      icon: Users,
      href: "/users"
    },
    {
      title: "Notificaciones",
      description: "Centro de notificaciones",
      icon: Bell,
      href: "/notifications"
    },
    {
      title: "Calendario",
      description: "Eventos y programación",
      icon: Calendar,
      href: "/calendar"
    },
    {
      title: "Configuración",
      description: "Ajustes del sistema",
      icon: Settings,
      href: "/settings"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Colaboradores UNO14
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Sistema de gestión integral para colaboradores
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Card key={module.title} className="hover:bg-accent/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{module.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {module.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
