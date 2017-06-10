const crypto = require('crypto')
const MessageFormatError = require('../../exceptions').MessageFormatError

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

/**
 * Generate the json object for LINE Carousel type message
 * @param {String} altText - The altText for this carousel message
 * @param {Array} cards - The columns of the carousel
 * @param {Object} card
 * @param {text} card.text - The description of this column
 * @param {Array} card.actions = The action buttons for this column
 * @return {Object} 
 */
function carouselMessageFormatter(altText, cards) {
  if (cards.length > 5) {
    throw new MessageFormatError(
      "Carousel message's columns length must be less then 6!"
    )
  }
  if (cards.some(card => !card.text || !card.actions)) {
    throw new MessageFormatError(
      'The text and action attr. is required for carousel message!'
    )
  }

  return {
    type: 'template',
    altText,
    template: {
      type: 'carousel',
      columns: cards
    }
  }
}
module.exports.carouselMessageFormatter = carouselMessageFormatter

/**
 * Generate the json object for LINE button type message
 * @param {String} altText - The altText for this carousel message
 * @param {String} description - The description of the message
 * @param {Array} actions - The buttons of the message
 * @param {String} title - The title of the message
 * @param {String} thumbnailURL - The URL path of the thumbnail
 * @return {Object} 
 */
function buttonMessageFormatter(
  altText,
  description,
  actions,
  title = null,
  thumbnailURL = null
) {
  return {
    type: 'template',
    altText: altText,
    template: {
      type: 'buttons',
      thumbnailImageUrl: thumbnailURL,
      title: title,
      text: description,
      actions: actions
    }
  }
}
module.exports.buttonMessageFormatter = buttonMessageFormatter
