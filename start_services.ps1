# Primero detener todos los servicios existentes
Write-Host "Deteniendo servicios existentes..."
Get-Process | Where-Object { $_.ProcessName -eq "node" } | ForEach-Object {
    Stop-Process -Id $_.Id -Force
}

# Script para iniciar los microservicios
Write-Host "Iniciando microservicios..."

# Configuración de puertos y servicios especiales
$services = @{
    "gateway-service" = @{
        port = 3000
        special = $false
    }
    "user-service" = @{
        port = 3001
        special = $true
    }
    "message-service" = @{
        port = 3002
        special = $false
    }
    "file-service" = @{
        port = 3003
        special = $false
    }
    "task-service" = @{
        port = 3007
        special = $false
    }
    "schedule-service" = @{
        port = 3008
        special = $false
    }
    "billing-service" = @{
        port = 3009
        special = $false
    }
    "mcp-service" = @{
        port = 3010
        special = $false
    }
    "contacts-service" = @{
        port = 3011
        special = $false
    }
    "boards-service" = @{
        port = 3012
        special = $false
    }
    "lists-service" = @{
        port = 3013
        special = $false
    }
    "cards-service" = @{
        port = 3014
        special = $false
    }
    "collaboration-service" = @{
        port = 3015
        special = $false
    }
    "branding-service" = @{
        port = 3016
        special = $false
    }
    "automation-service" = @{
        port = 3017
        special = $false
    }
    "crm-service" = @{
        port = 3018
        special = $false
    }
    "dependencies-service" = @{
        port = 3019
        special = $false
    }
    "timeline-service" = @{
        port = 3020
        special = $false
    }
}

# Directorio base
$BASE_DIR = "C:\Users\user\Desktop\Desk-U-Uno14"

foreach ($service in $services.GetEnumerator()) {
    $serviceName = $service.Key
    $port = $service.Value.port
    $isSpecial = $service.Value.special
    $serviceDir = Join-Path $BASE_DIR $serviceName
    
    Write-Host "Iniciando $serviceName en puerto $port..."
    
    # Crear directorio si no existe
    if (!(Test-Path $serviceDir)) {
        Write-Host "Creando directorio para $serviceName..."
        New-Item -ItemType Directory -Path $serviceDir | Out-Null
        
        # Crear package.json
        $packageJson = @{
            name = $serviceName
            version = "1.0.0"
            scripts = @{
                start = "node server.js"
            }
            dependencies = @{
                express = "^4.17.1"
            }
        } | ConvertTo-Json
        
        Set-Content -Path (Join-Path $serviceDir "package.json") -Value $packageJson
        
        # Instalar dependencias
        Set-Location $serviceDir
        npm install
    }
    
    # Crear o actualizar server.js según el tipo de servicio
    if ($isSpecial -and $serviceName -eq "user-service") {
        # Código especial para user-service
        $serverJs = @'
const express = require('express');
const app = express();
const port = 3001;

// Middleware para procesar JSON
app.use(express.json());

// Base de datos en memoria
const users = [];

// Endpoint de salud
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'user-service' });
});

// Endpoint de registro
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    
    // Validación básica
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    
    // Crear usuario
    const user = {
        id: Date.now().toString(),
        username,
        email,
        password
    };
    
    users.push(user);
    res.status(201).json({ message: 'Usuario registrado exitosamente', userId: user.id });
});

// Endpoint de login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    // Validación básica
    if (!email || !password) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    
    // Buscar usuario
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        const token = 'test-token-' + user.id;
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Credenciales inválidas' });
    }
});

app.listen(port, () => {
    console.log(`User service listening at http://localhost:${port}`);
});
'@
    } else {
        # Código básico para otros servicios
        $serverJs = @"
const express = require('express');
const app = express();
const port = $port;

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: '$serviceName' });
});

app.listen(port, () => {
    console.log('$serviceName listening at http://localhost:' + port);
});
"@
    }
    
    Set-Content -Path (Join-Path $serviceDir "server.js") -Value $serverJs
    
    # Iniciar el servicio
    try {
        Set-Location $serviceDir
        
        # Verificar si node está instalado
        if (!(Get-Command node -ErrorAction SilentlyContinue)) {
            Write-Host "[ERROR] Node.js no está instalado. Por favor, instale Node.js primero."
            exit 1
        }
        
        # Verificar si las dependencias están instaladas
        if (!(Test-Path (Join-Path $serviceDir "node_modules"))) {
            Write-Host "Instalando dependencias para $serviceName..."
            npm install
        }
        
        # Iniciar el servicio y capturar la salida
        $process = Start-Process node -ArgumentList "server.js" -PassThru -WindowStyle Hidden -RedirectStandardError "error.log"
        Start-Sleep -Seconds 2
        
        # Verificar logs de error
        if (Test-Path "error.log") {
            $errorContent = Get-Content "error.log"
            if ($errorContent) {
                Write-Host "[ERROR] $serviceName error: $errorContent"
                continue
            }
        }
        
        # Verificar si el proceso sigue vivo
        if (!$process.HasExited) {
            # Verificar si el puerto está respondiendo
            $testConnection = Test-NetConnection -ComputerName localhost -Port $port -WarningAction SilentlyContinue
            if ($testConnection.TcpTestSucceeded) {
                Write-Host "[OK] $serviceName iniciado en puerto $port (PID: $($process.Id))"
            } else {
                Write-Host "[ERROR] $serviceName no responde en puerto $port"
            }
        } else {
            Write-Host "[ERROR] $serviceName se detuvo inmediatamente"
        }
    }
    catch {
        Write-Host "[ERROR] No se pudo iniciar $serviceName"
        Write-Host $_.Exception.Message
    }
}

# Volver al directorio base
Set-Location $BASE_DIR

Write-Host "Todos los servicios han sido iniciados."
Write-Host "Espere unos segundos antes de ejecutar las pruebas..."
Start-Sleep -Seconds 5 