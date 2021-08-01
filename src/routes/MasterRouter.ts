import { Router } from 'express';
import Login from './Login/Login';
import rGetData from './GetData/GetData';

declare global {
  namespace NodeJS {
    interface Global {
      cookie: string;
    }
  }
}


class MasterRouter {
  private _router = Router();
  private _Login = Login;
  private _getData = rGetData;

  get router() {
    return this._router;
  }

  constructor() {
    this._configure();
  }

  /**
   * Connect routes to their matching routers.
   */
  private _configure() {
    this._router.use('/Login', this._Login);
    this._router.use('/GetData', this._getData);
  }
}

export = new MasterRouter().router;