var config = require('../../config/'),
    iTach = require('node-itach'),
    _ = require('underscore');

var Blaster = new iTach({
    host: config.get('blaster.ip')
});
var endpoint = '/api/blaster';

var COMMANDS = require('../../commands.json');

module.exports = function(app) {
    app.post(endpoint + '/learn', function(req, res) {
        Blaster.learn(function done(err, code) {
            if (err) {
                res.json(err);
            } else {
                res.json(code);
            }
        });
    });

    app.post(endpoint + '/send', function(req, res) {
        console.debug('*** iTach :: Command: ', req.body.command);

        var command = COMMANDS[req.body.command];
        if (!command) {
            console.log('*** itach :: Received command %s but not found in hash', req.body.command);
            res.json(400, {
                message: "Command not found"
            });
        } else {
            Blaster.send({
                ir: command
            }, function done(err) {
                if (err) {
                    res.json({
                        error: err
                    });
                } else {
                    res.json({message: 'ok'});
                }
            });
        }
    });

    return config.get('host.url') + endpoint;
};