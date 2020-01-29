const UserCon = require('./User')

/**
 * @typedef {object} Post
 * @property {string} id The Post's ID
 * @property {number} type Unknown
 * @property {string} authorID The Creator Of The Post
 * @property {string} caption The Post's Text/Caption
 * @property {boolean} allowCuration Unknown
 * @property {boolean} allowRemix Unknown
 * @property {string} category The category of the post.
 * @property {array<object>} mentions The users the post mentions.
 * @property {number} date The Timestamp Creation Date of the post.
 * @property {string} videoSrc The Direct URL To The Video File.
 * @property {string} thumbSrc The URL To The Thumbnail.
 * @property {number} commentCount The Amount Of Comments On The Post.
 * @property {number} likeCount The Amount Of Likes On The Post.
 * @property {boolean} likedByMe If the post is liked by the Client or not.
 * @property {number} loopCount The amount of times the post has been looped.
 * @property {boolean} rebytedByMe If the post has been rebyted by the client.
 * @property {Client} client The Client.
 * @property {User} author The author of the post.
 */

/**
 * The Post Class.
 * @class
 * @property {...Post}
 */
class Post {
  /**
   * The Post Constructor
   * @param {object} post The raw post data.
   * @param {User} user The author of the post.
   */
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
      this.client
        .baseRequest(`post/id/${this.id}/feedback/like`, 'PUT', 'postaction')
        .catch(err => reject(err))
        .then(res => resolve(res))
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
      this.client
        .baseRequest(`post/id/${this.id}/feedback/like`, 'DELETE', 'postaction')
        .catch(err => reject(err))
        .then(res => resolve(res))
    })
  }

  /**
   * Loops a post.
   * @example
   * <post>.loop()
   * .then((res) => console.log(res))
   */
  loop() {
    return new Promise((resolve, reject) => {
      this.client
        .baseRequest(`post/id/${this.id}/loop`, 'POST', 'postaction')
        .catch(err => reject(err))
        .then(res => resolve(res))
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
      this.client
        .baseRequest(`rebyte`, 'POST', 'postaction', {
          postID: this.id
        })
        .catch(err => reject(err))
        .then(res => resolve(res))
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
      this.client
        .baseRequest(`post/id/${this.id}/feedback/comment`, 'POST', 'comment', {
          body: comment,
          postID: this.id,
          stubId: Date.now()
        })
        .catch(err => reject(err))
        .then(res => resolve(res))
    })
  }

  /* Holy shit this is a huge mess. I'll finish it when i'm home. */
  __post(url, category) {
    return new Promise((resolve, reject) => {
      this.client
        .baseRequest(`upload`, 'POST', 'json', {
          payload: { contentType: 'video/mp4' }
        })
        .catch(err => reject(err))
        .then(res => {
          this.client
            .baseRequest(res.data.uploadURL, 'PUT', 'json', {
              category: category,
              videoUploadID: res.data.uploadID,
              thumbUploadID: res.data.uploadID
            })
            .then(err => reject(err))
            .then(res2 => {
              this.client
                .baseRequest('post', 'POST', 'post', {
                  'Content-Type': 'video/mp4'
                })
                .catch(err => reject(err))
                .then(res => {
                  console.log(res)
                })
            })
        })
    })
  }
}

module.exports = Post
