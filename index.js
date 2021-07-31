const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const querystring = require('querystring')
const PORT = process.env.PORT || 5000;
const echarts = require("echarts");
const jsdom = require("jsdom");
const JSONPath = require("jsonpath-plus");
var testData = require("./testData.json");
var testLoginError = require("./testLoginError.json");
var cookie = "to be set";
var cookieName = "ASP.NET_SessionId";

var lastInternalHeap = 0;
var lastHeap = 0;
var totalHeap = 4362335;
var totalInteralHeap = 228820;
const fs = require("fs");

var counter = 0;
var loginCounter = 0;

express()
  .use(cookieParser())
  .use(express.static(path.join(__dirname, "public")))
  .use(bodyParser.json())
  .use(bodyParser.text())
  .use(bodyParser.urlencoded())
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .post("/GopsApi/Post", (req, res) => {

    counter++;
    console.log('---------  GopsApi/Post: ' + counter);


    let sentCookie = req.cookies[cookieName];

    let internalDiff = req.body.internalHeap - lastInternalHeap;
    let heapDiff = req.body.heap - lastHeap;

    lastHeap = req.body.heap;
    lastInternalHeap = req.body.internalHeap;

    let percentFreeHeap = (lastHeap / totalHeap * 100).toFixed(2);
    let percentFreeInternalHeap = (lastInternalHeap / totalInteralHeap * 100).toFixed(2);

    let delimiter = ",";

    let stringData = sentCookie + delimiter +
      req.body.name + delimiter + req.body.heap + delimiter + heapDiff + delimiter + percentFreeHeap + delimiter + req.body.internalHeap + delimiter + internalDiff + delimiter + percentFreeInternalHeap + "\n";


    console.log(counter);
    console.log(req.body);
    if (counter == 0) {

      fs.writeFile("espmem.csv", stringData, function (err) {
        if (err) {
          return console.log(err);
        }
        console.log("The file was created!");
      });
    }

    fs.appendFile("espmem.csv", stringData, function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });

    console.log(sentCookie + " - " + cookie);

    if (sentCookie != cookie) {
      console.log("bad cookie");
      fs.readFile("testLoginError.json", 'utf8', function (err, data) {

        if (err) throw err;
        console.log("read testLoginError.json");
        testLoginError = JSON.parse(data);
        console.log(testLoginError);
        res.setHeader('Content-Type', 'application/json');
        res.send(testLoginError);
        return;
      });
      return;
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

    let fileName = "testDataOnline.json";
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

    fs.readFile(fileName, 'utf8', function (err, data) {
      if (err) throw err;
      testData = JSON.parse(data);

      console.log(fileName);
      let x = req.body.name;
      
      //testData.language = "" + req.body.name;

      //testData.data.kpi.pac = Math.random() * (3865 - 0) + 0;
      //testData.data.kpi.power = 23 + testData.data.kpi.pac / 1000;

      const size = Buffer.byteLength(JSON.stringify(testData));
      console.log("json size: " + size);
      console.log("testData.data.kpi.pac: " + testData.data.kpi.pac);

      res.send(testData);
      console.log("------------------------------");
      return
    });
  })
  .post("/Home/Login", (req, res) => {

    loginCounter++;
    console.log('---------  Login: ' + loginCounter);
    var fs = require('fs'), filename = "testLoginData.json"
    //var fs = require('fs'), filename = "testDataOnlineMassive.json"

    fs.readFile(filename, 'utf8', function (err, data) {
      if (err) throw err;
      console.log('OK: ' + filename);
      console.log(data)

      cookie = Math.random().toString();
      cookie = cookie.substring(2, cookie.length);
     
      //res.cookie(cookieName, cookie, { maxAge: 900000, httpOnly: true });
      console.log('cookie created successfully');

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Set-Cookie', "ASP.NET_SessionId=" + cookie);
      console.log("cookie:" + cookie);

      res.send(data);
    });

  })
  .post("/", (req, res) => {
    let seriesData = [
      {
        name: "Type 1",
        smooth: true,
        type: "bar",
        data: [120, 132, 101, 134, 90, 230, 210],
      },
    ];

    seriesData = req.body.seriesData;
    let legendData = req.body.legendData;
    let title = req.body.title;
    let xAxisData = req.body.xAxisData;
    let backgroundColor = req.body.backgroundColor;
    let width = req.body.width;
    let height = req.body.height;
    let option = req.body.option;
    console.log(req.body);

    const dom = new jsdom.JSDOM(`<div id="content"></div>`, {
      url: "https://example.org/",
      referrer: "https://example.com/",
      contentType: "text/html",
      includeNodeLocations: true,
      storageQuota: 10000000,
    });

    global.document = dom.window.document;

    let myDiv = dom.window.document.createElement("div");
    myDiv.style.width = width;
    myDiv.style.height = height;
    var myChart = echarts.init(myDiv);

    if (!option)
      option = {
        title: {
          text: title,
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: legendData,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            // saveAsImage: {}
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: true,
          data: xAxisData,
        },
        yAxis: {
          type: "value",
        },
        series: seriesData,
      };

    option && myChart.setOption(option);

    let output = myChart.getDataURL({
      pixelRatio: 2,
      backgroundColor: backgroundColor,
    });

    res.send('<img src="' + output + '">');
  })
  .post("/merge", (req, res) => {
    console.log(req.body);

    let text = req.body.text;
    let json = req.body;
    text = merge(text, json);
    res.send(text);
  })
  .post("/escapeJson", bodyParser.text(), (req, res) => {
    let string = req.body;

    console.log(string);

    string = string
      .replace(/\n/g, "\\n")
      .replace(/\'/g, "\\'")
      .replace(/\"/g, '\\"')
      .replace(/\&/g, "\\&")
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t")
      .replace(/\f/g, "\\f");
    console.log("after");
    console.log(string);

    res.send(string);
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

function encode(text) { }

function getTopLevelQueries(text) {
  //let string = 'this is --$client.[first name]-- and --$manager.fullname-- and finally --$cients.age-- --$items{{--$.name-- --$.value--}}--';
  //string = 'this is --$client.[first name]-- and --$manager.fullname-- and finally --$cients.age-- --$items{{--$.name-- --$.value--}}-- --$more{{--$.name-- --$.value{{--$.sub file name--}}--}}--  --'

  string = text;

  console.log(string);

  let array = [];
  let maxValue = 1000000000;

  let p = 0;
  let tagCounter = 0;
  let sTagCounter = 0;
  let memory = null;
  let index = 0;
  let run = true;
  while (run == true) {
    p++;

    let oTag = string.indexOf("--$", index); //12
    let cTag = string.indexOf("--", index); //12
    let oSTag = string.indexOf("{{", index); // 10
    let cSTag = string.indexOf("}}", index); // 26

    if (oTag == -1) oTag = maxValue;
    if (cTag == -1) cTag = maxValue;
    if (oSTag == -1) oSTag = maxValue;
    if (cSTag == -1) cSTag = maxValue;

    console.log(string.substr(index));
    console.log("index:" + index);
    console.log("oTag:" + oTag);
    console.log("cTag:" + cTag);
    console.log("oSTag:" + oSTag);
    console.log("cSTag:" + cSTag);
    console.log("tagCounter:" + tagCounter);
    console.log("sTagCounter:" + sTagCounter);
    console.log("memory:" + memory);

    if (
      oTag == maxValue &&
      cTag == maxValue &&
      oSTag == maxValue &&
      cSTag == maxValue
    )
      run = false;

    if (oTag <= cTag && oTag < oSTag && oTag < cSTag) {
      index = oTag + 2;
      tagCounter++;
      console.log("oTag:" + tagCounter);
      //  string = string.substr(oTag+2); //move to first position
    }

    if (cTag < oTag && cTag < oSTag && cTag < cSTag) {
      tagCounter--;
      console.log("cTag:" + tagCounter);

      if (tagCounter == 0) {
        if (sTagCounter == 0) {
          if (memory) {
            console.log("using memory");
            console.log(
              "using memory : " + string.substr(memory, cTag - memory)
            );
            array.push(string.substr(memory, cTag - memory));
          } else {
            array.push(string.substr(index, cTag - index));
          }

          memory = null;
        }
      }
      index = cTag + 1;
    }

    if (oSTag < cTag && oSTag < oTag && oSTag < cSTag) {
      if (sTagCounter == 0) {
        memory = index;
      }
      sTagCounter++;
      console.log("oSTag:" + sTagCounter);

      //	array.push(string.substr(0, cTag));
      index = oSTag + 1;
    }

    if (cSTag < cTag && cSTag < oTag && cSTag < oSTag) {
      sTagCounter--;
      console.log("oSTag:" + sTagCounter);

      //	array.push(string.substr(0, cTag));
      index = cSTag + 1;
    }
    console.log(array);
    console.log(string);
  }

  return array;
}

function merge(text, json) {
  let queries = getTopLevelQueries(text);

  queries.forEach((query) => {
    let result = "";

    //regex = /\{{(.*?)\}}/g
    //let foundSub = query.match(regex);

    let subStart = query.indexOf("{{");

    // let subQueries = [];
    if (subStart != -1) {
      //subQueries = getTopLevelQueries(query.substr(subStart + 2));

      //we have sub items
      let parent = query.substr(0, subStart);

      let parentItems = JSONPath.JSONPath({
        path: parent,
        json: json,
      });

      console.log("parentItem");
      let textToReplace = query.substr(
        subStart + 2,
        query.length - subStart - 4
      );
      result = "";
      parentItems.forEach((parentItem) => {
        result = result + merge(textToReplace, parentItem);
      });
    } else {
      let jsonPath = query;

      try {
        result = JSONPath.JSONPath({
          path: jsonPath,
          json: json,
        });
      } catch (err) {
        result = err;
      }

      //const replacer = new RegExp("/" + match, 'g')
    }
    text = text.split("--" + query + "--").join(result);
  });

  return text;
}
// .get('/', (req, res) => res.render('pages/index'))
