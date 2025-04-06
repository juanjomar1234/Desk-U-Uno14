import { createLogger, format, transports } from 'winston';
import prisma from '@/lib/prisma';

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/app.log' })
  ]
});

// Función para guardar en DB
async function logToDB(level: string, message: string, metadata?: unknown) {
  try {
    await prisma.log.create({
      data: {
        level: level.toUpperCase(),
        message,
        metadata: metadata ? JSON.stringify(metadata) : null,
        source: 'production',
        timestamp: new Date()
      }
    });
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
    logger.error(message);
    logToDB('ERROR', message, metadata);
  },
  info: (message: string, metadata?: unknown) => {
    logger.info(message);
    logToDB('INFO', message, metadata);
  },
  warn: (message: string, metadata?: unknown) => {
    logger.warn(message);
    logToDB('WARN', message, metadata);
  }
};
