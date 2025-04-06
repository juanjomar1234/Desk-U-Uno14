# Desk-U-Uno14 Production Deployment Guide

## Required Files and Permissions

### Core Files
```bash
# Server Files (755 - executable)
server.js

# Configuration Files (644 - read-only)
.htaccess
.env
next.config.js
ecosystem.config.js

# Application Files (644 - read-only)
src/middleware.ts
src/app/api/health/route.ts
public/index.html

# Build Directory (755 - directory)
.next/
```

## Post-Deployment Steps

1. Set file permissions:
```bash
# Executables
chmod 755 server.js

# Configuration files
chmod 644 .htaccess
chmod 644 .env
chmod 644 next.config.js
chmod 644 ecosystem.config.js

# Application files
chmod 644 src/middleware.ts
chmod 644 src/app/api/health/route.ts
chmod 644 public/index.html

# Directories
chmod 755 .next/
chmod 755 src/
chmod 755 public/
```

2. Verify deployment:
```bash
curl http://localhost:3000/api/health
```
