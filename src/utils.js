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
 * @return {Promise} - The promise handling the response
 */
function request(requestInfo) {
  return fetch(requestInfo)
}
module.exports.request = request
