var config = require('../../config/index');
var SamsungRemote = require('samsung-remote');

var remote = new SamsungRemote({
        ip: config.get('tv.ip'),
        timeout: 1000
    }),
    endpoint = '/api/tv',
    ensureAuth = require('../../utils/auth');

module.exports = function(app) {
    app.get(endpoint + '/up', ensureAuth, function(req, res) {
        remote.send('KEY_VOLUP', function(err) {
            if (err) {
                console.log(err);
            }
            res.json({
                message: 'ok'
            });
        });
    });

    app.get(endpoint + '/down', ensureAuth, function(req, res) {
        remote.send('KEY_VOLDOWN', function(err) {
            if (err) {
                console.log(err);
            }
            res.json({
                message: 'ok'
            });
        });
    });

    app.get(endpoint + '/power', ensureAuth, function(req, res) {
        remote.send('KEY_POWEROFF', function(err) {
            if (err) {
                res.json(400, {
                    message: err
                });
            } else {
                res.json({
                    message: 'ok'
                });
            }
        });
    });

    app.get(endpoint + '/status', ensureAuth, function(req, res) {
        console.log('TV Route :: Checking alive status...');
        var _done = function(err) {
            if (err) {
                console.log('TV Route :: TV is OFF');
                res.json({
                    message: 'off'
                });
            } else {
                console.log('TV Route :: TV is ON');
                res.json({
                    message: 'on'
                });
            }
        };

        remote.send('KEY_YELLOW', _done);

    });

    return config.get('host.url') + endpoint;
};