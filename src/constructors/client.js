const HttpHandler = require("./http");

module.exports = class Client extends HttpHandler {
    constructor(token, config = {}) {
        super(token, config);
        
    }

    

}