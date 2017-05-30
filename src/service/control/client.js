const request = require('../../utils').request

/** The utility class for communicating with the application central control server */
class client {
  /**
   * @constructor
   * @param {Object} config - The config object containing the control server root URL
   * @param {String} config.controlServerRoot
   */
  constructor(config) {
    if (!config.controlServerRoot) {
      throw new Error('control server root URL not found!')
    }
    this.controlRoot = config.controlServerRoot

    this.post = this.post.bind(this)
    this.get = this.get.bind(this)
    this.delete = this.delete.bind(this)
  }

  /**
   * request control server with POST method
   * @param {String} url - The url where request would sent to 
   * @param {Object} body - The javascript object that would sent 
   * @return {Promise}
   */
  post(url, body) {
    return request(
      new Request(`${this.controlRoot}${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
    )
  }

  /**
   * request control server with GET method
   * @param {String} url - The url where request would sent to
   * @return {Promise}
   */
  get(url) {
    return request(
      new Request(`${this.controlRoot}${url}`, {
        method: 'GET'
      })
    )
  }

  /**
   * request control server with DELETE method
   * @param {String} url - The url where request would sent to
   * @return {Promise}
   */
  delete(url) {
    return request(
      new Request(`${this.controlRoot}${url}`, {
        method: 'DELETE'
      })
    )
  }
}

module.exports = client
