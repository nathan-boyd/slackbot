var RTM_EVENTS = require('@slack/client').RTM_EVENTS
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS

var RtmClient = require('@slack/client').RtmClient
var MemoryDataStore = require('@slack/client').MemoryDataStore

var token = process.env.SLACK_API_TOKEN || 'xoxb-95783990691-0eFye0weAOaYzz9SGYiNTUEq'

var rtm = new RtmClient(
  token,
  {
    logLevel: 'debug'
  }
)

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`)
})

rtm.on(RTM_EVENTS.MESSAGE, function (message) {
  console.dir(message)
})

rtm.start()
