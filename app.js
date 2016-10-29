var bodyParser = require('body-parser')
var express = require('express')
var validator = require('validator')
var check = require('check-types')

var VotingSession = require('./lib/votingSession')
var CommandParser = require('./lib/commandParser')

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

    validate.then(function () {
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

function buildTallyResponse () {
  var tally = votingSession.tallyVotes()
  var response = `Votes For: ${votingSession.storyName}\n Average: ${tally.average}`
  tally.votes.forEach(function (vote) {
    response = `${response}\n  ${vote.name}: ${vote.vote}`
  })
  return response
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
    votingSession = new VotingSession(command.value.name)
    responseBody.attachments.push({'text': `started voting for ${command.value.name}`})
  } else if (command.type === 'tally') {
    var response = buildTallyResponse()
    responseBody.attachments.push({'text': `${response}`})
  } else if (command.type === 'reset') {
    votingSession.reset()
  } else if (command.type === 'invalid') {
    responseBody.attachments.push({'text': "Invalid Request. Try one of these\n\
    /vote start 'story name'\n\
    /vote 1\n\
    /vote 2\n\
    /vote 3\n\
    /vote 5\n\
    /vote 8\n\
    /vote 13\n\
    /vote 99\n\
    /vote tally\n\
    /vote reset"})
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
