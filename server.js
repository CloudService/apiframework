/**
 * The entry of the server. It 
 * 	- Start the web server
*	- Initialize the server appliation
*	- Load the REST APIs.
 */
var express = require('express');
var path = require('path');
var fs = require('fs');

/**********************************************************************/
// Initialize the server appliation
/**********************************************************************/
var serverApp =  require('./lib/serverApplication.js');
serverApp.initialize();

/**********************************************************************/
// Configuration
/**********************************************************************/
var config = serverApp.config;

var build = config.get('build');
var buildConfigure = config.get(build);


/**********************************************************************/
// Configure express
/**********************************************************************/
//The middlewares are invokded in order.
var expressApp = express();
expressApp.use(express.static(__dirname + '/static'))
	.use(express.bodyParser()) // The body parser middleware parses the http body into JSON object. 	
	.use(expressApp.router);
	
/**********************************************************************/
// Load the REST APIs
/**********************************************************************/
require("./lib/apiLoader.js")({'expressApp': expressApp, 'serverApp': serverApp});

/**********************************************************************/
// Start the web server
/**********************************************************************/
var listeningPort = config.get('port');
var secure = config.get("secure");

// When use the command line parameter --secure=false, the type of secure is string. 
// And the string 'false' is converted to be boolean value true.
// To make it intuitionistic, we convert the 'false' to false. 
if(typeof secure === 'string'){
	if(secure === 'false')
		secure = false;
}

if(secure){

	var keyPath = path.join(__dirname, buildConfigure.key);
	var certPath = path.join(__dirname, buildConfigure.cert);
	var sslkey = fs.readFileSync(keyPath).toString();
	var sslcert = fs.readFileSync(certPath).toString();

	var options = {
	    key: sslkey,
	    cert: sslcert
	};

	var https = require('https');
	https.createServer(options, expressApp).listen(listeningPort);
}
else{
	var http = require('http');
	http.createServer(expressApp).listen(listeningPort);
}

serverApp.logger.info('Server ('+ (secure ? 'https' : 'http') +') ['+config.get('build')+'] is listening on port ' + listeningPort);
