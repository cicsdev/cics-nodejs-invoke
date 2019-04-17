# cics-nodejs-invoke
Sample Node.js application that uses the invoke API from the [ibm-cics-api](https://www.npmjs.com/package/ibm-cics-api) module to call COBOL programs included in the CICS catalog manager. The Node.js application includes the following elements:
* [`/projects/cics-nodejs-invoke/public`](/projects/cics-nodejs-invoke/public) - *A browser front end* web site that uses JavaScript to call REST APIs to retrieve and display items in the catalog and to place orders.
* [`/projects/cics-nodejs-invoke/server.js`](/projects/cics-nodejs-invoke/server.js) - *A Node.js back end* that uses the [Express](https://expressjs.com/) framework to implement REST APIs that return catalog details and place orders. Each REST API uses the invoke API to call COBOL programs from the CICS catalog manager - see `cics.invoke(url,inquireRequest).then( ... )`.
* [`/projects/cics-nodejs-invoke/catalog.profile`](/projects/cics-nodejs-invoke/catalog.profile) - The CICS Node.js application profile is used by CICS to setup the Node.js runtime and environment  variables passed to the application.
* [`/projects/cics-nodejs-invoke`](/projects/cics-nodejs-invoke) - The CICS bundle that contains the Node.js application and the profile and is used to install and manage the application in CICS.

## Pre-requisites
* CICS TS V5.5 or later.
* IBM SDK for Node.js - z/OS 6.14.4 or later.
* Node.js 6 or later on the workstation.
* Git on z/OS and the workstation, or alternatively download manually.

## Install the CICS catalog manager
This Node.js application requires [the CICS catalog manager example application](https://www.ibm.com/support/knowledgecenter/en/SSGMCP_5.5.0/reference/samples/web-services/dfhxa_t100.html) to be installed. It is provided with the CICS installation and includes COBOL programs and VSAM files to store the catalog. It also includes a 3270 terminal interface that is not used by this Node.js application.

The Node.js application uses the invoke API to call the JSON web service endpoints `/exampleApp/inquireCatalogWrapper` and `/exampleApp/placeOrderWrapper`. You therefore also need URIMAP, PIPELINE, and WSBIND resources to process these requests. 

1. Configure the CICS catalog manager by following the procedures in topic [Installing and setting up the base application](https://www.ibm.com/support/knowledgecenter/en/SSGMCP_5.5.0/reference/samples/web-services/dfhxa_t230.html).
1. Create a directory in zFS for the CICS [web service binding](https://www.ibm.com/support/knowledgecenter/en/SSGMCP_5.5.0/fundamentals/web-services/dfhws_wsbind.html) (WSBind) files.
1. Copy the following CICS catalog manager WSBind files from your CICS installation directory into this directory. Ensure the CICS region ID has read access to these files.
   * `<cics_install_dir>/samples/webservices/wsbind/provider/inquireCatalogWrapper.wsbind`
   * `<cics_install_dir>/samples/webservices/wsbind/provider/placeOrderWrapper.wsbind`
1. Modify the PIPELINE(EXPIPE01) resource to set attributes:
   * WSDIR to the directory containing the WSBind files
   * CONFIGFILE to `<cics_install_dir>/samples/pipelines/jsonnonjavaprovider.xml`
1. Install the PIPELINE(EXPIPE01) resource and check it is enabled. CICS will scan the directory specified by WSDIR and for each .wsbind file it will automatically install a URIMAP and WSBIND resource.
1. If your CICS region does not have program autoinstall enabled, define and install PROGRAM resources for DFH0XICW and DFH0XPOW as detailed in [Defining the web service client and wrapper programs](https://www.ibm.com/support/knowledgecenter/en/SSGMCP_5.5.0/reference/samples/web-services/dfhxa_t121.html).
1. If you are going to test the Node.js application from your workstation, define and install a TCPIPSERVICE resource with `PROTOCOL(HTTP)` and appropriate values for `HOST(*)` and `PORT(3001)` on which REST API requests are received from the Node.js application. Note the ibm-cics-api module does not support HTTP basic authentication.

## Testing the application on your workstation
1. Clone this repository:
   ```
   git clone https://github.com/cicsdev/cics-nodejs-invoke.git
   ```
1. Download the Node.js modules that the application depends on:
   ```
   cd cics-nodejs-invoke/projects/cics-nodejs-invoke
   npm install
   ```
1. Set the host and port for connecting to CICS. This should match the host and port configured in the TCPIPSERVICE resource in CICS.
   ```
   export CATALOG_SERVER=http://testplex.example.org:3001
   ```
1. Optionally set the local port the application will listen on. The default value is 3000.
   ```
   export PORT=3000
   ```
1. Start the application.
   ```
   npm start
   ```
1. Visit the URI from a web browser: http://localhost:3000/

## Deploying the Node.js application in CICS
1. Clone this repository to your workstation:
   ```
   git clone https://github.com/cicsdev/cics-nodejs-invoke.git
   ```
1. Start CICS Explorer V5.5 or above.
1. Select menu option **File → Import...** to start the import wizard, then select **General → Existing Projects into Workspace → Next**, and in option **Select root directory** select the directory `cics-nodejs-invoke/projects`. In the **Projects** section select cics-nodejs-invoke, then **Finish** to copy the project into the Eclipse workspace.
1. If the directory `node_modules` exists in the CICS bundle, remove it.
1. Update `catalog.profile`:
   * `PORT=3000` should be set to an available TCP/IP port on z/OS and be accessible from your workstation.
   * Note you do not need to set `CATALOG_SERVER=` when the Node.js application is run in CICS as the invoke API uses an optimised cross-memory mechanism to call COBOL programs.
1. Export the CICS bundle to a z/OS directory.
1. Download the Node.js modules that the application depends on:
   ```
   cd <bundle_dir>
   npm install
   ```
1. Create the zFS file `<USSCONFIG>/nodejsprofiles/general.profile` where `<USSCONFIG>` should be replaced by the value specified by the CICS SIT parameter USSCONFIG.
   * `WORK_DIR=.` should be set to a suitable zFS directory for the stdout and stderr logs created when CICS starts the Node.js application.
   * `NODE_HOME=/usr/lpp/IBM/cnj/IBM/node-v6.14.4-os390-s390x` to the installation directory of IBM SDK for Node.js - z/OS.

1. Create and install a BUNDLE resource, setting the `BUNDLERDIR` attribute to the zFS directory.
1. Look at the standard out (.stdout) file created in a subdirectory of WORK_DIR for a message such as:

   `This application is listening for requests at URI: http://myzoshost.example.org:3000`
1. Visit the URI contained in the above message from a web browser: http://myzoshost.example.org:3000

## Testing the application in CICS
Use a browser to call the application: http://myzoshost.example.org:3000/

| [![CICS Online Store](/images/store.png "CICS Online Store")](/images/store.png) | [![Order item](/images/order.png "Order item")](/images/order.png) |
| ------------ | --- |
| [![About this demo](/images/about.png "About this demo")](/images/about.png) | [![Node.js runtime environment](/images/environment.png "Node.js runtime environment")](/images/environment.png) |

## Troubleshooting
If the application does not respond to the HTTP request, check the BUNDLE resource is installed and enabled.

Next check the stderr and stdout files that will be created in a sub-directory of the `WORK_DIR` specified in [`/projects/cics-nodejs-invoke/catalog.profile`](/projects/cics-nodejs-invoke/catalog.profile). The full paths of stderr and stdout can be seen in the *Node.js Applications* view in CICS Explorer or by the CICS command [CEMT INQUIRE NODEJSAPP](https://www.ibm.com/support/knowledgecenter/en/SSGMCP_5.5.0/reference/transactions/cemt-inquirenodejsapp.html).

For more help see the topic [Troubleshooting Node.js applications](https://www.ibm.com/support/knowledgecenter/en/SSGMCP_5.5.0/troubleshooting/node/node-troubleshooting.html).

## License
This project is licensed under [Apache License Version 2.0](LICENSE).
