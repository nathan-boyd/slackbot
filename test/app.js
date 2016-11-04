/* eslint-env mocha */

var createApp = require('../app')

var expect = require('chai').expect
var request = require('supertest')

describe('app tests', function () {

  var app = null
  var votePayload = null

  beforeEach(function () {
    app = createApp()
    votePayload = {
      token: 'S9uz79qX2LB9dIhqIG18x2Ja',
      team_id: 'T2NCVEXJA',
      team_domain: 'dataextensions',
      channel_id: 'D2NK4JZGA',
      channel_name: 'directmessage',
      user_id: 'U2NJHQS3E',
      user_name: 'nboyd',
      command: '/vote',
      text: '5',
      response_url: 'https://hooks.slack.com/commands/T2NCVEXJA/96739914134/3tgT0gB9mH2dCmEBbCGF5Mxt'
    }
  })

  describe('invalid vote request', function () {
    it('should return a 400 when token is invalid', function (done) {
      votePayload.token = 'foo'

      request(app)
        .post('/vote')
        .set('content-type', 'application/json')
        .send(JSON.stringify(votePayload))
        .end(function (req, res) {
          expect(res.status).to.equal(400)
          done()
        })
    })
  })

  describe('valid vote after voting session started', function () {

    it('should respond with vote counted', function (done) {

      votePayload.text = 'start "new story"'
      request(app)
        .post('/vote')
        .set('content-type', 'application/json')
        .send(JSON.stringify(votePayload))
        .end(function (req, res) {
          expect(res.status).to.equal(200)
        })

      votePayload.text = '5'

      request(app)
        .post('/vote')
        .set('content-type', 'application/json')
        .send(JSON.stringify(votePayload))
        .end(function (req, res) {
          expect(res.status).to.equal(200)
          expect(res.body.attachments[0].text === 'vote counted').to.be.true
          done()
        })
    })
  })

  describe('vote start', function () {
    it('should aknowledge that polling has started', function (done) {
      votePayload.text = 'start "new story"'
      request(app)
        .post('/vote')
        .set('content-type', 'application/json')
        .send(JSON.stringify(votePayload))
        .end(function (req, res) {
          expect(res.status).to.equal(200)
          expect(res.body.attachments[0].text.indexOf('Voting has started') !== -1).to.be.true
          done()
        })
    })
  })

  describe('vote tally', function () {
    var testVotes = [
      {name: 'bob', vote: '5'},
      {name: 'sue', vote: '3'},
      {name: 'hal', vote: '1'}
    ]

    before(function () {
      testVotes.forEach(function (testVote) {
        votePayload.user_name = testVote.name
        votePayload.text = testVote.vote

        request(app)
          .post('/vote')
          .set('content-type', 'application/json')
          .send(JSON.stringify(votePayload))
          .end(function (req, res) {
            expect(res.status).to.equal(200)
            expect(res.body.attachments[0].text === 'vote counted').to.be.true
          })
      })
    })

    it('should return a voting summary', function (done) {

      votePayload.text = 'tally'

      request(app)
        .post('/vote')
        .set('content-type', 'application/json')
        .send(JSON.stringify(votePayload))
        .end(function (req, res) {
          expect(res.status).to.equal(200)
          console.dir(JSON.stringify(res.body))
          done()
        })
    })
  })
})
