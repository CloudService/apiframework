/**
* The REST API layer.
*/

/**
 * Constructor
 */

var RESTAPIManager = function(){
    this.serverApp = null;
    this.expressApp = null;
    this.apiErrorManager = null;
    this.enablecros = false;
};

RESTAPIManager.prototype = {
    /**
     * @options {Object}
     *	expressApp {Object} Express application
     *	serverApp {Object} server application object.
     * @ api public
     * @ chainable
     */
	initialize : function(options){
		if(!options || !options.expressApp || !options.serverApp)
            return this;
        
        this.serverApp = options.serverApp;
        this.expressApp = options.expressApp;
        
        var config = this.serverApp.config;
        var buildConfigure = config.get(config.get('build'));
        this.enablecros = buildConfigure.enablecros;
		
		this.apiErrorManager = require('./api/apiErrorManager.js')();
        
        
        /**********************************************************************/
        // Load the REST APIs
        /**********************************************************************/
        require("./api/apiLoader.js")({'restManager': this, 'serverApp': this.serverApp});         

        return this;
	},
    
    /** Send back the response. Add the cors header.
     * @param {Object} res
     * @param {Object} req
     * @param {Object} bodyObject The JSON object.
     * @ public
     * @ chainable
     */
    sendOKResponse: function(req, res, bodyObject){
    
        var bodyString = JSON.stringify(bodyObject);
        
        var headers = {};
        headers["Content-Type"] = "application/json; charset=utf-8";
        headers["Content-Length"] = bodyString.length;
        
        if(this.enablecros){
            headers["access-control-allow-origin"] = req.headers.origin;        
        }
        
        res.writeHead(
            200,
            headers
        );

        res.write(bodyString, 'utf8');
        res.end();
    
        return this;
    }
};


/**********************************************************************/
// Exports
/**********************************************************************/

module.exports = new RESTAPIManager();

