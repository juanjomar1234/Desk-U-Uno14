#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}Iniciando configuración del servidor...${NC}"

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js no encontrado. Instalando...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Verificar si PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    echo -e "${RED}PM2 no encontrado. Instalando...${NC}"
    sudo npm install -g pm2
fi

# Crear directorios necesarios
echo -e "${GREEN}Creando estructura de directorios...${NC}"
mkdir -p logs
mkdir -p data

# Instalar dependencias de cada servicio
echo -e "${GREEN}Instalando dependencias...${NC}"
for d in *-service/; do
    if [ -f "$d/package.json" ]; then
        echo "Instalando dependencias para $d"
        cd $d
        npm install --production
        cd ..
    fi
done

# Configurar variables de entorno
echo -e "${GREEN}Configurando variables de entorno...${NC}"
cat > .env << EOL
NODE_ENV=production
DB_HOST=${DB_HOST}
DB_USER=${DB_USER}
DB_PASS=${DB_PASS}
JWT_SECRET=${JWT_SECRET}
EOL

# Copiar .env a cada servicio
for d in *-service/; do
    cp .env "$d.env"
done

# Iniciar servicios con PM2
echo -e "${GREEN}Iniciando servicios con PM2...${NC}"
pm2 delete all || true
pm2 start ecosystem.config.js

# Guardar configuración de PM2
echo -e "${GREEN}Guardando configuración de PM2...${NC}"
pm2 save

# Configurar inicio automático
echo -e "${GREEN}Configurando inicio automático...${NC}"
pm2 startup

# Verificar estado de los servicios
echo -e "${GREEN}Verificando estado de los servicios...${NC}"
pm2 list

# Mostrar logs en tiempo real
echo -e "${GREEN}Mostrando logs de los servicios...${NC}"
pm2 logs --lines 50 