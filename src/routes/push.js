const bodyParser = require('koa2-better-body')
const livelihood = require('../service/Livelihood/middleware')

module.exports = router => {
  router.post(
    '/push',
    bodyParser(),
    // controlServerVerify(), TODO: Verify request with my secret token
    livelihood.eventAdaptor(),
    livelihood.pushHandler()
  )
}
