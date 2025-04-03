import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function UserServicePage() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-3xl font-bold tracking-tight">Servicio de Usuarios</h2>
      <p className="text-muted-foreground">
        Gestión de usuarios y autenticación para la plataforma de microservicios.
      </p>
      
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="authentication">Autenticación</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Crear Usuario</CardTitle>
              <CardDescription>
                Añade un nuevo usuario a la plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" placeholder="Nombre completo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input id="email" type="email" placeholder="correo@ejemplo.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                  <option value="manager">Gerente</option>
                </select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Crear Usuario</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Usuarios Recientes</CardTitle>
              <CardDescription>
                Lista de usuarios registrados recientemente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md border p-4">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Ana Martínez</p>
                    <p className="text-sm text-muted-foreground">ana.martinez@ejemplo.com</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-green-500/20 px-2 py-1 text-xs text-green-600">Activo</span>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-md border p-4">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Carlos López</p>
                    <p className="text-sm text-muted-foreground">carlos.lopez@ejemplo.com</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-green-500/20 px-2 py-1 text-xs text-green-600">Activo</span>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-md border p-4">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Laura Sánchez</p>
                    <p className="text-sm text-muted-foreground">laura.sanchez@ejemplo.com</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-yellow-500/20 px-2 py-1 text-xs text-yellow-600">Pendiente</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Roles</CardTitle>
              <CardDescription>
                Administra los roles y permisos de los usuarios.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md border p-4">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Administrador</p>
                    <p className="text-sm text-muted-foreground">Acceso completo a todas las funciones</p>
                  </div>
                  <Button variant="outline" size="sm">Editar</Button>
                </div>
                <div className="flex items-center justify-between rounded-md border p-4">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Gerente</p>
                    <p className="text-sm text-muted-foreground">Acceso a gestión de usuarios y reportes</p>
                  </div>
                  <Button variant="outline" size="sm">Editar</Button>
                </div>
                <div className="flex items-center justify-between rounded-md border p-4">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Usuario</p>
                    <p className="text-sm text-muted-foreground">Acceso básico a la plataforma</p>
                  </div>
                  <Button variant="outline" size="sm">Editar</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Crear Nuevo Rol</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="authentication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Autenticación</CardTitle>
              <CardDescription>
                Gestiona los métodos de autenticación y seguridad.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-y-0">
                <div>
                  <p className="font-medium">Autenticación de dos factores</p>
                  <p className="text-sm text-muted-foreground">
                    Requiere verificación adicional al iniciar sesión
                  </p>
                </div>
                <div className="ml-auto flex items-center space-x-2">
                  <Button variant="outline">Configurar</Button>
                </div>
              </div>
              <div className="flex items-center justify-between space-y-0">
                <div>
                  <p className="font-medium">Inicio de sesión con redes sociales</p>
                  <p className="text-sm text-muted-foreground">
                    Permite iniciar sesión con cuentas externas
                  </p>
                </div>
                <div className="ml-auto flex items-center space-x-2">
                  <Button variant="outline">Configurar</Button>
                </div>
              </div>
              <div className="flex items-center justify-between space-y-0">
                <div>
                  <p className="font-medium">Política de contraseñas</p>
                  <p className="text-sm text-muted-foreground">
                    Establece requisitos mínimos para contraseñas
                  </p>
                </div>
                <div className="ml-auto flex items-center space-x-2">
                  <Button variant="outline">Configurar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
