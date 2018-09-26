// Licensed Materials - Property of IBM
//
// SAMPLE
//
// (c) Copyright IBM Corp. 2017 All Rights Reserved
//
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with IBM Corp

const express = require('express');
const fetch = require('node-fetch');
const request = require('request-promise');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

// Read in variables
var port = process.env.PORT || 3000;
var catalogServer = process.env.CATALOG_SERVER || 'http://winmvs2c.hursley.ibm.com:28220';

var server = app.listen(port, function () {
    console.log('This app is listening on port %d!', port);
    //console.log('This application is running in CICS ');
    console.log('Using z/OS Connect server: ' + zosconnect);
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
				      "itemCount": 774
				    }
		};
    let inquireRequest2 = inquireRequest;
    inquireRequest2.startItemRef = 100;

    let url = catalogServer + "/exampleApp/json_inquireCatalogWrapper";

    var promise1 = request({
      method: "POST",
      uri: url,
      body: inquireRequest,
      json: true
    })
        .then(function (res) {
            console.log("LOAD ITEMS: Calling API to fetch items: " + url1);
            return res.json();
        }).then(function (json) {
            console.log("Response 1 received - concat to JSON array.");
            allItemsArray = allItemsArray.concat(json.DFH0XCMNOperationResponse.ca_inquire_request.ca_cat_item);
            console.log('');
        });

    var promise2 = request({
      method: "POST",
      uri: url,
      body: inquireRequest2,
      json: true
    })
        .then(function (res) {
            console.log("LOAD ITEMS: Calling API to fetch items: " + url2);
            return res.json();
        }).then(function (json) {
            console.log("Response 2 received - concat to JSON array.");
            allItemsArray = allItemsArray.concat(json.DFH0XCMNOperationResponse.ca_inquire_request.ca_cat_item);
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

    var url = zosconnect + '/catalogManager/orders';

    var opts = {
        "DFH0XCMNOperation": {
            "ca_order_request": {
                "ca_item_ref_number": req.params.id,
                "ca_quantity_req": req.params.numberOfItems
            }
        }
    };

    console.log("BUY ITEMS: Calling API to buy items: " + url);
    console.log("Option parameters: " + JSON.stringify(opts));

    fetch(url, {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(opts)
    }).then(function (response) {
        console.log("Order item " + req.params.id + "successfully placed!");
        return response.json();
    }).then(function (data) {
        console.log("Returning response to client");
        console.log("");
        res.send(JSON.stringify(data));
    });

});
