import { createLogger, format, transports } from 'winston';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configuración de niveles de log
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

// Crear el logger de Winston
const logger = createLogger({
  levels,
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.json()
  ),
  defaultMeta: { service: 'nextjs-microservices' },
  transports: [
    // Consola para desarrollo
    new transports.Console({
      level: process.env.LOG_LEVEL || 'info',
      format: format.combine(
        format.colorize(),
        format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
    }),
  ],
});

// Función para guardar logs en la base de datos
export async function logToDB(
  level: 'error' | 'warn' | 'info' | 'debug',
  message: string,
  metadata?: any,
  source?: string,
  userId?: string
) {
  try {
    await prisma.log.create({
      data: {
        level,
        message,
        metadata: metadata ? JSON.stringify(metadata) : null,
        source: source || 'system',
        userId,
      },
    });
  } catch (error) {
    // Si falla el guardado en DB, al menos lo registramos en la consola
    console.error('Error al guardar log en la base de datos:', error);
  }
}

// Funciones de ayuda para diferentes niveles de log
export function error(message: string, metadata?: any, source?: string, userId?: string) {
  logger.error(message, { metadata, source, userId });
  logToDB('error', message, metadata, source, userId);
}

export function warn(message: string, metadata?: any, source?: string, userId?: string) {
  logger.warn(message, { metadata, source, userId });
  logToDB('warn', message, metadata, source, userId);
}

export function info(message: string, metadata?: any, source?: string, userId?: string) {
  logger.info(message, { metadata, source, userId });
  logToDB('info', message, metadata, source, userId);
}

export function debug(message: string, metadata?: any, source?: string, userId?: string) {
  logger.debug(message, { metadata, source, userId });
  
  // Solo guardamos logs de debug en la base de datos si el nivel está configurado para ello
  if (process.env.LOG_LEVEL === 'debug') {
    logToDB('debug', message, metadata, source, userId);
  }
}

// Exportar el logger completo y funciones individuales
export default {
  error,
  warn,
  info,
  debug,
  logger,
};
