var config = require('../../config/index');
var SamsungRemote = require('samsung-remote');
var remote = new SamsungRemote({
    ip: config.get('tv.ip'),
    timeout: 1000
});

var endpoint = '/api/tv';

module.exports = function(app) {
    app.get(endpoint + '/up', function(req, res) {
        remote.send('KEY_VOLUP', function(err) {
            if (err) {
                console.log(err);
            }
            res.json({
                message: 'ok'
            });
        });
    });

    app.get(endpoint + '/down', function(req, res) {
        remote.send('KEY_VOLDOWN', function(err) {
            if (err) {
                console.log(err);
            }
            res.json({
                message: 'ok'
            });
        });
    });

    app.get(endpoint + '/power', function(req, res) {
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

    app.get(endpoint + '/status', function(req, res) {
        console.log('TV Route :: Checking alive status...');
        remote.send('KEY_YELLOW', function(err) {
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
        });
    });

    return config.get('host.url') + endpoint;
};