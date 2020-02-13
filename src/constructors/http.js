const HttpsProxyAgent = require("https-proxy-agent")
const EventEmitter = require("events")
const fetch = require("node-fetch")
const Errors = require("./Error")
const resolveSource = require("../utils/resolveSource")

/**
 * @typedef HttpHandlerConfigOptions
 * @param proxy Proxy ip:port
 */

class HttpHandler extends EventEmitter {

    /**
     * Creates the HttpHandler class
     * @param {string} authorization Authorization Token 
     * @param {HttpHandlerConfigOptions} [config = {}]
     */
    constructor(authorization, config = {}) {
        super()
        this.baseurl = "https://api.byte.co/"
        this.authorization = authorization
        this.config = config
    }

    baseRequest(url, method, resulttype, body, settings={}) {
        return new Promise((resolve, reject) => {

            let finalurl;
            let options = {}

            if (settings.override) {
                options = body
                finalurl = url
                options["method"] = method
            } else {
                options["method"] = method
                options["headers"] = { "Content-Type": "application/json", "authorization": this.authorization }
                if (body) options["body"] = JSON.stringify(body)
                finalurl = this.baseurl+url
            }

            if (this.config.proxy) options["agent"] = new HttpsProxyAgent(`http://${this.config.proxy}`) 

            fetch(finalurl, options)
            .then(async (res) => {
                console.log(res)
                switch(res.status) {
                    case 404: reject(new Errors.APIError("The Endpoint requested doesn't exist.")); break
                    case 429: reject(new Errors.APIError("Too Many Requests. You're being rate limited.")); break
                    case 401: reject(new Errors.APIError("This account is unauthorized. Perhaps you've been banned?")); break

                    case 200:
                    
                        //res.json()
                        //.then((json) => resolve(this.responseHandler(json, resulttype)))
                        resolve(this.responseHandler(res, resulttype))

                    break

                    default: 
                        reject(new Errors.APIError(`Something went wrong.. Code: ${res.status}`)) // Fallback for now.
                    break
                }
            })

        })
    }

    async responseHandler(_response, resulttype) {
        
        let PostCon = require("./Post")
        let UserCon = require("./User")
        let CommentCon = require("./Comment")

        if (resulttype == "raw") {
            return _response
        }

        let response = await _response.json()

        if (!response.data || !Object.keys(response.data)[0]) return response
        let result = []

        if (resulttype == "json") {
            return response
        }

        if (resulttype == "post") {
            if (response.data.posts && response.data.posts[0]) {
                response.data.posts.forEach(post => {
                    post.client = this
                    result.push(new PostCon(post))
                })
                return result
            } else {
                response.data.client = this
                return new PostCon(response.data)
            }


        } 

        if (resulttype == "user") {
            if (response.data.accounts && response.data.accounts[0]) {
                response.data.accounts.forEach(user => {
                    user.client = this
                    result.push(new UserCon(user))
                })
                return result
            } else {
                response.client = this
                return new UserCon(response.data)
            }
        }

        if (resulttype == "postuser") {
            if (response.data.posts[0] && response.data.accounts) {
                response.data.posts.forEach((post) => {
                    post.client = this
                    response.data.accounts[post.authorID].client = this
                    result.push(new PostCon(post, response.data.accounts[post.authorID]))
                })
                return result
            }
        }

        if (resulttype == "comment") {
            if (response.data[0]) {
                response.data.accounts.forEach(comment => {
                    comment.client = this
                    result.push(new CommentCon(comment))
                })
                return result
            } else {
                response.client = this
                return new CommentCon(response.data)
            }
        }

        else return response

    }

    longPoll() {
        return new Promise((resolve, reject) => {
            this.baseRequest("activity", "GET", "json")
            .catch((err) => {throw err})
            .then((res) => {
                return resolve(res)
            })
        })
    }

}


module.exports = HttpHandler