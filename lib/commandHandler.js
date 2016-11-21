'use strict'

var Util = require('./util')
var messages = require('./messages')
var VotingSession = require('./votingSession')

var util = new Util()
var votingSession = new VotingSession()

class CommandHandler {

  constructor () {
    this.responseBody = {
      text: null,
      response_type: 'ephemeral'
    }
  }

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
    switch (command.type) {
      case 'vote':
        this.handleVoteRequest(userName, command, callback)
        break
      case 'start':
        this.handleStartRequest(command, callback)
        break
      case 'tally':
        this.handleTallyRequest(command, callback)
        break
      case 'reset':
        this.handleResetRequest()
        break
      case 'invalid':
        this.responseBody.text = messages.invalidRequestResponse
        callback(null, this.responseBody)
        break
      default:
        throw new Error('undefined command type')
    }
  }

  handleVoteRequest (userName, command, callback) {
    if (util.isEmpty(votingSession.storyName)) {
      this.responseBody.text = 'Voting session has not started'
      callback(null, this.responseBody)
    } else {
      votingSession.addVote(userName, command.value)
      this.responseBody.text = 'vote counted'
      callback(null, this.responseBody)
    }
  }

  handleStartRequest (command, callback) {
    votingSession = new VotingSession(command.value.name)
    this.responseBody.response_type = 'in_channel'
    this.responseBody.text = `Voting has started for ${command.value.name}`
    callback(null, this.responseBody)
  }

  handleTallyRequest (command, callback) {
    if (util.isEmpty(votingSession.storyName)) {
      this.responseBody.text = 'Voting session has not started'
      return callback(null, this.responseBody)
    } else {
      var response = this.buildTallyResponse()
      votingSession.reset()
      this.responseBody.response_type = 'in_channel'
      this.responseBody.text = `${response}`
      callback(null, this.responseBody)
    }
  }

  handleResetRequest () {
    this.responseBody.text = 'Voting session reset'
    votingSession.reset()
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
