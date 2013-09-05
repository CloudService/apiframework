/**
* The data model of the server application.
*/
var configurationManager = require('./configurationManager.js')();
var MongoStream = require("mongostream");
/**
 * Constructor
 * It is the application of the server.
 */
var ServerApplication = function(){
    this.config = null;
    this.logger = null;
    this.mongostream = null;
};

ServerApplication.prototype = {
	initialize : function(){
		
        var _self = this;

		// Load config settings.
		var config = configurationManager.load();
		var buildConfigure = config.get(config.get('build'));
		
		_self.config = config;	        

		// Configure the logger
		var _logManager = require('./logManager.js')();
		_self.logger = _logManager.getLogger(buildConfigure.logger);
		
		// database
		var mongostream = MongoStream();
        this.mongostream = mongostream;
        mongostream.addSupportedCollections(["user"]);
        mongostream.open(buildConfigure.mongodb, function(err){
			if(err){
				_self.logger.warn(err.message + JSON.stringify(buildConfigure.mongodb));
				return;
			}
            
            _self.logger.info("DB: Connection is established. " + JSON.stringify(buildConfigure.mongodb));
		});
	}
};


/**********************************************************************/
// Exports
/**********************************************************************/

module.exports = new ServerApplication();

