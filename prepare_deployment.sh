#!/bin/bash

# Script para preparar el proyecto para despliegue

# Crear directorio para el paquete de despliegue
mkdir -p /home/ubuntu/deploy

# Copiar archivos del proyecto
echo "Copiando archivos del proyecto..."
cp -r /home/ubuntu/nextjs-microservices/* /home/ubuntu/deploy/

# Instalar dependencias de producción
echo "Instalando dependencias de producción..."
cd /home/ubuntu/deploy
npm install --production

# Generar cliente Prisma
echo "Generando cliente Prisma..."
npx prisma generate

# Construir la aplicación
echo "Construyendo la aplicación..."
npm run build

# Comprimir el paquete de despliegue
echo "Comprimiendo el paquete de despliegue..."
cd /home/ubuntu
zip -r nextjs-microservices.zip deploy

echo "Paquete de despliegue creado en /home/ubuntu/nextjs-microservices.zip"
echo "Listo para desplegar en Vercel y Railway/Supabase"
