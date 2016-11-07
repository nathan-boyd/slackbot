'use strict'

var check = require('check-types')

class CommandParser {

  parse (command) {
    var self = this
    return new Promise(function (resolve, reject) {
      resolve(self.parseCommand(command))
    })
  }

  parseCommand (command) {
    this.validateCommandString(command)
    var chunks = command.split(' ')
    return chunks.length === 1 ? this.parseSingleCommand(chunks[0]) : this.parseMultipleCommands(chunks)
  }

  parseSingleCommand (command) {
    var commandIsValid = ['reset', 'tally', '1', '2', '3', '5', '8', '13', '99'].indexOf(command) > -1

    if (commandIsValid && isNaN(command)) {
      return {
        type: command
      }
    } else if (commandIsValid) {
      return {
        type: 'vote',
        value: parseInt(command)
      }
    }

    return {
      type: 'invalid',
      value: command
    }
  }

  parseMultipleCommands (commandChunks) {
    var commandIsValid = ['start'].indexOf(commandChunks[0]) > -1

    if (!commandIsValid) {
      return {
        type: 'invalid',
        value: commandChunks[0]
      }
    }

    return {
      type: commandChunks.shift(),
      value: {
        name: commandChunks.join(' ')
      }
    }
  }

  validateCommandString (command) {
    var argsValid = check.all(
      check.map(
        {
          command: command
        },
        {
          command: (check.string, check.nonEmptyString)
        }
      )
    )

    if (!argsValid) {
      throw new Error('invalid arguments')
    }
  }
}

module.exports = CommandParser
