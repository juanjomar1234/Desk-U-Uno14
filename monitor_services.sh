#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Verificar estado de PM2
echo -e "${GREEN}Estado de PM2:${NC}"
pm2 status

# Verificar uso de memoria
echo -e "\n${GREEN}Uso de memoria:${NC}"
free -h

# Verificar espacio en disco
echo -e "\n${GREEN}Espacio en disco:${NC}"
df -h

# Verificar puertos en uso
echo -e "\n${GREEN}Puertos en uso:${NC}"
netstat -tulpn | grep LISTEN

# Verificar logs de error
echo -e "\n${GREEN}Últimos errores:${NC}"
for d in *-service/; do
    if [ -f "$d/error.log" ]; then
        echo -e "${YELLOW}Errores en $d:${NC}"
        tail -n 5 "$d/error.log"
    fi
done 