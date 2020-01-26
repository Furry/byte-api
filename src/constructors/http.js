const EventEmitter = require("events")
const fetch = require("node-fetch")
const Errors = require("./error")

module.exports = class HttpHandler extends EventEmitter {
    constructor(authorization, options = {}) {
        super()
        this.baseurl = "https://api.byte.co/"
        this.authorization = authorization
    }

    baseRequest = (url, method, resulttype, body) => {
        return new Promise((resolve, reject) => {

            let options = []
            options["method"] = method
            options["headers"] = { "Content-Type": "application/json", "authorization": this.authorization }
            if (body) options["body"] = JSON.stringify(body)

            fetch(this.baseurl+url, options)
            .then(async (res) => {
                switch(res.status) {
                    case 404: reject(new Errors.APIError("The Endpoint requested doesn't exist.")); break

                    case 200:
                        res.json()
                        .then((json) => resolve(this.responseHandler(json, resulttype)))
                    break

                    default: 
                        console.log(res.status)
                        reject(new Errors.APIError("Something went wrong..")) // Fallback for now.
                    break
                }
            })

        })
    }

    responseHandler = (response, resulttype) => {
        
        let PostCon = require("./post")

        if (resulttype == "post") {
            let result = [];
            response.data.posts.forEach(post => {
                post.client = this
                result.push(new PostCon(post))
            })
            return result
        }
        return response
    }

    /**
     * Sets your profile color
     * @param {number} scheme The color you want your profile as. 1 to 17
     * @returns {Promise<object>} the HTTP response.
     * 
     * @example
     * setProfileColor(scheme)
     * .then((res) => console.log(res))
     */
    setProfileColor = (scheme) => {
        return this.baseRequest("account/me", "PUT", "profile", {"colorScheme": scheme})
    }

    /**
     * Sets your Bio
     * @param {string} message What you want your new BIO as.
     * @returns {promise<object>} the HTTP response.
     * 
     * @example
     * setBio("the one and only hackerman ;)")
     * .then((res) => console.log(res))
     */
    setBio = (message) => {
        return this.baseRequest("account/me", "PUT", "profile", {"bio": message})
    }

    /**
     * Subscribes to a user
     * @param {string} id User's ID to subscribe to.
     * @returns {promise<object>} the HTTP response.
     * 
     * @example
     * subscribe()
     * .then((res) => console.log(res))
     */
    subscribe = (id) => {
        return this.baseRequest(`account/id/${id}/follow`, "PUT", "user")
    }

    /**
     * Returns all posts in your global feed.
     * @returns {array<posts>}
     * 
     * @example
     * getGlobalFeed()
     * .then((res) => res.forEach((post) => post.like()))
     */
    getGlobalFeed = () => {
        return this.baseRequest("feed/global", "GET", "post")
    }

}