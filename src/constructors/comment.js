/**
 * @typedef Comment
 * @param {string} id The Comment ID
 * @param {string} postID The Post ID
 * @param {string} authorID The Author's ID
 * @param {string} body The Comment's text.
 * @param {number} date The Created Timestamp
 */

 /**
  * @class
  * @param {...Comment}
  */
class Comment {
    /**
     * The base Comment Class.
     * @param {object} comment Raw Comment Data 
     */
    constructor(comment) {
        Object.assign(this, comment)
    }

    /**
     * Deletes a comment. Will fail if you don't own the post, and it's someone elses comment.
     * @returns {promise<object>}
     * 
     * @example
     * if (<comment>.author.id !== client.id) {
     *  <comment>.delete()
     * }
     */
    delete() {
        this.client.baseRequest(`post/id/${this.postID}/feedback/comment/id/${this.id}`, "DELETE", "comment")
        .catch((err) => reject(err))
        .then((res) => resolve(res))
    }

    reply() {
        // stubId is the timestamp in MS that the comment was added.
        this.client.baseRequest(`post/id/${this.id}/feedback/comment`, "POST", "comment", {"body": comment, "postID": this.id, stubId: Date.now()})
        .catch((err) => reject(err))
        .then((res) => resolve(res))
    }

}

module.exports = Comment