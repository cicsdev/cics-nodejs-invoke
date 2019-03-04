// Licensed Materials - Property of IBM
//
// SAMPLE
//
// (c) Copyright IBM Corp. 2019 All Rights Reserved
//
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with IBM Corp

const express = require('express');
const cics = require('ibm-cics-api');

var bodyParser = require('body-parser');
var os = require('os');
var util = require('util');
var dns = require('dns');
var app = express();

app.use(bodyParser.json());

// Read in variables
var port = process.env.PORT || 3000;
var catalogServer = process.env.CATALOG_SERVER || 'http://example.org:9999';

var server = app.listen(port, function () {
  console.log(`This application is running on platform: ${process.platform}`);

  if (process.env.hasOwnProperty("CICS_USSHOME")) {
    console.log('API requests from this application will use the CICS locally-optimized transport');
  } else {
    console.log('API requests from this application will call CICS system using URI: ' + catalogServer);
  }

  dns.lookup(os.hostname(), { hints: dns.ADDRCONFIG }, function (err, ip) {
    if (err || ip == undefined || ip == null) {
      ip = "localhost"
    }

    console.log("This application is listening for requests at URI: http://" + ip + ":" + port + "/");
  });
});

process.on('SIGTERM', function () {
  server.close(function () {
    console.log('Received SIGTERM at ' + (new Date()));
  });
});

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// if using npm versions of frameworks, redirect
app.use('/angular', express.static(__dirname + '/node_modules/angular'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));

//jQuery calls this URL, this function calls two REST APIs, merges the responses and send it to the client
app.get('/catalogManager/items', function (req, res) {
  //Create empty array
  var allItemsArray = [];

  let inquireRequest = {
    "inquireCatalogRequest": {
      "startItemRef": 10,
    }
  };

  let inquireRequest2 = {
    "inquireCatalogRequest": {
      "startItemRef": 160,
    }
  };

  let url = catalogServer + "/exampleApp/inquireCatalogWrapper";

  var promise1 = cics.invoke(url, inquireRequest)
    .then(function (json) {
      console.log("Response 1 received - concat to JSON array.");
      console.dir(json.inquireCatalogResponse.catalogItem);
      allItemsArray = allItemsArray.concat(json.inquireCatalogResponse.catalogItem);
      console.log('');
    });

  var promise2 = cics.invoke(url, inquireRequest2)
    .then(function (json) {
      console.log("Response 2 received - concat to JSON array.");
      console.dir(json.inquireCatalogResponse.catalogItem);
      allItemsArray = allItemsArray.concat(json.inquireCatalogResponse.catalogItem);
      console.log('');
    });

  //When both responses come back, send the array of items to client
  Promise.all([promise1, promise2])
    .then(values => {
      res.send(JSON.stringify(allItemsArray));
    })
    .catch(function (err) {
      console.log("Error during cics invoke: " + err);
    });
});

// Buying POST function
app.post('/catalogManager/buy/:id/:numberOfItems', function (req, res) {
  var url = catalogServer + '/exampleApp/placeOrderWrapper';

  var opts = {
    "placeOrderRequest": {
      "orderRequest": {
        "itemReference": req.params.id,
        "quantityRequired": req.params.numberOfItems
      }
    }
  };

  console.log("BUY ITEMS: Calling API to buy items: " + url);
  console.log("Option parameters: " + JSON.stringify(opts));

  cics.invoke(url, opts)
    .then(function (response) {
      console.log("Order item " + req.params.id + "successfully placed!");
      return response;
    }, function (err) {
      console.err(err);
    })
    .then(function (data) {
      console.log("Returning response to client");
      console.log("");
      res.send(JSON.stringify(data));
    });
});

//Get information about the Node.js environment
app.get('/about/environment', function (req, res) {
  // Write a simple response to the client
  res.write(
    "<html>"
    + "<h1>Node.js runtime environment</h1>"
    + "<p>"
    + "Date: " + new Date() + "<br>"
    + "<pre>"
    + "process.execPath: " + process.execPath + "<br>"
    + "process.argv[0]: " + process.argv[0] + "<br>"
    + "process.version: " + process.version + "<br>"
    + "process.cwd(): " + process.cwd() + "<br>"
    + "process.umask(): " + process.umask().toString(8) + "<br>"
    + "process.getuid(): " + process.getuid() + "<br>"
    + "process.geteuid(): " + process.geteuid() + "<br>"
    + "process.getgid(): " + process.getgid() + "<br>"
    + "process.getegid(): " + process.getegid() + "<br>"
    + "process.getgroups(): " + process.getgroups() + "<br>"
    + "<br>"
    + "os.hostname(): " + os.hostname() + "<br>"
    + "os.platform(): " + os.platform() + "<br>"
    + "os.release(): " + os.release() + "<br>"
    + "os.type(): " + os.type() + "<br>"
    + "os.arch(): " + os.arch() + "<br>"
    + "os.homedir(): " + os.homedir() + "<br>"
    + "os.tmpdir(): " + os.tmpdir() + "<br>"
    + "os.totalmem(): " + os.totalmem() + "<br>"
    + "os.freemem(): " + os.freemem() + "<br>"
    + "os.uptime(): " + os.uptime() + "<br>"
    + "</pre>"
    + "<h2>os.userInfo()</h2><pre>" + (util.inspect(os.userInfo())) + "</pre>"
    + "<h2>process.env</h2><pre>" + (util.inspect(process.env)) + "</pre>"
    + "<h2>process.memoryUsage()</h2><pre>" + (util.inspect(process.memoryUsage())) + "</pre>"
    + "<h2>os.cpus()</h2><pre>" + (util.inspect(os.cpus())) + "</pre>"
    + "<h2>os.networkInterfaces()</h2><pre>" + (util.inspect(os.networkInterfaces())) + "</pre>"
    + "<h2>process</h2><pre>" + (util.inspect(process)) + "</pre>"
    + "</html>"
  );

  res.end();
});
