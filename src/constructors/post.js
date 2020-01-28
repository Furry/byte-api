const UserCon = require("./User")

/**
 * @typedef {object} Post
 * @property {string} id
 * @property {number} type
 * @property {string} authorID
 * @property {string} caption
 * @
 */
module.exports = class post {
    constructor(post, user) {
        Object.assign(this, post)

        this.author = new UserCon(user) 
    }

    /**
     * Likes a post.
     * @example
     * <post>.like()
     * .then((res) => console.log(res))
     */
    like() {
        return new Promise((resolve, reject) => {
            this.client.baseRequest(`post/id/${this.id}/feedback/like`, "PUT", "postaction")
            .catch((err) => reject(err))
            .then((res) => resolve(res))
        })
    }

    /**
     * Removes a like from a post.
     * @example
     * <post>.dislike()
     * .then((res) => console.log(res))
     */
    unlike() {
        return new Promise((resolve, reject) => {
            this.client.baseRequest(`post/id/${this.id}/feedback/like`, "DELETE", "postaction")
            .catch((err) => reject(err))
            .then((res) => resolve(res))
        })
    }
    /**
     * Rebytes a post.
     * @example
     * <post>.rebyte()
     * .then((res) => console.log(res))
     */
    rebyte() {
        return new Promise((resolve, reject) => {
            this.client.baseRequest(`post/id/${this.id}/loop`, "POST", "postaction")
            .catch((err) => reject(err))
            .then((res) => resolve(res))
        })
    }

    /**
     * Appends a comment to a post.
     * @param {string} comment The text for your comment.
     * @example
     * <post>.comment("Wow, nice vid <3").then((res) => console.log(res))
     */
    comment(comment) {
        return new Promise((resolve, reject) => {
            // stubId is the timestamp in MS that the comment was added.
            this.client.baseRequest(`post/id/${this.id}/feedback/comment`, "POST", "comment", {"body": comment, "postID": this.id, stubId: Date.now()})
            .catch((err) => reject(err))
            .then((res) => resolve(res))
        })
    }



}
