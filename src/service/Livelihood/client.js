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
      /* Disable any function if the livelihood server wasn't setting */
      console.error('[WARNING] Livelihood control server URL not found!') // eslint-disable-line no-console
      this.post = this.get = this.delete = () => {}
    }
    this.livelihoodRoot = config.livelihoodServerRoot

    this.userRequestNotification = this.userRequestNotification.bind(this)
    this.requestMapButtonURL = this.requestMapButtonURL.bind(this)

    this.post = this.post.bind(this)
    this.get = this.get.bind(this)
    this.delete = this.delete.bind(this)
  }

  /**
   * Request Livelihood control server to push tomorrow notification with specific location
   * @param {String} userId - The id of the user
   * @param {Number} latitude - The latitude info of the location user requested
   * @param {Number} longitude - The longitude info of the location user requested
   * @return {Promise}
   */
  userRequestNotification(userId, latitude, longitude) {
    return this.post(
      `/notify_here/${userId}`,
      {
        data: {
          latitude,
          longitude
        }
      },
      'application/x-www-form-urlencoded'
    )
  }

  /**
   * Request the map URL for map button in rich content menu
   * @param {String} userId - The id of the user
   * @return {Promise}
   */
  requestMapButtonURL(userId) {
    return this.get(`/get_map/${userId}`)
  }

  /**
   * request livelihood server with POST method
   * @param {String} url - The url where request would sent to 
   * @param {Object} body - The javascript object that would sent 
   * @param {String} contentType - The format of data we send
   * @return {Promise}
   */
  post(url, body, contentType = 'application/json') {
    let bodyData
    if (contentType === 'application/x-www-form-urlencoded') {
      bodyData = Object.keys(body)
        .map(key => {
          return encodeURIComponent(key) + '=' + encodeURIComponent(body[key])
        })
        .join('&')
    } else {
      bodyData = JSON.stringify(body)
    }
    return request(
      new Request(`${this.livelihoodRoot}${url}`, {
        method: 'POST',
        headers: { 'Content-Type': contentType },
        body: bodyData
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
