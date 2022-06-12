import express from 'express';
import cors from 'cors';
import { errorHandler, successHandler } from './logger/morgan';
import logger from './logger';
import registerRoutes from './routes';
import ApiError from './errors/ApiError';

const app = express();
app.use(cors());
app.use(express.json());

// use morgan in development or production Only
if (process.env.NODE_ENV != 'test') {
  // app.use(morganMiddleware);
  app.use(successHandler);
  app.use(errorHandler);
}

app.get('/', (_, res) => {
  res.send('App Running');
  return;
});

registerRoutes(app);

// last app.use calls right before app.listen():
// custom 404
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

// custom error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ message: err.message, details: err.details });
    return;
  }

  logger.error(err);
  res.status(500).send('UnExpected Error Occurred, Please Try Again Later or Call Us');
});
export default app;
