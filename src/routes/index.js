const Router = require('koa-router')
const router = new Router()

require('./LINE/webhook')(router)
require('./push')(router)

module.exports = router
