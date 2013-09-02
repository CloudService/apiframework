
var nconf = require('nconf');
var path = require('path');

/**********************************************************************/
// Exports
/**********************************************************************/
var createInstance = function(){
	return new ConfigurationManager();
};

module.exports = createInstance;

/**********************************************************************/
// Implementation
/**********************************************************************/
/**
 * @constructor
 */
var ConfigurationManager = function(){

};

ConfigurationManager.prototype = {
    load: function(){    
        // Load config settings.
		var config = nconf.argv().env().file({file: path.join(__dirname, 'config.json')});
		var buildConfigure = config.get(config.get('build'));
		
		/**********************************************************************/
		// Apply the settings read from appfog. (Delete this section if the service is not run on Appfog)
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
        
        return config;
    }
};
