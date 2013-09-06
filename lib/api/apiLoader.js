/**
* This is the loader for the api plugins.
* Discovery mechanism: The files under ./apiPlugins/ are loaded.
* Interface protocal: Refer the files under ./apiPlugins/
*/

var fs = require('fs');
var path = require('path');

/**********************************************************************/
// Define and implement the REST api.
/**********************************************************************/
/**
* Traverse all the route modules under the ./apiPlugins/. Load and add them to the router of the Express application
* @options {Object}
*	restManager {RESTAPIManager} rest API manager
*	serverApp {ServerApplicaion} server application object.
* @ api public
* @ return this for chaining
*/
var addRoute = function(options){
	if(!options || !options.restManager || !options.serverApp)
		return this;
	
    var serverApp = options.serverApp;
    var restManager = options.restManager;
	var expressApp = restManager.expressApp;	
    var logger = serverApp.logger;
	
	// Traverse all the route modules under the ./apiPlugins/. Load and add them to the router of the Express application.
	
	var routesPath = path.join(__dirname, 'apiPlugins');
	var routeModlues = fs.readdirSync(routesPath);
	
	routeModlues.forEach(function(element, index, array){
		var routeModulePath = path.join(routesPath, element);
		logger.debug('Adding route "' + routeModulePath +'"');
		try{
			var routeModule = require(routeModulePath);
					
			if(typeof routeModule === 'function'){
				routeModule(options);
			}
			else{
				logger.warn('Route Module "' + routeModulePath + '" does not export a function.');
			}
		}
		catch(err){
			logger.warn('Exception is caught when load route module "' + routeModulePath + '". ' + JSON.stringify(err));
		}
	});	
	
    if(restManager.enablecros){
        expressApp.options('/api/*', function(req, res, next){
            // When dealing with CORS (Cross-Origin Resource Sharing)
            // requests, the client should pass-through its origin (the
            // requesting domain). We should either echo that or use *
            // if the origin was not passed.
            var origin = (req.headers.origin || "*");            
    
            // Echo back the Origin (calling domain) so that the
            // client is granted access to make subsequent requests
            // to the API.
            res.writeHead(
                "204",
                "No Content",
                {
                   "access-control-allow-origin": origin,
                    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "access-control-allow-headers": "content-type, accept",
                    "access-control-max-age": 100, // Seconds.
                    "content-length": 0
                }
            );
     
            // End the response - we're not sending back any content.
            return( res.end() ); 
        });
    }
    
	// Response the error for all the not existing api requests
	expressApp.all('/api/*', function(req, res, next){
		restManager.responseNotFound(req, res); // When it goes here, that means the resource is not found.
	});
    
	return this;
}

/**********************************************************************/
// Exports
/**********************************************************************/

exports = module.exports = addRoute;