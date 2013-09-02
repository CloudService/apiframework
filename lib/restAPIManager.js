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
		
		this.apiErrorManager = require('./apiErrorManager.js')();
        
        
        /**********************************************************************/
        // Load the REST APIs
        /**********************************************************************/
        require("./apiLoader.js")({'restManager': this, 'serverApp': this.serverApp});         

        return this;
	}
};


/**********************************************************************/
// Exports
/**********************************************************************/

module.exports = new RESTAPIManager();

