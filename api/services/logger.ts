export type LogLevel = 'info' | 'warn' | 'error' | 'security';

export interface StructuredLog {
  timestamp: string;
  level: LogLevel;
  event: string;
  correlationId?: string;
  uid?: string;
  ip?: string;
  latencyMs?: number;
  metadata?: Record<string, any>;
  error?: string;
}

export const logger = {
  log(entry: Omit<StructuredLog, 'timestamp'>) {
    const record: StructuredLog = {
      timestamp: new Date().toISOString(),
      ...entry,
    };

    // Filter out potential sensitive parameters from metadata
    if (record.metadata) {
      const clean = { ...record.metadata };
      delete clean.password;
      delete clean.accessToken;
      delete clean.apiKey;
      delete clean.serviceAccount;
      delete clean.creditCard;
      record.metadata = clean;
    }

    const json = JSON.stringify(record);
    if (entry.level === 'error' || entry.level === 'security') {
      console.error(json);
    } else if (entry.level === 'warn') {
      console.warn(json);
    } else {
      console.log(json);
    }
  },

  info(event: string, meta?: Record<string, any>, correlationId?: string) {
    this.log({ level: 'info', event, metadata: meta, correlationId });
  },

  warn(event: string, meta?: Record<string, any>, correlationId?: string) {
    this.log({ level: 'warn', event, metadata: meta, correlationId });
  },

  error(event: string, error: any, correlationId?: string) {
    this.log({
      level: 'error',
      event,
      error: error?.message || String(error),
      metadata: error?.stack ? { stack: error.stack } : undefined,
      correlationId,
    });
  },

  security(event: string, meta?: Record<string, any>, correlationId?: string) {
    this.log({ level: 'security', event, metadata: meta, correlationId });
  },
};
