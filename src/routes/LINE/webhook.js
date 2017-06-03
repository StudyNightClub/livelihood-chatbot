const bodyParser = require('koa2-better-body')
const line = require('../../service/LINE/middleware')

module.exports = router => {
  router.post(
    '/LINE/webhook',
    bodyParser(),
    line.signatureValidation(),
    line.eventAdaptor(),
    line.replyAgent()
  )
}
