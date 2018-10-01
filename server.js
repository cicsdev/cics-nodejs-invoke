// Licensed Materials - Property of IBM
//
// SAMPLE
//
// (c) Copyright IBM Corp. 2017 All Rights Reserved
//
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with IBM Corp

const express = require('express');
const cics = require('ibm-cics-api');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

// Read in variables
var port = process.env.PORT || 3000;
var catalogServer = process.env.CATALOG_SERVER || 'http://winmvs2c.hursley.ibm.com:28220';

var server = app.listen(port, function () {
    console.log('This app is listening on port %d!', port);
    //console.log('This application is running in CICS ');
    console.log('Connecting to CICS system: ' + catalogServer);
    console.log('');
});

process.on('SIGTERM', function () {
	  server.close(function () {
		console.log('Received SIGINT at ' + (new Date()));
	  });
	});

console.log(`This application is running on platform: ${process.platform}`);
console.log(' ');

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
    let url = catalogServer + "/exampleApp/json_inquireCatalogWrapper";

    var promise1 = cics.invoke(url,inquireRequest)
        .then(function (json) {
            console.log("Response 1 received - concat to JSON array.");
            console.dir(json.inquireCatalogResponse.catalogItem);
            allItemsArray = allItemsArray.concat(json.inquireCatalogResponse.catalogItem);
            console.log('');
        });

    var promise2 = cics.invoke(url,inquireRequest2)
        .then(function (json) {
            console.log("Response 2 received - concat to JSON array.");
            console.dir(json.inquireCatalogResponse.catalogItem);
            allItemsArray = allItemsArray.concat(json.inquireCatalogResponse.catalogItem);
            console.log('');
        });

    //When both responses come back, send the array of items to client
    Promise.all([promise1, promise2]).then(values => {
        res.send(JSON.stringify(allItemsArray));

    }).catch(function (err) {
        console.log("Promise error: " + err);
        console.log("Promise Rejected");
    });
});



// Buying POST function
app.post('/catalogManager/buy/:id/:numberOfItems', function (req, res) {

    var url = catalogServer + '/exampleApp/json_placeOrderWrapper';

    var opts = {
        "placeOrderRequest" : {
          "orderRequest" : {
            "itemReference" : req.params.id,
            "quantityRequired" : req.params.numberOfItems
          }
        }
    };

    console.log("BUY ITEMS: Calling API to buy items: " + url);
    console.log("Option parameters: " + JSON.stringify(opts));

    cics.invoke(url,opts)
    .then(function (response) {
        console.log("Order item " + req.params.id + "successfully placed!");
        return response;
    },function (err) {
      console.err(err);
    }
  ).then(function (data) {
        console.log("Returning response to client");
        console.log("");
        res.send(JSON.stringify(data));
    });
    //TODO Need a rejection handler here
});
