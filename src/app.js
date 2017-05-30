const Koa = require('koa')
const router = require('./routes')
const config = require('./config')
const errorHandler = require('./middleware/errorHandler')
const echo = require('./middleware/echo')

/* ----- bootstrap server ----- */
const app = new Koa()
app.context.config = config
// use logger
if (config.logger) {
  const logger = require('koa-logger')
  app.use(logger())
}
app.use(errorHandler())
// use router
app.use(router.routes())
app.use(router.allowedMethods())
// setting main business logic
app.use(echo())
// listen
app.listen(config.port, () => {
  console.log(`listening on ${config.port}`) // eslint-disable-line no-console
})
