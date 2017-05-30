const Client = require('../../service/LINE/client')
const validateSignature = require('./utils').validateSignature
const SignatureValidationFailed = require('../../exceptions')
  .SignatureValidationFailed

module.exports.signatureValidation = () => {
  return async (ctx, next) => {
    const xLineSignature = ctx.headers['x-line-signature']
    const eventsBody = ctx.request.fields || {}

    if (
      validateSignature(
        eventsBody,
        ctx.config.lineChannelSecret,
        xLineSignature
      )
    ) {
      await next()
    } else {
      throw new SignatureValidationFailed(
        'LINE signature validation failed',
        xLineSignature
      )
    }
  }
}

module.exports.eventAdaptor = () => {
  return async (ctx, next) => {
    let events = ctx.request.fields.events || ctx.request.body.events

    events = await Promise.all(
      events.map(async e => {
        if (e.type !== 'follow') return Promise.resolve(e)

        const client = new Client(ctx.config)
        const userProfileResponse = await client.getProfile(e.source.userId)
        const userProfile = await userProfileResponse.json()
        e.source.profile = userProfile
        return Promise.resolve(e)
      })
    )

    ctx.request.events = events
    ctx.response.events = []
    await next()
  }
}

module.exports.replyAgent = () => {
  return async (ctx, next) => {
    await next()

    const events = ctx.response.events
    const client = new Client(ctx.config)

    const results = await Promise.all(
      events.map(async e => {
        switch (e.type) {
          case 'reply':
            return client.replyMessage(e.target, e.message)
          case 'push':
            return client.pushMessage(e.target, e.message)
          default:
            throw new TypeError('Unknown handler for LINE client!')
        }
      })
    )

    ctx.body = await Promise.all(results.map(result => result.json()))
  }
}
