import { createLogger, format, transports } from 'winston';
import prisma from '@/lib/prisma';

// Crear un formato personalizado para la consola
const consoleFormat = format.printf(({ level, message, timestamp, ...metadata }) => {
  const metaStr = Object.keys(metadata).length ? JSON.stringify(metadata, null, 2) : '';
  return `${timestamp} [${level.toUpperCase()}] ${message} ${metaStr}`;
});

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.colorize(),
    format.json()
  ),
  transports: [
    // Consola con formato legible
    new transports.Console({
      format: format.combine(
        format.colorize(),
        consoleFormat
      )
    })
  ]
});

// Función para guardar en DB
async function logToDB(level: string, message: string, metadata?: unknown) {
  try {
    console.log(`Guardando log en DB: ${level} - ${message}`); // Debug
    const log = await prisma.log.create({
      data: {
        level: level.toUpperCase(),
        message,
        metadata: metadata ? JSON.stringify(metadata) : null,
        source: process.env.NODE_ENV || 'development', // Usar el entorno actual
        timestamp: new Date()
      }
    });
    console.log('Log guardado:', log); // Debug
  } catch (error) {
    console.error('Error saving to DB:', error);
  }
}

// Interceptar todos los logs y guardarlos en DB
logger.on('data', (info) => {
  logToDB(info.level, info.message, info.metadata);
});

export default {
  error: (message: string, metadata?: unknown) => {
    console.log(`[ERROR] ${message}`, metadata); // Log inmediato
    logger.error(message, metadata);
    logToDB('ERROR', message, metadata);
  },
  info: (message: string, metadata?: unknown) => {
    console.log(`[INFO] ${message}`, metadata); // Log inmediato
    logger.info(message, metadata);
    logToDB('INFO', message, metadata);
  },
  warn: (message: string, metadata?: unknown) => {
    console.log(`[WARN] ${message}`, metadata); // Log inmediato
    logger.warn(message, metadata);
    logToDB('WARN', message, metadata);
  }
};
