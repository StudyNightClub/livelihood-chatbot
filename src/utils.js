require('es6-promise').polyfill()
require('isomorphic-fetch')

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
 * To request with the server described in requestInfo
 * @param {Request} requestInfo - The Request object used in browser env
 * @return {Promise} - The promise handling the response.json
 */
function request(requestInfo) {
  return fetch(requestInfo).then(async response => {
    const result = await fetchResponseHandler(response)
    if (!response.ok) {
      return Promise.reject(result)
    } else {
      return result
    }
  })
}
module.exports.request = request

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
