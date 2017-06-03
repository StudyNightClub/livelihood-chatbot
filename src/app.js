const Koa = require('koa')
const serve = require('koa-static')
const router = require('./routes')
const config = require('./config')
const LINEClient = require('./service/LINE/client')
const LivelihoodClient = require('./service/Livelihood/client')
const errorHandler = require('./middleware/errorHandler')
const livelihood = require('./service/Livelihood/middleware')

/* ----- bootstrap server ----- */
const app = new Koa()
// setup app-scoped utility
app.context.config = config
app.context.clients = {
  LINE: new LINEClient(config),
  Livelihood: new LivelihoodClient(config)
}
// use logger
if (config.logger) {
  const logger = require('koa-logger')
  const responsesLogger = require('./middleware/responsesLogger')
  app.use(logger())
  app.use(responsesLogger())
}
app.use(serve('public'))
app.use(errorHandler())
// use router
app.use(router.routes())
app.use(router.allowedMethods())
// setting main business logic
app.use(livelihood.followEventHandler())
app.use(livelihood.unfollowEventHandler())
app.use(livelihood.echo())
// listen
app.listen(config.port, () => {
  console.log(`listening on ${config.port}`) // eslint-disable-line no-console
})
