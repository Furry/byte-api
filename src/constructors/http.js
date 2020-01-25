const EventEmitter = require("events")
const fetch = require("node-fetch");

module.exports = class HttpHandler extends EventEmitter {
    constructor(authorization, options = {}) {
        super()
        this.baseurl = "https://api.byte.co/"
        this.Authorization = authorization
    }

    baseRequest = (body, url, method) => {
        fetch(this.baseurl+url, {
            method: method,
            body: JSON.parse(body),
            headers: { "Content-Type": "application/json", "Authorization": authorization }
        })
        .then(res => res.json())
        .then(json => {
            return this.responseHandler(json) 
        })
    }

    responseHandler = (response) => {
        console.log(response)
        return response
    }

    /**
     * @param {number} scheme The color you want your profile as. 1 to 17
     * @returns {Promise<object>} the HTTP response.
     * 
     * @example
     * setProfileColor(scheme)
     * .then((res) => console.log(res))
     */
    setProfileColor = (scheme) => {
        return this.baseRequest({"colorScheme": scheme}, "account/me", "PUT")
    }

    /**
     * @param {string} message What you want your new BIO as.
     * @returns {promise<object>} the HTTP response.
     * 
     * @example
     * setBio("the one and only hackerman ;)")
     * .then((res) => console.log(res))
     */
    setBio = (message) => {
        return this.baseRequest({"bio": message}, "account/me", "PUT")
    }

}