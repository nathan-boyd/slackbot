var express = require('express')

var RTM_EVENTS = require('@slack/client').RTM_EVENTS
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS
var RtmClient = require('@slack/client').RtmClient

var token = process.env.SLACK_API_TOKEN || 'xoxb-95783990691-0eFye0weAOaYzz9SGYiNTUEq'
var app = express()

var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('port', (process.env.PORT || 9001))

app.get('/', function (req, res) {
  res.json('ok')
})

app.post('/', function (req, res) {
  console.log(req.body)

  var body = {
    response_type: 'in_channel',
    'attachments': [
      {
        'text': 'foo'
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
