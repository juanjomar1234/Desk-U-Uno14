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
import { FileText, Upload, Download, FolderOpen, Share2, Lock } from "lucide-react"

export default function FileServicePage() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-3xl font-bold tracking-tight">Servicio de Archivos</h2>
      <p className="text-muted-foreground">
        Gestión y almacenamiento de archivos para la plataforma de microservicios.
      </p>
      
      <Tabs defaultValue="files" className="space-y-4">
        <TabsList>
          <TabsTrigger value="files">Mis Archivos</TabsTrigger>
          <TabsTrigger value="upload">Subir Archivos</TabsTrigger>
          <TabsTrigger value="shared">Compartidos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="files" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Archivos Recientes</CardTitle>
              <CardDescription>
                Archivos subidos o modificados recientemente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md border p-4 hover:bg-accent cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">informe_mensual.pdf</p>
                      <p className="text-xs text-muted-foreground">2.4 MB - Modificado hace 2 horas</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-md border p-4 hover:bg-accent cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-green-500" />
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">datos_clientes.xlsx</p>
                      <p className="text-xs text-muted-foreground">1.8 MB - Modificado ayer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-md border p-4 hover:bg-accent cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <FolderOpen className="h-5 w-5 text-yellow-500" />
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Proyecto Marketing</p>
                      <p className="text-xs text-muted-foreground">8 archivos - Modificado hace 3 días</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subir Archivos</CardTitle>
              <CardDescription>
                Sube nuevos archivos a la plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-md p-10 text-center">
                <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm font-medium mb-1">Arrastra y suelta archivos aquí</p>
                <p className="text-xs text-muted-foreground mb-4">o</p>
                <Button>Seleccionar Archivos</Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="folder">Carpeta de destino</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="root">Raíz</option>
                  <option value="documents">Documentos</option>
                  <option value="images">Imágenes</option>
                  <option value="projects">Proyectos</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="permissions">Permisos</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="private">Privado</option>
                  <option value="team">Equipo</option>
                  <option value="public">Público</option>
                </select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Subir Archivos</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="shared" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Archivos Compartidos</CardTitle>
              <CardDescription>
                Archivos compartidos contigo por otros usuarios.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md border p-4 hover:bg-accent cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-purple-500" />
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">presentacion_proyecto.pptx</p>
                      <p className="text-xs text-muted-foreground">Compartido por Ana Martínez - Hace 1 día</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Lock className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-md border p-4 hover:bg-accent cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-red-500" />
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">contrato_servicio.pdf</p>
                      <p className="text-xs text-muted-foreground">Compartido por Carlos López - Hace 3 días</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Lock className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
