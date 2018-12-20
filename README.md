# cics-nodejs-zosconnect
CICS Catalog Manager sample Node.js application.  Uses the locally-optimized API to invoke the catalog manager CICS application.

## Introduction

This sample application provides the following elements:

* A JavaScript frontend application that displays items in the catalog and allows the user to place orders
* A Node.js application that exposes a simple REST API for the frontend applicatoin to call, enabling access to the backend.  Multiple requets to the backend are made for each GET request from the frontend.
* WSBind files to expose the catalog manager base application as JSON services to be invoked by the Node.js application.

## Setting up the catalog manager

Set up the CICS catalog manager sample application according to the instructions in the Knowledge Center. (add link)

## Configuring CICS for JSON web esrvices

You'll need a TCPIPSERVICE and a PIPELINE configured for JSON web services.  If you don't have these set up already, set them up according the instructions in the Knowledge Center.  (add link)

## Deploying the CICS web services

1. Clone this repository into a temporary directory on zFS.
2. Copy the WSBind files into the pickup directory of your PIPELINE.
3. Either:
   (a) perform a PIPELINE SCAN
or (b) define WEBSERVICE and URIMAP resources for the services.
    see the Knowledge Center (link) for more info.

## Deploying the Node.js application

1. Copy the contents of the 'bundle' folder to a suitable location zFS where CICS can read it.
2. Customize the profile:
 --* Set the PORT environment variable to an avaiable TCP/IP port for your system
 --* Set WORK_DIR to a suitable zFS directory for the logs.
 --* If needed, set NODE_HOME to the location of the IBM SDK for z/OS - Node.js on your system.
3. Create and install a CICS BUNDLE resource, setting the BUNDLER_DIR to the zFS directory.     

## Testing the application

Visit the URL from a web broswer
http://<my-mvs-host>:<port>

e.g.
http://testplex.example.org:20000

## Troubleshooting

If the application does not respond to the HTTP request, check the stderr and stdout files. These are created in a sub-directory of the WORK_DIR specified in the profile. They can be accessed directly from Node.js Applicaitons view in CICS Explorer, and their paths are return by CEMT INQUIRE NODEJSAPP.

For more help see the Knowledge Center troubleshooting page.
