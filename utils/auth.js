var express = require('express'),
    config = require('../config/');

var basicAuth = function(req, res, next) {
    var auth = express.basicAuth(config.get('app.auth.user'), config.get('app.auth.password'));
    return auth.apply(this, arguments);
};

module.exports = basicAuth;