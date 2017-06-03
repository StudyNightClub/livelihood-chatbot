const LINEClient = require('../../LINE/client')
const lineCarouselTemplate = require('../../LINE/utils')
  .carouselMessageFormatter
const emoji = require('node-emoji')

module.exports = () => {
  return async (ctx, next) => {
    const lineClient = new LINEClient(ctx.config)

    ctx.state.serviceResponses = await Promise.all(
      ctx.state.incomingEvents.map(async e => {
        if (!e.userNickname) {
          const userProfileResponse = await lineClient.getProfile(e.target)
          const userProfile = await userProfileResponse.json()
          e.userNickname = userProfile.displayName
        }
        return lineClient.pushMessage(e.target, [
          {
            type: 'text',
            text: emoji.emojify(`${e.userNickname}學尢，近日可好啊:wave:`)
          },
          lineCarouselTemplate(e.altText, e.columns)
        ])
      })
    )

    ctx.body = {}
  }
}
