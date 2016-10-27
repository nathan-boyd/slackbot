var bodyParser = require('body-parser')
var express = require('express')
var validator = require('validator')
var check = require('check-types')

var VotingSession = require('./lib/votingSession')
var CommandParser = require('./lib/commandParser')

var token = process.env.SLACK_API_TOKEN || 'xoxb-95783990691-0eFye0weAOaYzz9SGYiNTUEq'
var votingSession = new VotingSession()
var commandParser = new CommandParser()

module.exports = createApp

function createApp () {
  var app = express()
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  app.get('/', function (req, res) {
    res.json('ok')
  })

  app.post('/vote', function (req, res) {
    validateRequest(req, function (err) {
      if (err) {
        console.log(err)
        res.sendStatus(400)
      }
    })

    var command = commandParser.parseCommand(req.body.text)

    console.dir(command)

    if (command.type == 'vote') {
      votingSession.addVote(req.body.user_name, command.value)
    }

    var body = {
      response_type: 'in_channel',
      'attachments': [
        {
          'text': 'ok'
        }
      ]
    }

    res.json(body)
  })

  return app
}

function validateRequest (req, callback) {
  if (req.body.token !== 'S9uz79qX2LB9dIhqIG18x2Ja') {
    console.log('token error')
    callback(new Error('invalid token'))
  }

  if (req.body.command !== '/vote') {
    console.log('command error')
    callback(new Error(`invalid operation ${req.body.command}`))
  }

  callback(null)
}
