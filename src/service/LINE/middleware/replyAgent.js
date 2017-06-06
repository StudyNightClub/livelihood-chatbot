const utils = require('../utils')

module.exports = () => {
  return async (ctx, next) => {
    await next()

    const events = ctx.state.outgoingEvents
    const client = ctx.clients.LINE

    const results = await Promise.all(
      events.map(async e => {
        if (e.event === 'whoami') {
          const userProfile = await client.getProfile(e.userId)
          e.message = [
            {
              type: 'text',
              text: `你的名字，${userProfile.displayName}`
            },
            {
              type: 'text',
              text: `和身分證字號，${e.userId}`
            }
          ]
        }
        const carouselMessageIndex = e.message.findIndex(
          m => m.type === 'carousel'
        )
        if (carouselMessageIndex !== -1) {
          e.message[carouselMessageIndex] = utils.carouselMessageFormatter(
            e.message[carouselMessageIndex].altText,
            e.message[carouselMessageIndex].cards
          )
        }
        return replyUserAgent(client, e)
      })
    )

    ctx.state.serviceResponses = results
    ctx.body = {}
  }
}

/**
 * To handle the communication with LINE Message API server
 * @param {Client} client - Client object of LINE API server
 * @param {Object} event - The object describe the reply information
 * @param {String} event.type - The deliver method for the event
 * @param {String} event.target - The receiver id, maybe replyToken or userId
 * @param {Object} event.message - The message object for this reply event
 * @return {Object} - The response body from LINE API server
 */
async function replyUserAgent(client, event) {
  try {
    switch (event.type) {
      case 'reply':
        return await client.replyMessage(event.target, event.message)
      case 'push':
        return await client.pushMessage(event.target, event.message)
      default:
        throw new TypeError('Unknown handler for LINE client!')
    }
  } catch (errorResponse) {
    if (errorResponse instanceof TypeError) {
      throw errorResponse
    }
    // For other types of error, just pass it currently
    return errorResponse
  }
}
