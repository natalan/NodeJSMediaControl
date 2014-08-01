var Blaster = require('../../clients/BlasterClient'),
    config = require('../../config/'),
    _ = require('underscore');

var endpoint = '/api/blaster';

module.exports = function(app) {
    app.get(endpoint + '/network', function(req, res) {
        Blaster.network().then(function(network) {
            res.json(network);
        })
    });

    app.get(endpoint + '/connectors', function(req, res) {
        Blaster.connectors().then(function(network) {
            res.json(network);
        })
    });

    app.get(endpoint + '/files', function(req, res) {
        Blaster.files().then(function(files) {
            res.json(files);
        })
    });

    app.post(endpoint + '/learn', function(req, res) {
        Blaster.learn().then(function(code) {
            res.json(code);
        }).catch(function(err) {
            res.json(err);
        })
    });



    app.post(endpoint + '/send', function(req, res) {
        var device = req.body.device,
            command = req.body.command;

        if (!device || !command) {
            res.json(400, "Both device and command are required");
        }
        var command = _.extend({}, config.get("irParams." + device), {
            irCode: config.get("commands." + device + "." + command)
        });

        console.log("Sending command to Blaster: ", command);

        Blaster.send(command).then(function(result) {
            res.json(result);
        }).catch(function (err) {
            res.json({
                error: err
            });
        });
    });

    return config.get('host.url') + endpoint;
};