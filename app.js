var SlackBot = require('slackbots');

var bot = new SlackBot({
  token: 'xoxb-95783990691-0eFye0weAOaYzz9SGYiNTUEq',
  name: 'case'
})

bot.on('start', function () {
  var params = {
    icon_emoji: ':cat:'
  }

  bot.postMessageToUser('nboyd', 'meow!', params)
})
