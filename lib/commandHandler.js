'use strict'

var Util = require('./util')
var messages = require('./messages')
var VotingSession = require('./votingSession')

var util = new Util()
var votingSession = new VotingSession()

class CommandHandler {

  handle (userName, command) {
    var self = this
    return new Promise(function (resolve, reject) {
      self.handleRequest(userName, command, function (err, response) {
        if (err) {
          reject(err)
        }
        resolve(response)
      })
    })
  }

  handleRequest (userName, command, callback) {
    var responseBody = {
      text: null,
      response_type: 'in_channel'
    }

    if (command.type === 'vote') {
      if (util.isEmpty(votingSession.storyName)) {
        responseBody.text = 'Voting session has not started'
        return callback(null, responseBody)
      }
      votingSession.addVote(userName, command.value)
      responseBody.text = 'vote counted'
    } else if (command.type === 'start') {
      votingSession = new VotingSession(command.value.name)
      responseBody.text = `Voting has started for ${command.value.name}`
    } else if (command.type === 'tally') {
      if (util.isEmpty(votingSession.storyName)) {
        responseBody.text = 'Voting session has not started'
        return callback(null, responseBody)
      }
      var response = this.buildTallyResponse()

      votingSession.reset()
      responseBody.text = `${response}`
    } else if (command.type === 'reset') {
      responseBody.text = 'Voting session reset for'
      votingSession.reset()
    } else if (command.type === 'invalid') {
      responseBody.text = messages.invalidRequestResponse
    }
    callback(null, responseBody)
  }

  buildTallyResponse () {
    var tally = votingSession.tallyVotes()
    var response = `Voting session ended for: ${votingSession.storyName}\n Average: ${tally.average}`
    tally.votes.forEach(function (vote) {
      response = `${response}\n  ${vote.name}: ${vote.vote}`
    })
    return response
  }

}

module.exports = CommandHandler
