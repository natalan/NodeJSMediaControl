var TV = require('../clients/SamsungTvClient');

var endpoint = '/tv';

module.exports = function(app) {
    app.get(endpoint + '/up', function(req, res) {
        TV.send({
            command: 'KEY_VOLUP'
        }).then(function() {
            res.json({
                message: 'ok'
            })
        })
    });
};