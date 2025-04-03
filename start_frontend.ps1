# Ir al directorio del frontend
Set-Location -Path frontend-service

# Limpiar instalación previa si existe
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue

# Instalar dependencias con flag legacy-peer-deps
npm install --legacy-peer-deps

# Instalar lucide-react si no está instalado
npm install lucide-react --legacy-peer-deps

# Instalar componentes si no existen
if (-not (Test-Path ".\src\components\ui")) {
    Write-Host "Instalando componentes UI..."
    npx shadcn-ui@latest init -y
    npx shadcn-ui@latest add button -y
    npx shadcn-ui@latest add input -y
    npx shadcn-ui@latest add card -y
    npx shadcn-ui@latest add toast -y
    npx shadcn-ui@latest add sonner -y
}

# Verificar que next está instalado
if (-not (Test-Path ".\node_modules\.bin\next.cmd")) {
    Write-Host "Instalando next explícitamente..."
    npm install next@latest --legacy-peer-deps
}

# Iniciar el servidor de desarrollo
npx next dev 