const control = require('../service/Livelihood/middleware')
const bodyParser = require('koa2-better-body')

module.exports = router => {
  router.post(
    '/push',
    bodyParser(),
    // controlServerVerify(), TODO: Verify request with my secret token
    control.eventAdaptor(),
    control.pushHandler()
  )
}
