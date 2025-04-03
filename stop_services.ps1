# Script para detener los microservicios
Write-Host "Deteniendo microservicios..."

# Detener todos los procesos de node
Get-Process | Where-Object { $_.ProcessName -eq "node" } | ForEach-Object {
    Write-Host "Deteniendo proceso node: $($_.Id)"
    Stop-Process -Id $_.Id -Force
}

Write-Host "Todos los servicios han sido detenidos." 