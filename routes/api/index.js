var config = require('../../config'),
    _ = require('underscore'),
    fs = require("fs");

var auth = require('../../utils/auth');

module.exports = function(app) {
    var endpoints = {};
    fs.readdirSync(__dirname).forEach(function(file) {
        if (file == 'index.js') { return; }
        endpoints[file.replace('.js', '')] = require('./' + file)(app);
    });

    app.get('/api', auth, function(req, res) {
        res.json(endpoints);
    });
};