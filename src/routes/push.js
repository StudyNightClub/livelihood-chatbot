const pushHandler = require('../middleware/pushHandler')
const eventAdaptor = require('../middleware/eventAdaptor')
const bodyParser = require('koa2-better-body')

module.exports = router => {
  router.post(
    '/push',
    bodyParser(),
    // controlServerVerify(), TODO: Verify request with my secret token
    eventAdaptor(),
    pushHandler()
  )
}
