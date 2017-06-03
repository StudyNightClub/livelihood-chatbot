const validateSignature = require('../utils').validateSignature
const SignatureValidationFailed = require('../../../exceptions')
  .SignatureValidationFailed

module.exports = () => {
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
