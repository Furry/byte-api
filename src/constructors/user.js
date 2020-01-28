/**
 * @typedef {object} User
 * @property {string} id
 * @property {boolean} isChannel
 * @property {number} registrationDate Timestamp for the time of registration.
 * @property {string} username
 * @property {string} avatarURL
 * @property {string} backgroundColor
 * @property {string} foregroundColor
 * @property {number} followerCount
 * @property {number} followingCount
 * @property {number} loopCount
 * @property {number} loopsConsumedCount
 * @property {boolean} isFollowing
 * @property {boolean} isFollowed
 * @property {boolean} isBlocked
 */

 /**
  * The User class, for every Byte user.
  * @class
  * @param {...User}
  */
class User {
    constructor(user) {
        Object.assign(this, user)
    }

    /**
     * Populates and or updates the cache for a user.
     * @returns {object}
     * 
     * @example
     * Client.getGlobalFeed()
     * .then((res) => {
     *  res.forEach(async (post) => {
     *      await post.populate()
     *      console.log(post.avatarURL)
     *  })
     * })
     */
    populate() {
        return new Promise((resolve, reject) => {
            this.client.baseRequest(`account/id/${this.id}`, "GET", "raw")
            .catch((err) => reject(err))
            .then((res) => {
                Object.assign(this, res.data)
                resolve(res.data)
            })
        })
    }

    /**
     * Subscribes to a user
     * @returns {object}
     * 
     * @example
     * <user>.subscribe()
     * .then((res) => console.log(res))
     */
    subscribe() {
        return this.client.baseRequest(`account/id/${this.id}/follow`, "PUT", "user")
    }

}

module.exports = User