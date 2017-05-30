const baseURL = 'https://api.line.me/v2/bot'

module.exports = {
  reply: `${baseURL}/message/reply`,
  push: `${baseURL}/message/push`,
  multicast: `${baseURL}/message/multicast`,
  content: messageId => `${baseURL}/message/${messageId}/content`,
  profile: userId => `${baseURL}/profile/${userId}`,
  leaveGroup: groupId => `${baseURL}/group/${groupId}/leave`,
  leaveRoom: roomId => `${baseURL}/room/${roomId}/leave`
}
