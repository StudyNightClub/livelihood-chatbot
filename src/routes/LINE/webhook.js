const Client = require('../../service/LINE/client')
const lineVerify = require('../../service/LINE/middleware').signatureValidation
const eventAdaptor = require('../../service/LINE/middleware').eventAdaptor
const bodyParser = require('koa2-better-body')

module.exports = router => {
  router.post(
    '/LINE/webhook',
    bodyParser(),
    lineVerify(),
    eventAdaptor(),
    async (ctx, next) => {
      await next()

      const client = new Client(ctx.config)
      const events = ctx.request.events
      const results = await Promise.all(
        events.map(async e => {
          let userProfile = {}
          if (e.event === 'follow') {
            const name = await client.getProfile(e.target)
            userProfile = await name.json()
          }

          switch (e.type) {
            case 'reply':
              return client.replyMessage(e.target, e.message)
            case 'push':
              if (e.event === 'follow') {
                e.message = [
                  {
                    type: 'text',
                    text: `阿囉哈 ${userProfile.displayName}!`
                  },
                  e.message
                ]
              }
              return client.pushMessage(e.target, e.message)
            default:
              throw new TypeError('Unknown handler for LINE client!')
          }
        })
      )

      ctx.body = await Promise.all(results.map(result => result.json()))
    }
  )
}
