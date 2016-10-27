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
  app.use(bodyParser.urlencoded({
    extended: true
  }))

  app.get('/', function (req, res) {
    res.json('ok')
  })

  app.post('/vote', function (req, res) {
    var validate = new Promise(
      function (resolve, reject) {
        validateRequest(req, function (err) {
          if (err) {
            reject(err)
          }
          resolve()
        })
      }
    )

    validate.then(function (){
      var command = commandParser.parseCommand(req.body.text)
      handleRequest(req, command, function (err, response) {
        if (err) {
          console.log(err)
        }
        res.json(response)
      })
    })

    validate.catch(function (err) {
      console.log(err)
      res.sendStatus(400)
    })
  })

  return app
}

function handleRequest (req, command, callback) {
  var responseBody = {
    response_type: 'in_channel',
    'attachments': []
  }

  if (command.type === 'vote') {
    votingSession.addVote(req.body.user_name, command.value)
    responseBody.attachments.push({'text': 'vote counted'})
  } else if (command.type === 'start') {
    responseBody.attachments.push({'text': `started voting for ${command.value.name}`})
  }

  callback(null, responseBody)
}

function validateRequest (req, callback) {
  if (req.body.token !== 'S9uz79qX2LB9dIhqIG18x2Ja') {
    callback(new Error('invalid token'))
  }

  if (req.body.command !== '/vote') {
    callback(new Error(`invalid operation ${req.body.command}`))
  }

  callback(null)
}
