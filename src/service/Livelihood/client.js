const request = require('../../utils').request

/** The utility class for communicating with the application livelihood control server */
class client {
  /**
   * @constructor
   * @param {Object} config - The config object containing the livelihood server root URL
   * @param {String} config.livelihoodServerRoot
   */
  constructor(config) {
    if (!config.livelihoodServerRoot) {
      throw new Error('livelihood server root URL not found!')
    }
    this.livelihoodRoot = config.livelihoodServerRoot

    this.post = this.post.bind(this)
    this.get = this.get.bind(this)
    this.delete = this.delete.bind(this)
  }

  /**
   * request livelihood server with POST method
   * @param {String} url - The url where request would sent to 
   * @param {Object} body - The javascript object that would sent 
   * @return {Promise}
   */
  post(url, body) {
    return request(
      new Request(`${this.livelihoodRoot}${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
    )
  }

  /**
   * request livelihood server with GET method
   * @param {String} url - The url where request would sent to
   * @return {Promise}
   */
  get(url) {
    return request(
      new Request(`${this.livelihoodRoot}${url}`, {
        method: 'GET'
      })
    )
  }

  /**
   * request livelihood server with DELETE method
   * @param {String} url - The url where request would sent to
   * @return {Promise}
   */
  delete(url) {
    return request(
      new Request(`${this.livelihoodRoot}${url}`, {
        method: 'DELETE'
      })
    )
  }
}

module.exports = client
