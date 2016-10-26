var bodyParser = require('body-parser')
var express = require('express')
var validator = require('validator')
var check = require('check-types')

var RTM_EVENTS = require('@slack/client').RTM_EVENTS
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS
var RtmClient = require('@slack/client').RtmClient
var VotingSession = require('./lib/votingSession')
var CommandParser = require('./lib/commandParser')

var app = express()
var token = process.env.SLACK_API_TOKEN || 'xoxb-95783990691-0eFye0weAOaYzz9SGYiNTUEq'
var votingSession = new VotingSession()
var commandParser = new CommandParser()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('port', (process.env.PORT || 9001))

app.get('/', function (req, res) {
  res.json('ok')
})

app.post('/vote', function (req, res) {
  console.log(req.body)

  if (req.body.token !== 'S9uz79qX2LB9dIhqIG18x2Ja'){
    throw new Error('invalid token')
  }

  if (req.body.command !== '/vote') {
    throw new Error(`invalid operation ${req.body.command}`)
  }

  var command = commandParser.parseCommand(req.body.text)

  // var argsValid = check.all(
  //   check.map(
  //     {
  //       voterName: voterName,
  //       vote: vote
  //     },
  //     {
  //       voterName: (check.string, check.nonEmptyString),
  //       vote: (check.assert.integer, check.assert.positive)
  //     }
  //   )
  // )

  // if (!argsValid) {
  //   throw new Error('invalid arguments')
  // }

  var body = {
    response_type: 'in_channel',
    'attachments': [
      {
        'text': command.type
      }
    ]
  }

  res.json(body)
})

// var rtm = new RtmClient(
//   token,
//   {
//     logLevel: 'debug'
//   }
// )

// rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
//   console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`)
// })

// rtm.on(RTM_EVENTS.MESSAGE, function (message) {
//   console.dir(message)
// })

// rtm.start()

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'))
})
