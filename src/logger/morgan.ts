import morgan from 'morgan';
import logger from '.';

const morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms', {
  stream: {
    // Configure Morgan to use our custom logger with the http severity
    write: (message) => {
      logger.info(message.trim());
    },
  },
});

const f = ':method :url :status :res[content-length] - :response-time ms';
export const successHandler = morgan(f, {
  skip: (req, res) => res.statusCode >= 400,
  stream: { write: (message) => logger.info(message.trim()) },
});

export const errorHandler = morgan(f, {
  skip: (req, res) => res.statusCode < 400,
  stream: { write: (message) => logger.warn(message.trim()) },
});
export default morganMiddleware;
