const functions = require('firebase-functions')
const api = require('./api')

exports.api = api.api(functions)
