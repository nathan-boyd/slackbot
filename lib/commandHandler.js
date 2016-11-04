'use strict'

var Util = require('./util')
var messages = require('./messages')
var VotingSession = require('./votingSession')

var util = new Util()
var votingSession = new VotingSession()

class CommandHandler {

  buildTallyResponse () {
    var tally = votingSession.tallyVotes()
    var response = `Voting session ended for: ${votingSession.storyName}\n Average: ${tally.average}`
    tally.votes.forEach(function (vote) {
      response = `${response}\n  ${vote.name}: ${vote.vote}`
    })
    return response
  }

  handleRequest (req, command, callback) {
    var responseBody = {
      response_type: 'in_channel',
      'attachments': []
    }

    if (command.type === 'vote') {
      if (util.isEmpty(votingSession.storyName)) {
        responseBody.attachments.push({'text': 'Voting session has not started'})
        return callback(null, responseBody)
      }
      votingSession.addVote(req.body.user_name, command.value)
      responseBody.attachments.push({'text': 'vote counted'})
    } else if (command.type === 'start') {
      votingSession = new VotingSession(command.value.name)
      responseBody.attachments.push({'text': `Voting has started for ${command.value.name}`})
    } else if (command.type === 'tally') {
      if (util.isEmpty(votingSession.storyName)) {
        responseBody.attachments.push({'text': 'Voting session has not started'})
        return callback(null, responseBody)
      }

      var response = this.buildTallyResponse()

      votingSession.reset()
      responseBody.attachments.push({'text': `${response}`})
    } else if (command.type === 'reset') {
      responseBody = 'Voting session reset for'
      votingSession.reset()
    } else if (command.type === 'invalid') {
      responseBody.attachments.push({'text': messages.invalidRequestResponse})
    }
    callback(null, responseBody)
  }
}

module.exports = CommandHandler
