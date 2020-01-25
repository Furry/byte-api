module.exports = class post {
    constructor(post) {
        Object.assign(this, post)
    }

    /**
     * Likes a post.
     * @example
     * <post>.like()
     * .then((res) => console.log(res))
     */
    like = () => {
        return new Promise((resolve, reject) => {
            this.client.basePutRequest(`post/id/${this.id}/feedback/like`)
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
    rebyte = () => {
        return new Promise((resolve, reject) => {
            // stubId is the timestamp in MS that the comment was added.
            this.client.basePostRequest(`post/id/${this.id}/loop`)
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
    comment = (comment) => {
        return new Promise((resolve, reject) => {
            // stubId is the timestamp in MS that the comment was added.
            this.client.baseRequest({"body": comment, "postID": this.id, stubId: Date.now()}, `post/id/${this.id}/feedback/comment`, "POST")
            .catch((err) => reject(err))
            .then((res) => resolve(res))
        })
    }

}