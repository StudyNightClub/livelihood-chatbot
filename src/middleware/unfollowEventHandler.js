const ControlServerClient = require('../service/control/client')

module.exports = () => {
  return async (ctx, next) => {
    if (ctx.request.events.every(e => e.type !== 'unfollow')) {
      await next()
      return
    }
    /* separate unfollow and notUnfollow events */
    const events = ctx.request.events.reduce(
      (output, e) => {
        if (e.type === 'follow') output.unfollow.push(e)
        else output.notUnfollow.push(e)
        return output
      },
      { unfollow: [], notUnfollow: [] }
    )

    // wait until all unfollow events were handled
    await Promise.all(
      events.unfollow.map(async e => {
        /* post new user info to control server */
        const controlClient = new ControlServerClient(ctx.config)
        // TODO: handle connection error with control server
        await controlClient.delete('/user', {
          userId: e.source.userId,
          timestamp: +new Date()
        })
        return Promise.resolve(e)
      })
    )

    // continuously process events if there exist other events
    if (events.notUnfollow.length > 0) {
      ctx.request.events = events.notUnfollow
      await next()
    }
  }
}
