const crypto = require('crypto')
const fakeChannelSecret = require('./config').lineChannelSecret

const textAndStickerEvents = {
  headers: {
    accept: '*/*',
    'accept-charset': 'utf-8',
    'content-type': 'application/json;charset=UTF-8',
    'x-line-signature': null
  },
  body: {
    events: [
      {
        replyToken: '00000000000000000000000000000000',
        type: 'message',
        timestamp: 1451617200000,
        source: {
          type: 'user',
          userId: 'Udeadbeefdeadbeefdeadbeefdeadbeef'
        },
        message: {
          id: '100001',
          type: 'text',
          text: 'Hello,world'
        }
      },
      {
        replyToken: 'ffffffffffffffffffffffffffffffff',
        type: 'message',
        timestamp: 1451617210000,
        source: {
          type: 'user',
          userId: 'Udeadbeefdeadbeefdeadbeefdeadbeef'
        },
        message: {
          id: '100002',
          type: 'sticker',
          packageId: '1',
          stickerId: '1'
        }
      }
    ]
  }
}
textAndStickerEvents.headers['x-line-signature'] = crypto
  .createHmac('sha256', fakeChannelSecret)
  .update(Buffer.from(JSON.stringify(textAndStickerEvents.body), 'utf8'))
  .digest('base64')
module.exports.textAndStickerEvents = textAndStickerEvents
