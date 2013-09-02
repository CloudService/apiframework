
var apiErrorObjectCreator = require('./apiObjects/ApiErrorObject.js');

/**
* All the API error messages are defined in this module. The error messagea are sent to client via this class.
* The http error status code is as below.
* http status code	message
* 400	Bad Request
* 401	Unauthorized
* 403	Forbidden
* 404	Not Found
* 500	Internal Error
* 501	Not Implemented
*/

/**********************************************************************/
// Exports
/**********************************************************************/
var createInstance = function(){
	return new ApiErrorManager();
};

module.exports = createInstance;
 
/**********************************************************************/
// Implementation
/**********************************************************************/
/**
 * @constructor
 */
var ApiErrorManager = function(){

};
/*
* Populate the error object and send it to client.
*
* @res {ServerResponse} reponse
* @type {string}  error type
* @status {number}  http status code
* @message {string}  error message
* @help_url {string}  help url regarding this error.
* @ private
*/
var _responseError = function(res, type, status, message, help_url, headers){
    if(res){
        var error = apiErrorObjectCreator(type, status, message, help_url);	           
        var errorString = JSON.stringify(error);
        
        headers = headers || {};
        headers["Content-Type"] = "application/json; charset=utf-8";
        headers["Content-Length"] = errorString.length;
        
        res.writeHead(
            status,
            headers
        );

        res.write(errorString, 'utf8');
        res.end();
    }
    return this;
};
	
ApiErrorManager.prototype = {
	/**
	* this {ApiErrorManager}
	* @res {ServerResponse} reponse
	* @ api public
	* @chainable
	*/
	responseBadRequest : function(res, headers){
		_responseError(res, 'error', 400, 'Bad Request'
				, '/dev/docs/api.html', headers);
		
		return this;
	},
	
	/**
	* this {ApiErrorManager}
	* @res {ServerResponse} reponse
	* @ api public
	* @chainable
	*/
	responseUnauthorized : function(res, headers){
		_responseError(res, 'error', 401, 'Unauthorized'
				, '/dev/docs/api.html', headers);
		
		return this;
	},
	
	/**
	* this {ApiErrorManager}
	* @res {ServerResponse} reponse
	* @ api public
	* @chainable
	*/
	responseForbidden : function(res, headers){
		_responseError(res, 'error', 403, 'Forbidden'
				, '/dev/docs/api.html', headers);
		
		return this;
	},
	
	/**
	* this {ApiErrorManager}
	* @res {ServerResponse} reponse
	* @ api public
	* @chainable
	*/
	responseNotFound : function(res, headers){
		_responseError(res, 'error', 404, 'Not Found'
				, '/dev/docs/api.html', headers);
		
		return this;
	},
	
	/**
	* this {ApiErrorManager}
	* @res {ServerResponse} reponse
	* @ api public
	* @chainable
	*/
	responseInternalError : function(res, headers){
		_responseError(res, 'error', 500, 'Internal Error'
				, '/dev/docs/api.html', headers);
		
		return this;
	},
	
	/**
	* this {ApiErrorManager}
	* @res {ServerResponse} reponse
	* @ api public
	* @chainable
	*/
	responseNotImplemented : function(res, headers){
		_responseError(res, 'error', 501, 'Not Implemented'
				, '/dev/docs/api.html', headers);
		
		return this;
	}
};

