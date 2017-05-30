const emoji = require('node-emoji')

module.exports = () => {
  return async (ctx, next) => {
    const events = ctx.request.body

    ctx.request.events = events.map(event => {
      switch (event.type) {
        case 'follow':
          return {
            target: event.source.userId,
            event: 'follow',
            type: 'push',
            message: { type: 'text', text: emoji.emojify('感謝加我為好友呦:blush:') }
          }
        case 'unfollow':
          return {
            target: event.source.userId,
            event: 'unfollow',
            type: 'push',
            message: {
              type: 'text',
              text: emoji.emojify(`不要走:sob::sob::sob:\n不過你收的到這個訊息嗎？`)
            }
          }
        case 'message':
          return {
            target: event.replyToken,
            type: 'reply',
            message: echoMessage(event.message)
          }
        default:
          throw new TypeError('Unknown type of incoming event!')
      }
    })

    await next()
  }
}

/**
 * Echo message with its corresponding type
 * @param {Object} message - The income message object
 * @param {String} message.type - The type of the message
 * @return {Object} - The message object to response
 */
function echoMessage(message) {
  switch (message.type) {
    case 'text':
      return {
        type: 'text',
        text: message.text
      }
    case 'image':
      return {
        type: 'text',
        text: '什麼！？居然是圖片檔...！'
      }
    case 'video':
      return {
        type: 'text',
        text: '什麼！？竟然是影片檔...！'
      }
    case 'audio':
      return {
        type: 'text',
        text: '什麼！？竟然是音訊檔...！'
      }
    case 'file':
      return {
        type: 'text',
        text: '什麼！？竟然是一般檔...！'
      }
    case 'location':
      return {
        type: 'text',
        text: message.address
      }
    case 'sticker':
      return {
        type: 'sticker',
        packageId: message.packageId,
        stickerId: message.stickerId
      }
    default:
      throw new TypeError('Unknown type of message!')
  }
}
