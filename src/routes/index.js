const Router = require('koa-router')
const router = new Router()

require('./LINE/webhook')(router)
require('./push')(router)

router.all('*', async (ctx, next) => {
  ctx.response.status = 404
})

module.exports = router
