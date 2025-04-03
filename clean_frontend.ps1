# Ir al directorio del frontend
Set-Location -Path frontend-service

# Detener cualquier proceso de Next.js
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# Limpiar cachés y archivos generados
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force src/components/ui -ErrorAction SilentlyContinue

# Limpiar caché de npm
npm cache clean --force 