import { NextFunction, Request, Response, Router } from 'express';
import ErrorHandler from '../models/ErrorHandler';
import { readFile } from "fs/promises";
import { appendFile, readFileSync, writeFile } from 'fs';
import statics from '../models/statics'

var cookieName = "ASP.NET_SessionId";
var getCounter = 0;

var lastInternalHeap = 0;
var lastHeap = 0;
var totalHeap = 4362335;
var totalInteralHeap = 228820;

class GetDataController {
  async defaultMethod(res: Response, req: Request): Promise<any> {
    getCounter++;
    console.log('---------  GopsApi/Post: ' + getCounter);


    //console.log(req);
    console.log('1');
    
    console.log(req.cookies);
    let sentCookie = req.cookies[cookieName];

    console.log('2');
    let internalDiff = req.body.internalHeap - lastInternalHeap;
    let heapDiff = req.body.heap - lastHeap;

    lastHeap = req.body.heap;
    lastInternalHeap = req.body.internalHeap;

    let percentFreeHeap = (lastHeap / totalHeap * 100).toFixed(2);
    let percentFreeInternalHeap = (lastInternalHeap / totalInteralHeap * 100).toFixed(2);

    let delimiter = ",";

    let stringData = sentCookie + delimiter +
      req.body.name + delimiter + req.body.heap + delimiter + heapDiff + delimiter + percentFreeHeap + delimiter + req.body.internalHeap + delimiter + internalDiff + delimiter + percentFreeInternalHeap + "\n";


    console.log(getCounter);
    console.log(req.body);
    if (getCounter == 0) {

      writeFile("espmem.csv", stringData, function (err) {
        if (err) {
          return console.log(err);
        }
        console.log("The file was created!");
      });
    }

    appendFile("espmem.csv", stringData, function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });

    console.log(sentCookie + " - " + statics.cookie);


    if (sentCookie != statics.cookie) {
      console.log("bad cookie");
      let data = readFileSync("assets\\testLoginError.json", { encoding: "utf-8" })
      console.log("read testLoginError.json");
      let testLoginError = JSON.parse(data);
      console.log(testLoginError);
      res.setHeader('Content-Type', 'application/json');
      return testLoginError;
    }
    console.log("cookie is ok");
    // if (counter % 5 == 0) {
    //   console.log("-->  send back empty text");
    //   res.setHeader('Content-Type', 'text/plain');
    //   res.send("");
    //   return;
    // }
    // if (counter % 8 == 0) {
    //   console.log("-->  send back null");
    //   res.setHeader('Content-Type', 'text/plain');
    //   res.send(null);
    //   return;
    // }
    // if (counter % 9 == 0) {
    //   console.log("-->  send back junck json json");
    //   res.setHeader('Content-Type', 'application/json');
    //   res.send({ "junck": "test" });
    //   return;
    // }

    let fileName = "assets\\testDataOnline.json";
    //let fileName = "testDataOffline.json";
    //let fileName = "testDataOnlineMassive.json";
    //let fileName = "testDataEmpty.json";
    //let fileName = "testDataOnlineBadData.json";

    // if (counter % 10 == 0) {
    //   //switch to an error result
    //   console.log("----------- using error result -------------");
    //   fileName = "testDataOffline.json";
    // }

    // if (counter % 23 == 0) {
    //   //Reset the cookie
    //   cookie = Math.random().toString();
    //   cookie = cookie.substring(2, cookie.length);
    //   cookie = "ASP.NET_SessionId=" + cookie;
    // }

    let data = readFileSync(fileName, { encoding: "utf-8" })


    let testData = JSON.parse(data);

    console.log(fileName);
    let x = req.body.name;

    //testData.language = "" + req.body.name;

    //testData.data.kpi.pac = Math.random() * (3865 - 0) + 0;
    //testData.data.kpi.power = 23 + testData.data.kpi.pac / 1000;

    const size = Buffer.byteLength(JSON.stringify(testData));
    console.log("json size: " + size);
    console.log("testData.data.kpi.pac: " + testData.data.kpi.pac);


    console.log("------------------------------");
    return testData;

  }
}

export = new GetDataController();