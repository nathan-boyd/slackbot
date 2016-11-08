/* eslint-env mocha */

var expect = require('chai').expect
var CommandParser = require('../lib/commandParser')

describe('CommandParser', function () {
  describe('parseCommand', function () {
    var commandParser = null
    var votePayload = null

    beforeEach(function () {
      commandParser = new CommandParser()
      votePayload = {
        token: 'S9uz79qX2LB9dIhqIG18x2Ja',
        team_id: 'T2NCVEXJA',
        team_domain: 'dataextensions',
        channel_id: 'D2NK4JZGA',
        channel_name: 'directmessage',
        user_id: 'U2NJHQS3E',
        user_name: 'nboyd',
        command: '/vote',
        text: '5',
        response_url: 'https://hooks.slack.com/commands/T2NCVEXJA/96739914134/3tgT0gB9mH2dCmEBbCGF5Mxt'
      }
    })

    describe('when passed empty or null arguments', function () {
      it('should throw an error when command is null', function () {
        expect(commandParser.parseCommand.bind()).to.throw()
      })

      it('should throw an error when command is empty string', function () {
        expect(commandParser.parseCommand.bind('')).to.throw()
      })

      it('should throw an error when command is whitespace', function () {
        expect(commandParser.parseCommand.bind(' ')).to.throw()
      })
    })

    describe('when passed single part command', function () {
      it('should return an object', function () {
        votePayload.text = '1'
        var command = commandParser.parseCommand(votePayload)
        expect(command).to.be.an('object')
      })

      it('should return an object', function () {
        votePayload.text = '1'
        var command = commandParser.parseCommand(votePayload)
        expect(command).to.be.an('object')
      })

      it('should parse valid vote commands', function () {
        votePayload.text = '1'
        var command = commandParser.parseCommand(votePayload)
        expect(command.type).to.equal('vote')
        expect(command.value).to.equal(1)
      })

      it('should return invalid type when passed an invalid int vote', function () {
        votePayload.text = '4'
        var command = commandParser.parseCommand(votePayload)
        expect(command.type).to.equal('invalid')
      })

      it('should return invalid type when passed 0', function () {
        votePayload.text = '0'
        var command = commandParser.parseCommand(votePayload)
        expect(command.type).to.equal('invalid')
      })

      it('should parse reset command', function () {
        votePayload.text = 'reset'
        var command = commandParser.parseCommand(votePayload)
        expect(command.type).to.equal('reset')
      })

      it('should parse tally command', function () {
        votePayload.text = 'tally'
        var command = commandParser.parseCommand(votePayload)
        expect(command.type).to.equal('tally')
      })

      it('should return invalid type when passed invalid command', function () {
        votePayload.text = 'foo'
        var command = commandParser.parseCommand(votePayload)
        expect(command.type).to.equal('invalid')
      })
    })

    describe('when passed multi-part command', function () {
      it('should return an object', function () {
        votePayload.text = 'foo bar'
        var command = commandParser.parseCommand(votePayload)
        expect(command).to.be.an('object')
      })

      it('should return invalid type when passed complex invalid command', function () {
        votePayload.text = 'foo bar'
        var command = commandParser.parseCommand(votePayload)
        expect(command.type).to.equal('invalid')
      })

      it('should return an object containing a parsed multipart command', function () {
        votePayload.text = 'start "some story name"'
        var command = commandParser.parseCommand(votePayload)
        expect(command.type).to.equal('start')
        expect(command.value).to.be.an('object')
        expect(command.value.name).to.equal('"some story name"')
      })
    })
  })
})

