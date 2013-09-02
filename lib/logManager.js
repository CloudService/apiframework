/**
* Create and return a singleton logger object.
* Five levels are supported, which are debug, info, warn, error, fatal.
* Console: ouput the info and above levels.
* MongoDB: ouput all the levels.
*/

var winston = require('winston');
var MongoDB = require('winston-mongodb').MongoDB;

/**********************************************************************/
// Exports
/**********************************************************************/
var createInstance = function(){
	return new LogManager();
};

module.exports = createInstance;

var _logger = null;

var LogManager = function(){
	
};

LogManager.prototype = {	
	/** Return the logger object. If there is already an instance, return it directly. Otherwise, create a new one.
	*
	* @param {Object} options - The options for the transports
	* 	@param {string} options.console - The settings for the console transprot.
	* 	@param {string} options.mongodb - The settings for the mongodb transprot.
	* 		@param {string} options.mongodb.host
	* 		@param {number} options.mongodb..port
	* 		@param {string} options.mongodb..name - THe database name of the logger
	* @return logger object.
	*/
	getLogger : function(options){
		
		if (_logger)
			return _logger;
			
		var options = options || {};
		var _collection_name = 'apiservice';
		
		// Configure the logger.

		// Define the log levels
		var myCustomLevels = {
			levels: {
			  debug: 0,
			  info: 1,
			  warn: 2,
			  error: 3,
			  fatal: 4
			},
			colors: {
			  debug: 'green',
			  info: 'green',
			  warn: 'yellow',
			  error: 'red',
			  fatal: 'red'
			}
		  };

		// Create a logger instance. 
		//
		// Only info log a output to console. All log are output to mongodb.
		// *Transport*	*log level*
		//  Console			info
		//  MongoDB			debug
		_logger = new (winston.Logger)({
			levels: myCustomLevels.levels,
			colors: myCustomLevels.colors
		  });

		  
		// Suppress errors to avoid uncaughtexception.
		//
		_logger.emitErrs = false;

		// Listen the log success event.
		_logger.on('logging', function (transport, level, msg, meta) {
			// [msg] and [meta] have now been logged at [level] to [transport]
		  });
		
		var consoleoptions = options.console;
		if(consoleoptions && consoleoptions.level){
			// Add console transport. The levels greater or equal to this one will be output. 
			_logger.add(winston.transports.Console, {level:consoleoptions.level, colorize: true, timestamp: true})
		}
		
		var dboptions = options.mongodb;
		if(dboptions){
            // Add the MongoDB transport. Capped collection with size 10M
            _logger.add(MongoDB, {level:dboptions.level,
                db:dboptions.name, collection: _collection_name, safe: false, host: dboptions.host, port: dboptions.port});			
		}
			
		return _logger;
	}
};
