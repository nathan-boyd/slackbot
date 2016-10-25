var Slack = require('slack-node')
var apiToken = 'xoxb-95783990691-0eFye0weAOaYzz9SGYiNTUEq'

var slack = new Slack(apiToken)

slack.api('users.list', function (err, response) {
  if (err) {
    throw err
  }
  console.log(response)
})

slack.api('chat.postMessage', {
  text: 'hello from nodejs',
  channel: '@nboyd'
}, function (err, response) {
  if (err) {
    throw err
  }
  console.log(response)
})
