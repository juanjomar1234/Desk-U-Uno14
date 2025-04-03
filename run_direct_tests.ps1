# Script equivalente para Windows PowerShell
Write-Host "Iniciando pruebas de integracion..."

# Directorio base
$BASE_DIR = "C:\Users\user\Desktop\Desk-U-Uno14"
$LOG_FILE = Join-Path $BASE_DIR "integration_tests.log"

# Función para realizar peticiones HTTP
function Test-Endpoint {
    param(
        [string]$service,
        [string]$endpoint,
        [string]$method = "GET",
        [string]$data,
        [string]$token
    )
    
    Write-Host "Probando $service - $endpoint ($method)"
    Add-Content $LOG_FILE "Probando $service - $endpoint ($method)"
    
    $headers = @{}
    if ($token) {
        $headers.Add("Authorization", "Bearer $token")
    }
    
    try {
        $params = @{
            Uri = $endpoint
            Method = $method
            Headers = $headers
        }
        
        if ($data) {
            $params.Add("Body", $data)
            $params.Add("ContentType", "application/json")
        }
        
        $result = Invoke-RestMethod @params
        Write-Host "[OK] Exito: $service - $endpoint"
        Add-Content $LOG_FILE "[OK] Exito: $service - $endpoint"
        return $result
    }
    catch {
        Write-Host "[ERROR] Fallo: $service - $endpoint"
        Add-Content $LOG_FILE "[ERROR] Fallo: $service - $endpoint"
        Add-Content $LOG_FILE $_.Exception.Message
        return $null
    }
}

# Inicializar archivo de log
Set-Content $LOG_FILE "=== PRUEBAS DE INTEGRACION DE MICROSERVICIOS ==="
Add-Content $LOG_FILE "Fecha: $(Get-Date)"
Add-Content $LOG_FILE "======================================="

# Probar servicios
Write-Host "=== Probando Gateway Service ==="
$gateway_health = Test-Endpoint "Gateway" "http://localhost:3000/health"

Write-Host "=== Probando User Service ==="
$user_health = Test-Endpoint "User Service" "http://localhost:3001/health"

# Registrar usuario de prueba
$register_data = @{
    username = "testuser"
    email = "test@example.com"
    password = "Password123!"
} | ConvertTo-Json

$register_response = Test-Endpoint "User Service - Register" "http://localhost:3001/register" "POST" $register_data

# Login
$login_data = @{
    email = "test@example.com"
    password = "Password123!"
} | ConvertTo-Json

$login_response = Test-Endpoint "User Service - Login" "http://localhost:3001/login" "POST" $login_data
$token = $login_response.token

if ($token) {
    Write-Host "[OK] Token de autenticacion obtenido correctamente"
    
    # Probar otros servicios con el token...
    Write-Host "=== Probando Message Service ==="
    $message_health = Test-Endpoint "Message Service" "http://localhost:3002/health"
    
    # Mas pruebas aqui...
}
else {
    Write-Host "[ERROR] No se pudo obtener token de autenticacion"
}

Write-Host "Pruebas de integracion finalizadas."
Write-Host "Ver detalles completos en: $LOG_FILE"
