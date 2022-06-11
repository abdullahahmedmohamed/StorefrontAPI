import fs from 'fs';
import path from 'path';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logsDir = path.join(__dirname, '../../logs');

if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

const formats: Parameters<typeof format.combine> = [
  format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  format.errors({ stack: true }),
  format.splat(),
  format.json(),
];

const _logger = createLogger({
  level: 'info',
  format: format.combine(...formats),
  defaultMeta: { service: 'storefront' },
  transports: [
    new DailyRotateFile({
      filename: 'app-errors-%DATE%.log',
      level: 'error',
      dirname: logsDir,
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  _logger.clear().add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}

const logger = {
  info: _logger.info.bind(_logger),
  error: _logger.error.bind(_logger),
  warn: _logger.warn.bind(_logger),
  debug: _logger.debug.bind(_logger),
};

export default logger;
