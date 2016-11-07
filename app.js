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

  app.get('/', (req, res) => {
    res.json('ok')
  })

  app.post('/vote', (req, res) => {
    requestValidator.validate(req).then(() => {
      return commandParser.parse(req.body.text)
    }).then((command) => {

      /* todo add user name to command */
      
      return commandHandler.handle(req.body.user_name, command)
    }).then((handlerResponse) => {
      res.json(handlerResponse)
    }).catch((err) => {
      console.log(err)
      res.sendStatus(400)
    })
  })

  return app
}

module.exports = createApp
