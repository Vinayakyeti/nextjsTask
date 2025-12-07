import { type NextRequest, NextResponse } from 'next/server';

export interface Logger {
  info(message: string, metadata?: Record<string, any>): void;
  error(message: string, error?: Error, metadata?: Record<string, any>): void;
  warn(message: string, metadata?: Record<string, any>): void;
  debug(message: string, metadata?: Record<string, any>): void;
}

class ConsoleLogger implements Logger {
  private getTimestamp() {
    return new Date().toISOString();
  }

  private formatLog(level: string, message: string, metadata?: Record<string, any>) {
    return {
      timestamp: this.getTimestamp(),
      level,
      message,
      ...(metadata && { metadata }),
    };
  }

  info(message: string, metadata?: Record<string, any>) {
    console.log(JSON.stringify(this.formatLog('INFO', message, metadata)));
  }

  error(message: string, error?: Error, metadata?: Record<string, any>) {
    console.error(JSON.stringify(this.formatLog('ERROR', message, {
      ...metadata,
      ...(error && {
        errorMessage: error.message,
        errorStack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      }),
    })));
  }

  warn(message: string, metadata?: Record<string, any>) {
    console.warn(JSON.stringify(this.formatLog('WARN', message, metadata)));
  }

  debug(message: string, metadata?: Record<string, any>) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(JSON.stringify(this.formatLog('DEBUG', message, metadata)));
    }
  }
}

export const logger = new ConsoleLogger();

export function createAuditLog(
  userId: string,
  action: string,
  entity: string,
  entityId: string,
  changes?: Record<string, any>
) {
  logger.info(`Audit: ${action}`, {
    userId,
    action,
    entity,
    entityId,
    ...(changes && { changes }),
  });
}

export function logApiRequest(
  method: string,
  path: string,
  statusCode: number,
  duration: number
) {
  logger.info(`API ${method} ${path}`, {
    method,
    path,
    statusCode,
    durationMs: duration,
  });
}

export function logError(
  message: string,
  error: Error,
  context: Record<string, any> = {}
) {
  logger.error(message, error, context);
}
