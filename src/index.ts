import express, { Express, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import MasterRouter from './routes/MasterRouter'
import ErrorHandler from './models/ErrorHandler';
import cookieParser from "cookie-parser"

// load the environment variables from the .env file
dotenv.config({
    path: '.env'
  });
  
/**
 * Express server application class.
 * @description Will later contain the routing system.
 */
 class Server {
    public app = express();
    public router = MasterRouter;
  }

// initialize server app
const server = new Server();


server.app.use(helmet());
server.app.use(bodyParser.json());
server.app.use(cookieParser())
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use('/', server.router);

server.app.use((err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    res.status(err.statusCode || 500).json({
      status: 'error',
      statusCode: err.statusCode,
      message: err.message
    });
  });
  
// make server listen on some port
((port = process.env.APP_PORT || 5000) => {
    server.app.listen(port, () => console.log(`> Listening on port ${port}`));
  })();

