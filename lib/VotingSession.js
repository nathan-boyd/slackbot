'use strict'

var check = require('check-types')

class VotingSession {

  constructor () {
    this.votes = []
    this.voteSum = 0
  }

  addVote (voterName, vote) {
    var argsValid = check.all(
      check.map(
        {
          voterName: voterName,
          vote: vote
        },
        {
          voterName: (check.string, check.nonEmptyString),
          vote: (check.assert.integer, check.assert.positive)
        }
      )
    )

    if (!argsValid) {
      throw new Error('invalid arguments')
    }

    this.voteSum += vote
    this.votes.push({name: voterName, vote: vote})
  }

  tallyVotes () {
    return {
      votes: this.votes,
      average: Math.ceil(this.voteSum / this.votes.length)
    }
  }
}

module.exports = VotingSession
