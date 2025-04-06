import { createLogger, format, transports } from 'winston';
import prisma from '@/lib/prisma';

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
      )
    })
  ]
});

// Función simple para guardar en DB
async function saveLog(level: string, message: string, metadata?: unknown) {
  try {
    await prisma.log.create({
      data: {
        level: level.toUpperCase(),
        message,
        metadata: metadata ? JSON.stringify(metadata) : null,
        timestamp: new Date(),
        source: 'system'
      }
    });
  } catch (error) {
    console.error('Error saving log:', error);
  }
}

// Exportar funciones que guardan tanto en Winston como en DB
export default {
  error: (message: string, metadata?: unknown) => {
    logger.error(message);
    saveLog('ERROR', message, metadata);
  },
  info: (message: string, metadata?: unknown) => {
    logger.info(message);
    saveLog('INFO', message, metadata);
  },
  warn: (message: string, metadata?: unknown) => {
    logger.warn(message);
    saveLog('WARN', message, metadata);
  }
};
