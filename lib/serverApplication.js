/**
* The data model of the server application.
*/
var configurationManager = require('./configurationManager.js')();

/**
 * Constructor
 * It is the application of the server.
 */
var ServerApplication = function(){
    this.config = null;
    this.logger = null;
    this.db_connection = null;
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
		_self.db_connection = null;
		var dbDriver = new require('./mongodb/dbdriver.js')();
		dbDriver.open(buildConfigure.mongodb, function(err, db_connection){
			if(err){
				_self.logger.warn(err.message + JSON.stringify(buildConfigure.mongodb));
				return;
			}
			_self.logger.info("DB: Connection is established. " + JSON.stringify(buildConfigure.mongodb));
			_self.db_connection = db_connection;	
			
			db_connection.on('close', function(){
				_self.logger.info("DB: Connection is closed.");
			});
			
			// The code below is used to test the database.
			/*
			db_connection.collection('__user').insert({"type":"user"}, function(err){
				if(err){
					_self.logger.info("DB: Error " + err.message);
				}
				else{
					_self.logger.info("DB: Success");
				}
			});
			*/
			
		});	
	}
};


/**********************************************************************/
// Exports
/**********************************************************************/

module.exports = new ServerApplication();

