module.exports = () => {
  return async (ctx, next) => {
    await next()

    if (
      !ctx.state.serviceResponses ||
      ctx.state.serviceResponses.length === 0
    ) {
      return
    }
    /* eslint-disable no-console */
    console.log('\x1b[2m    <-- response from services\x1b[0m')
    ctx.state.serviceResponses.forEach(res => {
      console.log(JSON.stringify(res, null, 2))
    })
    console.log('\x1b[2m    --> response for requester\x1b[0m')
    console.log(JSON.stringify(ctx.body, null, 2))
    /* eslint-enable no-console */
  }
}
