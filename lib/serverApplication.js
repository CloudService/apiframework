/**
* The data model of the server application.
*/
var nconf = require('nconf');
var log4js = require('log4js');
var path = require('path');

/**
 * Constructor
 * It is the application of the server.
 */
var ServerApplication = function(){
	
	var _self = this;
	
	// Load config settings.
	var config = nconf.argv().env().file({file: path.join(__dirname, 'config.json')});
	var serviceConf = config.get(config.get('build'));
	
	_self.config = config;	

	var buildConfigure = config.get(config.get('build'));

	// Configure the logger
	log4js.configure({
	    appenders: [
	        { type: "console" }
		],
		replaceConsole: true
	});

	_self.logger = log4js.getLogger();
	
	_self.apiErrorManager = require('./apiErrorManager.js')();
	
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
		
	});
};


/**********************************************************************/
// Exports
/**********************************************************************/

module.exports = new ServerApplication();

