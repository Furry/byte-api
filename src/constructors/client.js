const HttpHandler = require("./Http");

/**
 * The main Client Class.
 * @class
 * @extends HttpHandler
 */
module.exports = class Client extends HttpHandler {
    /**
     * The main Client Constructor.
     * @param {string} token Your API token.
     * @param {HttpHandlerConfigOptions} config HttpHandler Configuration paramaters. 
     */
    constructor(token, config = {}) {
        super(token, config);
        
    }

    

}