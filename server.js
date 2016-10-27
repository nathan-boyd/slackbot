var http = require('http')
var createApp = require('./app')

var app = createApp()
var port = Number(process.env.PORT) || 4000
var server = http.createServer(app)

server.listen(port)
server.on('listening', onListening)

module.exports = server

function onListening () {
  var listening = true

  console.log('http server listening on port ' + server.address().port)

  process.on('uncaughtException', function onUncaughtException (error) {
    // Exit in 30 seconds if still alive
    var timer = setTimeout(function () {
      process.exit(1)
    }, 30000)
    timer.unref()

    // Write error
    console.error('Uncaught exception: ' + error.stack)

    if (listening) {
      // Stop the HTTP server
      server.close()
      listening = false
    }
  })
}
