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
*   @param {RESTAPIManager} options.restManager rest API manager
*	@param {ServerApplicaion} options.serverApp server application object.
* @chainable
*/
var addRoute = function(options){
	if(!options || !options.restManager || !options.serverApp)
		return this;
    
    var serverApp = options.serverApp;
    var restManager = options.restManager;
	var expressApp = restManager.expressApp;	
    var logger = serverApp.logger;
    var config = serverApp.config;
		
	/**
	* This is a sample method to demonstrate how to add an API.
	* @method GET /api/1.0/users/:id
	*/
	expressApp.get('/api/1.0/users/:id', function(req, res, next){
		logger.debug("==> GET /api/1.0/users/:id");
		restManager.responseForbidden(req, res);
	});
    
    /**
	* This is a sample method to demonstrate how to add an API.
	* @method PUT /api/1.0/version
	*/
	expressApp.put('/api/1.0/author', function(req, res, next){
		logger.debug("==> PUT /api/1.0/author");
        
        // Implement your logic
        
		restManager.responseOK(req, res, {"author": req.body.author || "jeffrey"});
	});
    
   /**
	* This is a sample method to demonstrate how to add an API.
	* @method PUT /api/1.0/author
	*/
	expressApp.get('/api/1.0/author', function(req, res, next){
		logger.debug("==> GET /api/1.0/author");
        
        // Implement your logic
        
		restManager.responseOK(req, res, {"author": "jeffrey"});
	});
	
	return this;
};

/*
* Exports
*/

module.exports = addRoute;