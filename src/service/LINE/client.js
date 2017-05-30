const urls = require('./urls')
const request = require('../../utils').request
const toArray = require('../../utils').toArray

/** The utility class for communicating with LINE Message API Server */
class client {
  /**
   * @constructor
   * @param {Object} config - The config object containing the channel access token from LINE
   * @param {String} config.lineChannelAccessToken
   */
  constructor(config) {
    if (!config.lineChannelAccessToken) {
      throw new Error('no channel access token')
    }
    this.channelAccessToken = config.lineChannelAccessToken

    this.replyMessage = this.replyMessage.bind(this)
    this.pushMessage = this.pushMessage.bind(this)
    this.getProfile = this.getProfile.bind(this)

    this.post = this.post.bind(this)
    this.get = this.get.bind(this)
    this.authHeader = this.authHeader.bind(this)
  }

  /**
   * Reply the message using replyToken
   * @param {String} replyToken - The token carried in request body
   * @param {Object|Array} messages - The message objects for replying
   * @return {Promise}
   */
  replyMessage(replyToken, messages) {
    return request(
      this.post(urls.reply, {
        replyToken,
        messages: toArray(messages)
      })
    )
  }

  /**
   * Push the message to the specified user
   * @param {String} to - The userId that client would sent message to
   * @param {Object|Array} messages - The Message objects for pushing
   * @return {Promise}
   */
  pushMessage(to, messages) {
    return request(
      this.post(urls.push, {
        to,
        messages: toArray(messages)
      })
    )
  }

  /**
   * Query the profile info of the userId provided
   * @param {String} userId - The userId that client would get its profile
   * @return {Promise}
   */
  getProfile(userId) {
    return request(this.get(urls.profile(userId)))
  }

  /**
   * Create the request object with POST method
   * @param {String} url - The url where request would sent to 
   * @param {Object} body - The javascript object that would sent 
   * @return {Request}
   */
  post(url, body) {
    return new Request(url, {
      method: 'POST',
      headers: this.authHeader(),
      body: JSON.stringify(body)
    })
  }

  /**
   * Create the request object with GET method
   * @param {String} url - The url where request would sent to
   * @return {Request}
   */
  get(url) {
    return new Request(url, {
      method: 'GET',
      headers: this.authHeader()
    })
  }

  /**
   * Create the Headers object that containing LINE authorized info
   * @return {Headers}
   */
  authHeader() {
    return new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.channelAccessToken}`
    })
  }
}

module.exports = client
