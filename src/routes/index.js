const Router = require('koa-router')
const router = new Router()

require('./LINE/webhook')(router)

module.exports = router
