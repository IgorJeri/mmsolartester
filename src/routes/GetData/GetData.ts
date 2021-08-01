import { SSL_OP_PKCS1_CHECK_1 } from 'constants';
import { NextFunction, Request, Response, Router } from 'express';
import cGetData from '../../controllers/GetData';

class R2 {
  private _router = Router();
  private _controller = cGetData;

  get router() {
    return this._router;
  }

  constructor() {
    this._configure();
  }

  /**
   * Connect routes to their matching controller endpoints.
   */
  private _configure() {
    this._router.get('/', async (req: Request, res: Response, next: NextFunction) => {
      console.log("inside getdata router");
     // console.log(req);
      console.log("inside getdata defaultMethod");
      let resData = await this._controller.defaultMethod(res,req);
      res.status(200).json(resData);
    });
  }
}

export = new R2().router;