'use client'

import { cn } from '@/lib/utils'
import { 
  Users, MessageSquare, Layers, BarChart3, FileText, 
  Gateway, CheckSquare, Calendar, CreditCard, Brain,
  Contact, Layout, List, Square, Users2, Paintbrush,
  Workflow, UserRound, GitFork, Timeline, Zap
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const services = [
  { name: 'Dashboard', href: '/', icon: Layout },
  { name: 'Usuarios', href: '/users', icon: Users },
  { name: 'Mensajes', href: '/messages', icon: MessageSquare },
  { name: 'Integraciones', href: '/integrations', icon: Layers },
  { name: 'Analíticas', href: '/analytics', icon: BarChart3 },
  { name: 'Archivos', href: '/files', icon: FileText },
  { name: 'API Gateway', href: '/gateway', icon: Gateway },
  { name: 'Tareas', href: '/tasks', icon: CheckSquare },
  { name: 'Calendario', href: '/schedule', icon: Calendar },
  { name: 'Facturación', href: '/billing', icon: CreditCard },
  { name: 'MCP', href: '/mcp', icon: Brain },
  { name: 'Contactos', href: '/contacts', icon: Contact },
  { name: 'Tableros', href: '/boards', icon: Layout },
  { name: 'Listas', href: '/lists', icon: List },
  { name: 'Tarjetas', href: '/cards', icon: Square },
  { name: 'Colaboración', href: '/collaboration', icon: Users2 },
  { name: 'Marca', href: '/branding', icon: Paintbrush },
  { name: 'Automatización', href: '/automation', icon: Workflow },
  { name: 'CRM', href: '/crm', icon: UserRound },
  { name: 'Dependencias', href: '/dependencies', icon: GitFork },
  { name: 'Línea de tiempo', href: '/timeline', icon: Timeline }
]

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <div className={cn('pb-12 h-full', className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-xl font-semibold tracking-tight">
            Microservicios App
          </h2>
          <div className="space-y-1">
            {services.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className={cn(
                  'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  pathname === service.href
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <service.icon className="mr-2 h-4 w-4" />
                <span>{service.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
