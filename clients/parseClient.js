var Parse = require('node-parse-api').Parse,
    config = require('../config/');

var parse = new Parse(config.get('parse.APP_ID'), config.get('parse.APP_KEY'));

module.exports = parse;