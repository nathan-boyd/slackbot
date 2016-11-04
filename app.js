var bodyParser = require('body-parser')
var express = require('express')

var CommandParser = require('./lib/commandParser')
var CommandHandler = require('./lib/commandHandler')
var RequestValidator = require('./lib/requestValidator')

var commandParser = new CommandParser()
var commandHandler = new CommandHandler()
var requestValidator = new RequestValidator()

function createApp () {
  var app = express()

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: true
  }))

  app.get('/', function (req, res) {
    res.json('ok')
  })

  app.post('/vote', function (req, res) {
    var validate = new Promise(
      function (resolve, reject) {
        requestValidator.validateRequest(req, function (err) {
          if (err) {
            reject(err)
          }
          resolve()
        })
      }
    )

    validate.then(function () {
      var command = commandParser.parseCommand(req.body.text)
      commandHandler.handleRequest(req, command, function (err, response) {
        if (err) {
          console.log(err)
        }
        res.json(response)
      })
    })

    validate.catch(function (err) {
      console.log(err)
      res.sendStatus(400)
    })
  })

  return app
}

module.exports = createApp
