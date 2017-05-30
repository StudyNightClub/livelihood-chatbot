const expect = require('Chai').expect
const validateSignature = require('../../../src/service/LINE/utils')
  .validateSignature

const testRequest = require('../../data/lineRequests').textAndStickerEvents
const fakeChannelSecret = require('../../data/config').lineChannelSecret

describe('LINE Signature Validator', function() {
  it('validate x-line-signature in request header with HMAC-SHA256 algorithm', () => {
    expect(
      validateSignature(
        testRequest.body,
        fakeChannelSecret,
        testRequest.headers['x-line-signature']
      )
    ).to.be.true
  })
})
