'use strict'

class RequestValidator {

  validate (req) {
    var self = this
    return new Promise((resolve, reject) => {
      self.validateRequest(req, function (err) {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  }

  validateRequest (req, callback) {
    if (req.body.token !== 'S9uz79qX2LB9dIhqIG18x2Ja') {
      callback(new Error('invalid token'))
    }

    if (req.body.command !== '/vote') {
      callback(new Error(`invalid operation ${req.body.command}`))
    }

    callback(null)
  }
}

module.exports = RequestValidator
