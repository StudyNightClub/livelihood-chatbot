const lineVerify = require('../../service/LINE/middleware').signatureValidation
const lineEventAdaptor = require('../../service/LINE/middleware').eventAdaptor
const lineReplyAgent = require('../../service/LINE/middleware').replyAgent
const bodyParser = require('koa2-better-body')

module.exports = router => {
  router.post(
    '/LINE/webhook',
    bodyParser(),
    lineVerify(),
    lineEventAdaptor(),
    lineReplyAgent()
  )
}
