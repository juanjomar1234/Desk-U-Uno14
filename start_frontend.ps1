# Ir al directorio del frontend
Set-Location -Path frontend-service

# Instalar dependencias
npm install --legacy-peer-deps

# Inicializar shadcn-ui
Write-Host "Inicializando shadcn-ui..."
echo "yes" | npx shadcn-ui@latest init
echo "yes" | npx shadcn-ui@latest add button
echo "yes" | npx shadcn-ui@latest add card
echo "yes" | npx shadcn-ui@latest add input
echo "yes" | npx shadcn-ui@latest add toast
echo "yes" | npx shadcn-ui@latest add sonner

# Instalar lucide-react
npm install lucide-react --legacy-peer-deps

# Iniciar el servidor de desarrollo
npx next dev 