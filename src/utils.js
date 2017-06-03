require('es6-promise').polyfill()
require('isomorphic-fetch')

const TimeoutError = require('./exceptions').TimeoutError
const REQUEST_TIMEOUT = require('./constants').REQUEST_TIMEOUT

/**
 * Wrap the inputted object with array if it's type is not a Array
 * @param {Object|Array} maybeArray - The object would wrap with array
 * @return {Array} - The wrapped array object
 */
function toArray(maybeArray) {
  return Array.isArray(maybeArray) ? maybeArray : [maybeArray]
}
module.exports.toArray = toArray

/**
 * To request with the server described in requestInfo with timeout
 * @param {Request} requestInfo - The Request object used in browser env
 * @return {Promise} - The promise handling the response or timeout
 */
function request(requestInfo) {
  return Promise.race([
    fetchResolver(requestInfo),
    new Promise((resolve, reject) => {
      setTimeout(
        () => reject(new TimeoutError(`Request ${requestInfo.url} timeout`)),
        REQUEST_TIMEOUT
      )
    })
  ])
}
module.exports.request = request

/**
 * Wrap the fetch with resolver for different type of response body
 * @param {Request} requestInfo - The Request object used in browser env
 * @return {Promise} - The promise handling the result of response
 */
function fetchResolver(requestInfo) {
  return fetch(requestInfo).then(async response => {
    const result = await fetchResponseHandler(response)
    if (!response.ok) {
      return Promise.reject(result)
    } else {
      return result
    }
  })
}

/**
 * To handle and resolve the different type of response body
 * @param {Response} response - The Response object used in browser env
 * @return {Promise} - This promise handing the response body
 */
function fetchResponseHandler(response) {
  switch (response.headers.get('Content-Type')) {
    case 'text/html':
      return response.text()
    case 'application/json':
    case 'application/json;charset=UTF-8':
      return response.json()
    default:
      throw new TypeError('Unhandled response body type!')
  }
}
