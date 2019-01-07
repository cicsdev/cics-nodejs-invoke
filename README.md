# cics-nodejs-invoke
Sample Node.js application that uses the invoke API from the [ibm-cics-api](https://www.npmjs.com/package/ibm-cics-api) module to call COBOL programs included in the CICS catalog manager. The Node.js application includes the following elements:

* *A browser front end* web site that uses JavaScript to call REST APIs to retrieve and display items in the catalog and to place orders.
* *A Node.js back end* that uses the [Express](https://expressjs.com/) framework to implement REST APIs that return catalog details and place orders. Each REST API uses the invoke API to call COBOL programs from the CICS catalog manager.

## Setting up the CICS catalog manager

[The CICS catalog manager example application](https://www.ibm.com/support/knowledgecenter/en/SSGMCP_5.5.0/reference/samples/web-services/dfhxa_t100.html) is provided with the CICS installation and includes COBOL programs and VSAM files to store the catalog. It also includes a 3270 terminal interface that is not used by this Node.js application.

Configure the CICS catalog manager by following the procedures in topic [Installing and setting up the base application](https://www.ibm.com/support/knowledgecenter/en/SSGMCP_5.5.0/reference/samples/web-services/dfhxa_t230.html).

## Configuring CICS for JSON web services

1. Create a directory in zFS for the CICS web service bind (WSBind) files.
1. Copy the following example WSBind files from your CICS installation directory into this directory.
 * `<cics_install_dir>/samples/webservices/wsbind/provider/inquireCatalogWrapper.wsbind`
 * `<cics_install_dir>/samples/webservices/wsbind/provider/placeOrderWrapper.wsbind`
1. Modify the PIPELINE(EXPIPE01) resource attribute `WSDIR` to the directory containing the WSBind files.
1. Install the PIPELINE(EXPIPE01) resource and check it is enabled.
1. If you wish to test the Node.js application from your workstation, define and install a TCPIPSERVICE resource with `PROTOCOL(HTTP)` and appropriate values for `HOST(*)` and `PORT(3000)` on which REST API requests are received from the front end. Note the ibm-cics-api module does not support HTTP basic authentication.

## Testing the application on your workstation

1. Clone this repository:
```
git clone https://github.com/cicsdev/cics-nodejs-invoke.git
```
1. Download the Node.js modules that the application depends on:
```
cd cics-nodejs-invoke/bundle`
npm install
```
1. Set the host and port for connecting to CICS. This should match the host and port configured in the TCPIPSERVICE resource in CICS.
```
export CATALOG_SERVER=http://testplex.example.org:10000
```
1. Optionally set the local port the application will listen on. The default value is 3000.
```
export PORT=3000
```
1. Start the application.
```
npm start
```
1. Visit the URL from a web browser: http://localhost:3000/

## Deploying the Node.js application in CICS

1. Clone this repository to a directory on zFS.
```
git clone https://github.com/cicsdev/cics-nodejs-invoke.git
```
1. Download the Node.js modules that the application depends on:
```
cd cics-nodejs-invoke/bundle
npm install
```
1. Copy the contents of the `bundle` folder from this repository to a suitable location in zFS where the CICS region ID has read access.
1. Update `/bundle/catalog.profile`:
 * `PORT=3000` should be set to an available TCP/IP port on z/OS and be accessible from your workstation.
 * `WORK_DIR=.` should be set to a suitable zFS directory for the stdout and stderr logs created when CICS starts the Node.js application.
 * `NODE_HOME=/usr/lpp/IBM/cnj/IBM/node-v6.14.4-os390-s390x` to the installation directory of IBM SDK for Node.js - z/OS.
 * Note you do not need to set `CATALOG_SERVER=` when the Node.js application is run in CICS as the invoke API uses an optimised cross-memory mechanism to call COBOL programs.
1. Create and install a BUNDLE resource, setting the `BUNDLERDIR` attribute to the zFS directory.

## Testing the application in CICS

Visit the URL from a web browser, for example: http://myzoshost.example.org:3000/

## Troubleshooting

If the application does not respond to the HTTP request, check the BUNDLE resource is installed and enabled.

Next check the stderr and stdout files that will be created in a sub-directory of the `WORK_DIR` specified in `/bundle/catalog.profile`. The full paths of stderr and stdout can be seen in the *Node.js Applications* view in CICS Explorer and by the CICS command `CEMT INQUIRE NODEJSAPP`.

For more help see the topic [Troubleshooting Node.js applications](https://www.ibm.com/support/knowledgecenter/en/SSGMCP_5.5.0/troubleshooting/node/node-troubleshooting.html).
