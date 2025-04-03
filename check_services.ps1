# Script para verificar el estado de los servicios
Write-Host "Verificando estado de los servicios..."

# Obtener todos los procesos de node
$nodeProcesses = Get-Process | Where-Object { $_.ProcessName -eq "node" }

if ($nodeProcesses) {
    Write-Host "Procesos node encontrados:"
    $nodeProcesses | ForEach-Object {
        Write-Host "PID: $($_.Id)"
    }
} else {
    Write-Host "No se encontraron procesos node corriendo."
}

# Verificar puertos en uso
Write-Host "`nVerificando puertos..."
$ports = @(3000, 3001, 3002, 3003)
foreach ($port in $ports) {
    $connection = Test-NetConnection -ComputerName localhost -Port $port -WarningAction SilentlyContinue
    Write-Host ("Puerto {0}: {1}" -f $port, $(if ($connection.TcpTestSucceeded) { "En uso" } else { "No disponible" }))
}