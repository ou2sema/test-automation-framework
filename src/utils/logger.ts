import winston from 'winston';
import path from 'path';
import fs from 'fs-extra';

// Ensure logs directory exists
fs.ensureDirSync('reports/logs');

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const loggerFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.printf(({ timestamp, level, message, component }) => {
    return `${timestamp} [${component || 'GLOBAL'}] ${level.toUpperCase()}: ${message}`;
  })
);

// Create a reusable logger class
export class Logger {
  private logger: winston.Logger;
  private component: string;

  constructor(component: string) {
    this.component = component;
    this.logger = winston.createLogger({
      levels: logLevels,
      level: process.env.LOG_LEVEL || 'info',
      format: loggerFormat,
      defaultMeta: { component },
      transports: [
        // Console output
        new winston.transports.Console(),
        // File output - one log file per day
        new winston.transports.File({
          filename: path.join('reports', 'logs', `test-${new Date().toISOString().split('T')[0]}.log`)
        }),
        // Errors only
        new winston.transports.File({
          filename: path.join('reports', 'logs', 'error.log'),
          level: 'error'
        })
      ]
    });
  }

  error(message: string): void {
    this.logger.error(message);
  }

  warn(message: string): void {
    this.logger.warn(message);
  }

  info(message: string): void {
    this.logger.info(message);
  }

  debug(message: string): void {
    this.logger.debug(message);
  }

  log(level: keyof typeof logLevels, message: string): void {
    this.logger.log(level, message);
  }
}

// Export default logger
export default new Logger('Global');