/**
 Apply the settings to the mongodb. 
 Open and close mongodb.

@module template
*/

var mongodb = require('mongodb');

var dbdriver = function(){

	// Same the database connection object.
	//var db_connection = null;
	
	/**
	 * Open the a database connection. 
	 * The database open operation is expensive. It is recommended to share the connection in the whole application. 
	 * And don't close it until you never use it.
	 *
	 * @param {object} options
	 * 	@param {string} options.host - The db host ip or name.
	 * 	@param {string} options.port - The listening port of db.
	 * 	@param {string} options.name - The database name.
	 * @param {function} callback - Its signature is callback(err, db);
	 */
	this.open = function(options, callback){
		callback = callback || function(){};
		
		if(!options){
			process.nextTick(function(){callback(new Error("The options are quired to open the database."));});
			return;
		}
		
		//  auto_reconnect - to reconnect automatically, default:false 
		// This flag controls if the driver reconnects the database when the connection between the applicaion 
		// and database is disconnected.
		// 	- false, if the connection is disconnected. The callback of the database function will be invoked very quickly. 
		// The error object is set in the callback parameters. 
		//	- true, if the connection is disconnected. The callback of the database function won't be invoked 
		// until connection is reconnected or timeout. 
		//		The timeout is almost euqal to 'numberOfRetries X retryMiliSeconds'.
		// The database may die or reboot for some reason.  
		// If this happens, the connection between the appication and database will be disconnected. 
		// We want the application can reconnect the database automatically in a transparent manner.  So set auto_reconnect as true.
		var dbserver = new mongodb.Server(options['host'], options['port'], {auto_reconnect: true});
	
		//  retryMiliSeconds - specify the number of milliseconds between connection attempts default:5000
		// numberOfRetries - specify the number of retries for connection attempts default:3 
		// safe - The allowed values are [true | false | {j:true} | {w:n, wtimeout:n} | {fsync:true}]. 
		//	false - means the driver receives does not  return the information of the success/error of the insert/update/remove 
		// 	Set the safe option as true.
		//  raw - driver expects Buffer raw bson document, default:false 
		var db_instance = new mongodb.Db(options['name'], dbserver, 
			{
				safe:true,
				numberOfRetries: 3,
				retryMiliSeconds: 7000
			});
			
		db_instance.open(function(err, db_connenction){
			if(err){
				callback(err);
				return;
			}
			var username = options.username;
			var password = options.password;
			if(username && password){
				db_connenction.authenticate(username, password, function(err, result){
					// The type of result is bool. true means success. 
					callback(err, db_connenction);
				});
			}
			else{
				callback(err, db_connenction);
			}
		});	
	};

	this.close = function(db_connection){
		if(db_connection){
			db_connection.close();
		}	
	};
};

/*
* Exports
*/

var createInstance = function(){
	return new dbdriver();
};

module.exports = createInstance;
