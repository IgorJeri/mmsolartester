import { NextFunction, Request, Response, Router } from 'express';
import ErrorHandler from '../models/ErrorHandler';
import { readFile } from "fs/promises";
import { readFileSync } from 'fs';
import statics from '../models/statics'

var loginCounter = 0;


class LoginController {
  async defaultMethod(res: Response) : Promise<any> {

    loginCounter++;
    console.log('---------  Login: ' + loginCounter);
    var fs = require('fs'), filename = "assets\\testLoginData.json"
    //var fs = require('fs'), filename = "testDataOnlineMassive.json"

    

    const data = readFileSync(filename,{ encoding:"utf-8" });
    
      console.log('---------  Login - inside readfile: ' + loginCounter);
     

      console.log('--- OK: ' + filename);
      console.log(data)

      let jdata = JSON.parse(data);

   
      statics.cookie = Math.random().toString();
      statics.cookie = statics.cookie.substring(2, statics.cookie.length);

      //res.cookie(cookieName, cookie, { maxAge: 900000, httpOnly: true });
      console.log('cookie created successfully');

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Set-Cookie', "ASP.NET_SessionId=" + statics.cookie);
      console.log("cookie:" + statics.cookie);


      return jdata;
    
  }
}

export = new LoginController();