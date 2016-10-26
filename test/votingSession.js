/* eslint-env mocha */

var expect = require('chai').expect
var VotingSession = require('../lib/votingSession')

describe('VotingSession', function () {

  describe('addVote', function () {
    var votingSession

    beforeEach(function () {
      votingSession = new VotingSession()
    })

    it('should throw an error when vote is negative', function () {
      expect(votingSession.addVote.bind('bar', -1)).to.throw()
    })

    it('should throw an error when voterName is not a string', function () {
      expect(votingSession.addVote.bind(0, 1)).to.throw()
    })

    it('should throw an error when voterName is an empty string', function () {
      expect(votingSession.addVote.bind('', 1)).to.throw()
    })
  })

  describe('tallyVotes', function () {
    var votingSession

    beforeEach(function () {
      votingSession = new VotingSession()
    })

    it('should return an array', function () {
      expect(Array.isArray(votingSession.votes)).to.be.true
    })

    it('should round average to celiing', function () {
      votingSession.addVote('foo', 4)
      votingSession.addVote('bar', 3)

      var tally = votingSession.tallyVotes()
      expect(tally.average).to.equal(4)
    })

    it('should return average of votes cast', function () {
      votingSession.addVote('foo', 1)
      votingSession.addVote('bar', 2)
      votingSession.addVote('qux', 3)

      var tally = votingSession.tallyVotes()
      expect(tally.average).to.equal(2)
    })

    it('should return an object', function () {
      votingSession.addVote('foo', 2)
      votingSession.addVote('bar', 2)

      var tally = votingSession.tallyVotes()
      expect(tally).to.be.an('object')
    })

    it('should return an object containing all voter action', function () {
      votingSession.addVote('foo', 2)
      votingSession.addVote('bar', 2)

      var tally = votingSession.tallyVotes()
      expect(tally.votes.length).to.equal(2)
    })
  })
})
