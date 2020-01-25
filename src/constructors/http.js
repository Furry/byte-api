const EventEmitter = require("events")
const fetch = require("node-fetch");

module.exports = class HttpHandler extends EventEmitter {
    constructor(authorization, options = {}) {
        super()
        this.baseurl = "https://api.byte.co/"
        this.authorization = authorization
    }

    baseRequest = (body, url, method) => {
        return new Promise((resolve, reject) => {
            fetch(this.baseurl+url, {
                method: method,
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json", "authorization": this.authorization }
            })
            .then(res => res.json())
            .then(json => {
                return resolve(this.responseHandler(json)) 
            })
        })
    }

    baseGetRequest = (url) => {
        return new Promise((resolve, reject) => {
            fetch(this.baseurl+url, {
                method: "GET",
                headers: { "Content-Type": "application/json", "authorization": this.authorization },
                "user-agent": "byte/0.3.52 (co.byte@trials; v55; Android 22/5.1.1) okhttp/4.3.1"
            })
            .then(res => res.json())
            .then(json => {
                let data = this.responseHandler(json, "posts");
                resolve(data); 
            })
        })
    }

    basePutRequest = (url) => {
        return new Promise((resolve, reject) => {
            fetch(this.baseurl+url, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "authorization": this.authorization },
                "user-agent": "byte/0.3.52 (co.byte@trials; v55; Android 22/5.1.1) okhttp/4.3.1"
            })
            .then(res => res.json())
            .then(json => {
                let data = this.responseHandler(json);
                resolve(data); 
            })
        })
    }

    basePostRequest = (url) => {
        return new Promise((resolve, reject) => {
            fetch(this.baseurl+url, {
                method: "POST",
                headers: { "Content-Type": "application/json", "authorization": this.authorization },
                "user-agent": "byte/0.3.52 (co.byte@trials; v55; Android 22/5.1.1) okhttp/4.3.1"
            })
            .then(res => res.json())
            .then(json => {
                console.log(json)
                let data = this.responseHandler(json);
                resolve(data); 
            })
        })
    }

    responseHandler = (response, method) => {
        
        let PostCon = require("./post")

        if (method == "posts") {
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

    getGlobalFeed = async () => {
        let res = await this.baseGetRequest("feed/global")
        .catch((err) => { throw err })
        return res
    }

}