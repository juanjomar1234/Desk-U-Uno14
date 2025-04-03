# Script para ejecutar todas las pruebas en orden
$BASE_DIR = "C:\Users\user\Desktop\Desk-U-Uno14"
Set-Location $BASE_DIR

Write-Host "1. Deteniendo servicios existentes..."
.\stop_services.ps1

Write-Host "`n2. Verificando que no hay servicios corriendo..."
.\check_services.ps1

Write-Host "`n3. Iniciando servicios..."
.\start_services.ps1

Write-Host "`n4. Verificando servicios iniciados..."
.\check_services.ps1

Write-Host "`n5. Ejecutando pruebas..."
.\run_direct_tests.ps1 