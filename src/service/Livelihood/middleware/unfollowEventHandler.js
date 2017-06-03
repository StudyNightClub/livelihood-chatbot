const LivelihoodServerClient = require('../client')

module.exports = () => {
  return async (ctx, next) => {
    if (ctx.request.events.every(e => e.type !== 'unfollow')) {
      await next()
      return
    }
    /* separate unfollow and notUnfollow events */
    const events = ctx.request.events.reduce(
      (output, e) => {
        if (e.type === 'unfollow') output.unfollow.push(e)
        else output.notUnfollow.push(e)
        return output
      },
      { unfollow: [], notUnfollow: [] }
    )

    // wait until all unfollow events were handled
    await Promise.all(
      events.unfollow.map(async e => {
        /* post new user info to livelihood control server */
        const livelihoodClient = new LivelihoodServerClient(ctx.config)
        // TODO: handle connection error with livelihood control server
        await livelihoodClient.delete(`/user/${e.source.userId}`)
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
