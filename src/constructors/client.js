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

        /**
     * Sets your profile color
     * @param {number} scheme The color you want your profile as. 1 to 17
     * @returns {Promise<object>} the HTTP response.
     * 
     * @example
     * setProfileColor(scheme)
     * .then((res) => console.log(res))
     */
    setProfileColor(scheme) {
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
    setBio(message) {
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
    subscribe(id) {
        console.log("<client>.subscribe() is DEPRECIATED. Please use <user>.subscribe, or <post>.author.subscribe()")
        return this.baseRequest(`account/id/${id}/follow`, "PUT", "user")
    }

    /**
     * Returns all posts in your global feed. Aka all-time HOT posts.
     * @returns {array<posts>}
     * 
     * @example
     * getGlobalFeed()
     * .then((res) => res.forEach((post) => post.like()))
     */
    getGlobalFeed() {
        return this.baseRequest("feed/global", "GET", "postuser")
    }
    
    /**
     * Popular V2. Aka Trending Now
     * @returns {array<posts>}
     * 
     * @example
     * getPopularv2()
     * .then((res) => res.forEach((post) => post.like()))
     */
    getPopularv2() {
        return this.baseRequest("feed/popular/v2", "GET", "postuser")
    }

    /**
     * Popular V3, Recomended for you.
     * @returns {array<posts>}
     * 
     * @example
     * getPopularv3()
     * .then((res) => res.forEach((post) => post.like()))
     */
    getPopularv3() {
        return this.baseRequest("feed/popular/v3", "GET", "postuser")
    }

    /**
     * Latest Posts.
     * @returns {array<posts>}
     * 
     * @example
     * getMix()
     * .then((res) => res.forEach((post) => post.like()))
     */
    getMix() {
        return this.baseRequest("feed/mix", "GET", "postuser")
    }

    /**
     * Latest Posts. (Alias for getMix)
     * @returns {array<posts>}
     * 
     * @example
     * getMix()
     * .then((res) => res.forEach((post) => post.like()))
     */
    getLatest() {
        return this.getMix()
    }
    
    /**
     * !! NOT STABLE !!
     * @private
     * Popular posts from a category.
     * @returns {array<posts>}
     * @param {string} category The category to fetch.
     * 
     * @example
     * getByCategory()
     * .then((res) => res.forEach((post) => post.like()))
     */
    __getByCategory(category) {
        return this.baseRequest(`feed/categories/${category}/popular`)
    }

    /**
     * Searches by name, and returns an array of User objects.
     * @param {string} name The name you want to search.
     * @returns {promise<array>}
     * 
     * @example
     * searchByName("cat")
     * .then((res) => {
     * res.forEach((item) => console.log(item.id))
     * })
     */
    searchByName(name) {
        return this.baseRequest(`account/prefix/${name}`, "GET", "user")
    }

    /**
     * To post a new video to the Client.
     * @param {videoUrlResolvable} uri The resolvable URL of the video
     * @param {string} [category="chill"] The category to post to
     * @param {string} [caption=""] The caption
     * @returns {post} The post you just created.
     * @example
     * .createPost("https://www.mp4url.com/mp4")
     * .then((res) => console.log(res.videoSrc))
     * 
     * @example
     * .createPost("./file.mp4")
     * .then((res) => console.log(res.videoSrc))
     */
    createPost(uri, caption="", category) {
        return new Promise(async (resolve, reject) => {
            if (caption) caption = caption.toLowerCase()
            let firstReq = await this.baseRequest("upload", "POST", "json", { "contentType": "video/mp4" })
            .catch((err) => reject(err))

            let buffer = await resolveSource.resolveBufferFromURL(uri)
            .catch((err) => reject(err))

            let secondReq = await this.baseRequest(firstReq.data.uploadURL, "PUT", "raw", { headers:{"Content-Type": "video/mp4"}, body: buffer}, { override: true })
            .catch((err) => reject(err))

            //let thirdReq = await this.baseRequest("post", "POST", "post", { category: category, videoUploadID: firstReq.data.uploadID, thumbUploadID: firstReq.data.uploadID, caption: caption})
            //.catch((err) => reject(err))
            //.then((res) => resolve(res))

            this.baseRequest('post', 'POST', 'post', {
                category: category,
                videoUploadID: firstReq.data.uploadID,
                thumbUploadID: firstReq.data.uploadID,
                caption: caption
            })
            .catch((err) => reject(err))
            .then((res) => resolve(res))
            //console.log(await secondReq.body
        })

    }

    /**
     * To change the Client's account avatar.
     * @param {imageUrlResolvable} uri The resolvable URL of the image
     * @returns {promise<object>}
     * 
     * @example
     * .setAvatar("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png")
     * .then((res) => console.log(res))
     * 
     * @example
     * .setAvatar("./image.jpeg")
     * .then((res) => console.log(res))
     */
    setAvatar(uri) {
        return new Promise(async (resolve, reject) => {
  
            let firstReq = await this.baseRequest("upload", "POST", "json", { "contentType": "image/jpeg" })
            .catch((err) => reject(err))
  
            let buffer = await resolveSource.resolveBufferFromURL(uri)
            .catch((err) => reject(err))
  
            let secondReq = await this.baseRequest(firstReq.data.uploadURL, "PUT", "raw", { headers:{"Content-Type": "image/jpeg"}, body: buffer}, { override: true })
            .catch((err) => reject(err))
  
            this.baseRequest('account/me', 'PUT', 'json', { avatarUploadID: firstReq.data.uploadID })
            .catch((err) => reject(err))
            .then((res) => resolve(res))
  
  
        })
    }

}