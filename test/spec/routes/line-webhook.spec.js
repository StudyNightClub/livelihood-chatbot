const request = require('supertest')
const Koa = require('koa')
const router = require('../../../src/routes')
const expect = require('chai').expect

const app = new Koa()
/* To suppress call stack output from error */
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = err.message
  }
})
app.use(router.routes())
app.use(router.allowedMethods())
app.context.config = { lineChannelSecret: 'FAKE_CHANNEL_SECRET' }

const requestAgent = request(app.callback())

describe('POST /LINE/webhook', function() {
  it('responds with 403 if signature validation failed', function() {
    const fakeLINESignature = 'FAKE_LINE_SIGNATURE'

    return requestAgent
      .post('/LINE/webhook')
      .set('x-line-signature', fakeLINESignature)
      .expect(403)
      .then(res => {
        expect(res.error.text).to.equal('LINE signature validation failed')
      })
  })
})
