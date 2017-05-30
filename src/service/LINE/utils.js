const crypto = require('crypto')

/**
 * Validate the signature from LINE Message API server
 * @param {Object} body - The json object carried from request
 * @param {String} channelSecret - The channel secret issued from LINE
 * @param {String} signature - The signature carried in request header
 * @return {Boolean}
 */
function validateSignature(body, channelSecret, signature) {
  const hash = crypto
    .createHmac('sha256', channelSecret)
    .update(Buffer.from(JSON.stringify(body), 'utf8'))
    .digest('base64')

  return hash === signature
}
module.exports.validateSignature = validateSignature
