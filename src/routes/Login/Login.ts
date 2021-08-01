import { SSL_OP_PKCS1_CHECK_1 } from 'constants';
import { NextFunction, Request, Response, Router } from 'express';
import LoginController from '../../controllers/Login';

class RouteLogin {
  private _router = Router();
  private _controller = LoginController;

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
    this._router.get('/',async (req: Request, res: Response, next: NextFunction) => {
      console.log("1 inside R_Login");
      try{
        console.log("2 inside try R_Login");
        const result = await this._controller.defaultMethod(res);
        console.log("3 inside try of r_login:", result);
        res.status(200).json(result);
        console.log("4 inside try of r_login:", result);
      }
      catch (error)
      {
        console.log("error in router");
        next(error);
      }
      console.log("4 outside try of r_login:");
      
      
    });
  }
}

export = new RouteLogin().router;