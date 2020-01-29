const HttpsProxyAgent = require('https-proxy-agent')
const EventEmitter = require('events')
const fetch = require('node-fetch')
const Errors = require('./Error')
const resolveSource = require('../utils/resolveSource')

/**
 * @typedef HttpHandlerConfigOptions
 * @param proxy Proxy ip:port
 */

// this is big yikes:
var secondRun = false

class HttpHandler extends EventEmitter {
  /**
   * Creates the HttpHandler class
   * @param {string} authorization Authorization Token
   * @param {HttpHandlerConfigOptions} [config = {}]
   */
  constructor(authorization, config = {}) {
    super()
    this.baseurl = 'https://api.byte.co/'
    this.authorization = authorization
    this.config = config
  }

  baseRequest(url, method, resulttype, body, settings = {}) {
    return new Promise((resolve, reject) => {
      let finalurl
      let options = {}

      if (settings.override) {
        options = body
        finalurl = url
        options['method'] = method
      } else {
        options['method'] = method
        options['headers'] = {
          'Content-Type': 'application/json',
          authorization: this.authorization
        }
        if (body) options['body'] = JSON.stringify(body)
        finalurl = this.baseurl + url
      }

      if (this.config.proxy)
        options['agent'] = new HttpsProxyAgent(`http://${this.config.proxy}`)

      // console.log(finalurl)

      // console.log(options)
      fetch(finalurl, options).then(async res => {
        switch (res.status) {
          case 404:
            reject(new Errors.APIError("The Endpoint requested doesn't exist."))
            break
          case 429:
            reject(
              new Errors.APIError(
                "Too Many Requests. You're being rate limited"
              )
            )
            break

          case 200:
            if (!secondRun) {
              res
                .json()
                .then(json => resolve(this.responseHandler(json, resulttype)))
            } else {
              resolve(this.responseHandler(res, 'raw'))
            }
            break

          default:
            // console.log(res.status)
            reject(new Errors.APIError('Something went wrong..')) // Fallback for now.
            break
        }
      })
    })
  }

  responseHandler(response, resulttype) {
    let PostCon = require('./Post')
    let UserCon = require('./User')
    let CommentCon = require('./Comment')

    if (!response.data || !Object.keys(response.data)[0]) return response
    let result = []

    if (resulttype == 'post') {
      response.data.posts.forEach(post => {
        post.client = this
        result.push(new PostCon(post))
      })
      return result
    }

    if (resulttype == 'user') {
      if (response.data.accounts || response.data.accounts[0]) {
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

    if (resulttype == 'postuser') {
      if (response.data.posts[0] && response.data.accounts) {
        response.data.posts.forEach(post => {
          post.client = this
          response.data.accounts[post.authorID].client = this
          result.push(new PostCon(post, response.data.accounts[post.authorID]))
        })
        return result
      }
    }

    if (resulttype == 'comment') {
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
    } else return response
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
    return this.baseRequest('account/me', 'PUT', 'profile', {
      colorScheme: scheme
    })
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
    return this.baseRequest('account/me', 'PUT', 'profile', { bio: message })
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
    console.log(
      '<client>.subscribe() is DEPRECIATED. Please use <user>.subscribe, or <post>.author.subscribe()'
    )
    return this.baseRequest(`account/id/${id}/follow`, 'PUT', 'user')
  }

  /**
   * Returns all posts in your global feed.
   * @returns {array<posts>}
   *
   * @example
   * getGlobalFeed()
   * .then((res) => res.forEach((post) => post.like()))
   */
  getGlobalFeed() {
    return this.baseRequest('feed/global', 'GET', 'postuser')
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
    return this.baseRequest(`account/prefix/${name}`, 'GET', 'user')
  }

  createPost(uri, category, caption) {
    return new Promise(async (resolve, reject) => {
      secondRun = false
      let firstReq = await this.baseRequest('upload', 'POST', 'json', {
        contentType: 'video/mp4'
      }).catch(err => reject(err))

      let buffer = await resolveSource
        .resolveBufferFromURL(uri)
        .catch(err => reject(err))

      //console.log(firstReq)
      secondRun = true
      let secondReq = await this.baseRequest(
        firstReq.data.uploadURL,
        'PUT',
        'raw',
        { headers: { 'Content-Type': 'video/mp4' }, body: buffer },
        { override: true }
      ).catch(err => reject(err))

      console.log(secondReq)

      secondRun = false
      let thirdReq = await this.baseRequest('post', 'POST', 'json', {
        category: category,
        videoUploadID: firstReq.data.uploadID,
        thumbUploadID: firstReq.data.uploadID,
        caption: caption
      })

      console.log(thirdReq)
    })
  }
}

module.exports = HttpHandler
