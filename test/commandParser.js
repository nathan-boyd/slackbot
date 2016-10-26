/* eslint-env mocha */

var expect = require('chai').expect
var CommandParser = require('../lib/commandParser')

describe('CommandParser', function () {
  describe('parseCommand', function () {
    var commandParser = null

    beforeEach(function () {
      commandParser = new CommandParser()
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
        var command = commandParser.parseCommand('1')
        expect(command).to.be.an('object')
      })

      it('should parse valid vote commands', function () {
        var command = commandParser.parseCommand('1')
        expect(command.type).to.equal('vote')
        expect(command.value).to.equal(1)
      })

      it('should return invalid type when passed an invalid int vote', function () {
        var command = commandParser.parseCommand('4')
        expect(command.type).to.equal('invalid')
      })

      it('should return invalid type when passed 0', function () {
        var command = commandParser.parseCommand('0')
        expect(command.type).to.equal('invalid')
      })

      it('should parse reset command', function () {
        var command = commandParser.parseCommand('reset')
        expect(command.type).to.equal('reset')
      })

      it('should parse tally command', function () {
        var command = commandParser.parseCommand('tally')
        expect(command.type).to.equal('tally')
      })

      it('should return invalid type when passed invalid command', function () {
        var command = commandParser.parseCommand('foo')
        expect(command.type).to.equal('invalid')
      })
    })

    describe('when passed multi-part command', function () {
      it('should return an object', function () {
        var command = commandParser.parseCommand('foo bar')
        expect(command).to.be.an('object')
      })

      it('should return invalid type when passed complex invalid command', function () {
        var command = commandParser.parseCommand('foo bar')
        expect(command.type).to.equal('invalid')
      })

      it('should return an object containing a parsed multipart command', function () {
        var command = commandParser.parseCommand('start "some story name"')
        expect(command.type).to.equal('start')
        expect(command.value).to.be.an('object')
        expect(command.value.name).to.equal('"some story name"')
      })
    })
  })
})

