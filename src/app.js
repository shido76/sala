import express from 'express';
import 'express-async-errors';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import audit from 'express-requests-logger';
import * as Sentry from '@sentry/node';
import sentryConfig from './config/sentry.js';
import routes from './config/routes.js';
import ErrorsController from './controllers/errors.js';
import CustomError from './lib/customError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class App {
  constructor() {
    this.server = express();
    if (process.env.NODE_ENV === 'production') Sentry.init(sentryConfig);
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    if (process.env.NODE_ENV === 'production') this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
    this.server.use(audit({
      doubleAudit: (process.env.NODE_ENV === 'development' ? true : false),  
      excludeURLs: ['health', 'metrics'],
      request: {
        maskBody: ['password'], 
        excludeHeaders: ['authorization'],
        excludeBody: ['creditCard'],
        maskHeaders: ['header1'],
        maxBodyLength: 50
      },
      response: {
        maskBody: ['session_token'],
        excludeHeaders: ['authorization'],
        excludeBody: ['creditCard'],
        maskHeaders: ['header1'],
        maxBodyLength: 50,
        levels: {
          "2xx": "info",
          "401": "warn", 
          "4xx": "info",
          "503": "warn",
          "5xx": "error",
        },
      },
    }));
  }

  routes() {
    this.server.use(routes);
    this.server.all('*', (req, res, next) => {
      const err = new CustomError(`Can't find ${req.originalUrl} on the server!`, 404);
      next(err);
    });
    if (process.env.NODE_ENV === 'production') this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(ErrorsController.execute);
  }
}

export default new App().server;