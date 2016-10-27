/* eslint-env mocha */

var createApp = require('../app')

var expect = require('chai').expect
var mocha = require('mocha')
var request = require('supertest')

describe('app tests', function () {

  var voteRequestBody = null

  beforeEach(function () {
    voteRequestBody = {
      token: 'S9uz79qX2LB9dIhqIG18x2Ja',
      team_id: 'T2NCVEXJA',
      team_domain: 'dataextensions',
      channel_id: 'D2NK4JZGA',
      channel_name: 'directmessage',
      user_id: 'U2NJHQS3E',
      user_name: 'nboyd',
      command: '/vote',
      text: '9',
      response_url: 'https://hooks.slack.com/commands/T2NCVEXJA/96739914134/3tgT0gB9mH2dCmEBbCGF5Mxt'
    }

  })

  describe('valid vote request', function () {
    var app = createApp()

    it('should return a 400 when token is invalid', function (done) {

      var badRequest = voteRequestBody;
      badRequest.token = 'foo'

      request(app)
        .post('/vote')
        .set('content-type', 'application/json')
        .send(JSON.stringify(badRequest))
        .end(function (req, res) {
          expect(res.status).to.equal(400)
          done()
        })
    })
  })

  describe('valid vote request', function () {
    var app = createApp()

    it('should return a 200 status code', function (done) {
      request(app)
        .post('/vote')
        .set('content-type', 'application/json')
        .send(JSON.stringify(voteRequestBody))
        .end(function (req, res) {
          expect(res.status).to.equal(200)
          done()
        })
    })
  })
})
