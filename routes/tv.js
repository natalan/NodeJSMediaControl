var TV = require('../clients/SamsungTvClient');

var endpoint = '/tv';

module.exports = function(app) {
    app.get(endpoint + '/up', function(req, res) {
        TV.send('KEY_VOLUP').then(function() {
            res.json({
                message: 'ok'
            });
        });
    });

    app.get(endpoint + '/down', function(req, res) {
        TV.send('KEY_VOLDOWN').then(function success() {
            res.json({
                message: 'ok'
            });
        });
    });

    app.get(endpoint + '/power', function(req, res) {
        TV.send('KEY_POWEROFF').then(function() {
            res.json({
                message: 'ok'
            });
        });
    });
};