/**
* The data model of the server application.
*/
var nconf = require('nconf');
var path = require('path');

/**
 * Constructor
 * It is the application of the server.
 */
var ServerApplication = function(){
	
	var _self = this;
	
	_self.initialize = function(){
		
		// Load config settings.
		var config = nconf.argv().env().file({file: path.join(__dirname, 'config.json')});
		var buildConfigure = config.get(config.get('build'));
		
		/**********************************************************************/
		// Apply the settings read from appfog
		/**********************************************************************/
		if(process.env.VMC_APP_PORT){
			config.set('port', process.env.VMC_APP_PORT); 
			config.set('secure', false);
		}

		// MongoDB
		// When you provision and bind a service to your app, AppFog creates an environment variable called VCAP_SERVICES. 
		if(process.env.VCAP_SERVICES){
			var env = JSON.parse(process.env.VCAP_SERVICES);
			var mongo = env['mongodb-1.8'][0]['credentials'];
			
			buildConfigure.mongodb = {
				"host":mongo.hostname,
				"port":mongo.port,
				"username":mongo.username,
				"password":mongo.password,
				"name":mongo.db // the db name
			};
		}
		/**********************************************************************/

		_self.config = config;		

		// Configure the logger
		var _logManager = require('./logManager.js')();
		_self.logger = _logManager.getLogger(buildConfigure.logger_mongodb);
		
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
	
	};
};


/**********************************************************************/
// Exports
/**********************************************************************/

module.exports = new ServerApplication();

