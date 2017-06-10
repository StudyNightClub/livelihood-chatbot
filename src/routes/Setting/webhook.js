const bodyParser = require('koa2-better-body')
const setting = require('../../service/Setting/middleware')

module.exports = router => {
  router.post(
    '/Setting/webhook',
    bodyParser(),
    // setting.signatureValidation(),
    setting.eventAdaptor(),
    setting.eventHandler()
  )
}
