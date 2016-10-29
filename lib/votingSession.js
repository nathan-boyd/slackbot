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

    var hasVoted = false
    this.votes.forEach(function (existingVote) {
      if (existingVote.name === voterName) {
        this.voteSum -= existingVote.vote
        this.voteSum += vote
        existingVote.vote = vote
        hasVoted = true
      }
    })

    if (!hasVoted) {
      this.votes.push({name: voterName, vote: vote})
      this.voteSum += vote
    }
  }

  tallyVotes () {
    this.reset()
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
