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
import { MessageSquare, Send, Image, Paperclip, Users } from "lucide-react"

export default function MessageServicePage() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-3xl font-bold tracking-tight">Servicio de Mensajes</h2>
      <p className="text-muted-foreground">
        Gestión y procesamiento de mensajes para la plataforma de microservicios.
      </p>
      
      <Tabs defaultValue="inbox" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inbox">Bandeja de entrada</TabsTrigger>
          <TabsTrigger value="sent">Enviados</TabsTrigger>
          <TabsTrigger value="compose">Redactar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inbox" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mensajes Recibidos</CardTitle>
              <CardDescription>
                Mensajes recibidos recientemente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md border p-4 hover:bg-accent cursor-pointer">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-blue-500" />
                      <p className="text-sm font-medium">Actualización del proyecto</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Carlos López: Hemos completado la fase inicial del...</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Hace 10 min</span>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-md border p-4 hover:bg-accent cursor-pointer">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-blue-500" />
                      <p className="text-sm font-medium">Reunión de equipo</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Ana Martínez: Recordatorio de la reunión de mañana a las...</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Hace 1 hora</span>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-md border p-4 hover:bg-accent cursor-pointer">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                      <p className="text-sm font-medium">Documentación técnica</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Laura Sánchez: Te comparto la documentación actualizada...</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Ayer</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mensajes Enviados</CardTitle>
              <CardDescription>
                Mensajes enviados recientemente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md border p-4 hover:bg-accent cursor-pointer">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-green-500" />
                      <p className="text-sm font-medium">Respuesta: Actualización del proyecto</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Para: Carlos López - Excelente trabajo, continuemos con...</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Hace 5 min</span>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-md border p-4 hover:bg-accent cursor-pointer">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-green-500" />
                      <p className="text-sm font-medium">Solicitud de informe</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Para: Laura Sánchez - Necesito el informe mensual para...</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Ayer</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="compose" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Redactar Mensaje</CardTitle>
              <CardDescription>
                Envía un nuevo mensaje a usuarios o grupos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">Destinatario</Label>
                <div className="flex">
                  <Input id="recipient" placeholder="Nombre o correo electrónico" />
                  <Button variant="ghost" size="icon" className="ml-2">
                    <Users className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Asunto</Label>
                <Input id="subject" placeholder="Asunto del mensaje" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Mensaje</Label>
                <textarea 
                  id="message" 
                  placeholder="Escribe tu mensaje aquí..." 
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Image className="h-4 w-4" />
                </Button>
              </div>
              <Button>
                <Send className="h-4 w-4 mr-2" />
                Enviar
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
