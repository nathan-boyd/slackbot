'use strict'

var check = require('check-types')

class VotingSession {

  constructor (name) {
    this.storyName = name
    this.votes = []
    this.voteSum = 0
  }

  validateVote (voterName, vote) {
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
  }

  addVote (voterName, vote) {
    this.validateVote(voterName, vote)
    this.voteSum += vote
    this.votes.push({name: voterName, vote: vote})
  }

  tallyVotes () {
    return {
      votes: this.votes,
      average: Math.ceil(this.voteSum / this.votes.length)
    }
  }

  reset () {
    this.storyName = ''
    this.votes = []
    this.voteSum = 0
  }
}

module.exports = VotingSession
