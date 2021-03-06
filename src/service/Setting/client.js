const request = require('../../utils').request

/** The utility class for communicating with the user setting server */
class client {
  /**
   * @constructor
   * @param {Object} config - The config object containing the setting server root URL
   * @param {String} config.settingServerRoot
   * @param {String} config.settingAccessToken
   */
  constructor(config) {
    if (!config.settingServerRoot) {
      /* Disable any function if the setting server wasn't setting */
      console.error('[WARNING] Setting server URL not found!') // eslint-disable-line no-console
      this.post = this.get = this.put = this.delete = () => {}
    }
    this.settingServerRoot = config.settingServerRoot
    this.userToken = config.settingAccessToken

    this.createNewUser = this.createNewUser.bind(this)

    this.post = this.post.bind(this)
    this.get = this.get.bind(this)
    this.delete = this.delete.bind(this)
    this.put = this.put.bind(this)

    this.getSettingPageURL = this.getSettingPageURL.bind(this)
  }

  /**
   * Request setting server to create a new user
   * @param {String} id - the userId of new coming user
   * @param {String} name - the userDisplay name of new coming user
   * @return {Promise}
   */
  createNewUser(id, name) {
    return this.put(`/user/${id}?userToken=${this.userToken}`, {
      data: JSON.stringify({ id, name })
    })
  }

  /**
   * request setting server with POST method
   * @param {String} url - The url where request would sent to 
   * @param {Object} body - The javascript object that would sent 
   * @return {Promise}
   */
  post(url, body) {
    return request(
      new Request(`${this.settingServerRoot}${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
    )
  }

  /**
   * request setting server with GET method
   * @param {String} url - The url where request would sent to
   * @return {Promise}
   */
  get(url) {
    return request(
      new Request(`${this.settingServerRoot}${url}`, {
        method: 'GET'
      })
    )
  }

  /**
   * request setting server with PUT method
   * @param {String} url - The url where request would sent to 
   * @param {Object} body - The javascript object that would sent 
   * @return {Promise}
   */
  put(url, body) {
    const searchParams = Object.keys(body)
      .map(key => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(body[key])
      })
      .join('&')

    return request(
      new Request(`${this.settingServerRoot}${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: searchParams
      })
    )
  }

  /**
   * request setting server with DELETE method
   * @param {String} url - The url where request would sent to
   * @return {Promise}
   */
  delete(url) {
    return request(
      new Request(`${this.settingServerRoot}${url}`, {
        method: 'DELETE'
      })
    )
  }

  /**
   * Return the URL to setting page of the user
   * @param {String} userId - The id of the user
   * @return {String}
   */
  getSettingPageURL(userId) {
    return `${this.settingServerRoot}/setting/${userId}?userToken=${this.userToken}`
  }
}
module.exports = client
