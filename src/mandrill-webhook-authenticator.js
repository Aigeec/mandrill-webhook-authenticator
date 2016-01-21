(function() {
  'use strict';

  var crypto = require('crypto');

  /**
  * Simple express middleware module to authenticate Inbound Mandrill Webhook requests
  * @module MandrillWebhookAuthenticator
  */

  /**
  * @const { string } MANDRILL_SIGNATURE_HEADER - Mandrill Signature HTTP header
  */
  var MANDRILL_SIGNATURE_HEADER = 'x-mandrill-signature';

  /**
  * @const { string } NOT_AUTHORIZED
  */
  var NOT_AUTHORIZED = 'Not Authorized';

  /**
  * @const { string } FORBIDDEN
  */
  var FORBIDDEN = 'Forbidden';

  /**
  * @const { Error } CONFIGURATION_ERROR
  */
  var CONFIGURATION_ERROR = new Error('Configuration is incomplete, please check documentation');

  /**
  * Creates the middleware function to be used to authenticate the inbound Mandrill webhook
  *
  * @alias Authenticator
  * @constructor
  * @param { object } options - Set of configuration values
  * @param { string } options.webhookAuthKey - Key of the Inbound Webhook provied by Mandrill
  * @param { string } options.domain - Domain of the Inbound Webhook url as set up on Mandrill
  * @returns { function } @see {@link Authenticator~authenticate}
  */
  var Authenticator = function(options) {

    // Guard to ensure that Authenticator is always called with new
    if (!(this instanceof Authenticator)) {
      return new Authenticator(options);
    }

    // Default options
    options = options || {};

    // Validate provided options
    if (!options.webhookAuthKey || !options.domain) {
      throw CONFIGURATION_ERROR;
    }

    /**
    * Generate the signature from the full url and sorted post data to compart to the one provided
    * @param { string } fullUrl - domain and url of request - should match exactly the url specified in the webhook
    * @param { string } body - request body
    * @param { string } key - Mandrill Inbound Webhook auth key
    * @param { string } signature - signature provided in the 'x-mandrill-signature' header
    * @returns { boolean } True is signature is valid otherwise false
    */
    var isValidMandrillSignature = function(fullUrl, body, key, signature) {
      var data = fullUrl + sortPostParameters(body);
      var expected = getHash(data, key);
      return expected === signature;
    };

    /**
    * Sort the post parameters alphabetically and append each POST variable's key and value with no delimiter.
    * @param { string } body - Post body
    * @returns { string } string of sorted key values with no delimiter
    */
    var sortPostParameters = function(body) {
      body = Object(body);
      var sortedKeys = Object.keys(body).sort();
      return sortedKeys.reduce(function(signature, key) {
         return signature + key + body[key];
       }, '');
    };

    /**
    * Hash the resulting string with HMAC-SHA1, using your webhook's authentication key to generate a binary signature and Base64 encode.
    * @param { string } text - Full URL and sorted post data
    * @param { string } key - Mandrill Inbound Webhook auth key
    */
    var getHash = function(text, key) {
      var hmac = crypto.createHmac('sha1', key);
      hmac.setEncoding('base64');
      hmac.write(text);
      hmac.end();
      return hmac.read();
    };

    /**
    * Utility function to set http reponse status and message, uses HTTP compatible properties so express is not required
    * @param { Response } res - Response
    * @param { int } status - HTTP status code
    * @param { string } message - Response body
    */
    var respondWith = function(res, status, message) {
      res.writeHead(status);
      res.end(message);
    };

    /**
    * Express middleware compatible function to process requests and only continure if the signature is valid. It does not update the request.
    * @param { Request } req
    * @param { Response } res
    * @param { function } next
    */
    var authenticate = function(req, res, next) {
      if (!req.headers[MANDRILL_SIGNATURE_HEADER]) {
        respondWith(res, 401, NOT_AUTHORIZED);
      }else if (!isValidMandrillSignature(options.domain + req.url, req.body, options.webhookAuthKey, req.headers[MANDRILL_SIGNATURE_HEADER])) {
        respondWith(res, 403, FORBIDDEN);
      } else {
        next();
      }
    };

    return authenticate;
  };

  module.exports = Authenticator;

})();
