/**
 This is the tempalte of the route module. Copy this file when add new api route module.

@module template
*/

/*
 Define and implement the REST api.
*/

/**
* Add the routes to the Express application.
* @param {Object} options 
*	restManager {RESTAPIManager} rest API manager
*	serverApp {ServerApplicaion} server application object.
* @return this for chaining
* @class template 
*/
var addRoute = function(options){
	if(!options || !options.restManager || !options.serverApp)
		return this;
    
    var serverApp = options.serverApp;
    var restManager = options.restManager;
	var expressApp = restManager.expressApp;	
	var apiErrorManager = restManager.apiErrorManager;
    var logger = serverApp.logger;
    var config = serverApp.config;
		
	/**
	* This is a sample method to demonstrate how to add an API.
	* @method GET /api/1.0/users/:id
	* @param {Object} req
	* @param {Object} res
	* @param {Object} next
	*/
	expressApp.get('/api/1.0/users/:id', function(req, res, next){
		logger.debug("==> /api/1.0/users/:id");
		apiErrorManager.responseForbidden(res, {"origin": "*"});
	});
	
	return this;
};

/*
* Exports
*/

module.exports = addRoute;