var request = require('supertest')

class TestHelper {
  castVote (app, votePayload) {
    return new Promise((resolve, reject) => {
      request(app)
        .post('/vote')
        .set('content-type', 'application/json')
        .send(JSON.stringify(votePayload))
        .end((req, res) => {
          resolve(res)
        })
    })
  }
}

module.exports = TestHelper
