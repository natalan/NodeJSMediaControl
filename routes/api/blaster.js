var Blaster = require('../../clients/BlasterClient'),
    config = require('../../config/');

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

    app.get(endpoint + '/learn', function(req, res) {
        Blaster.learn().then(function(code) {
            res.json(code);
        }).catch(function(err) {
            res.json(err);
        })
    });

    app.get(endpoint + '/send', function(req, res) {
        Blaster.send({
            frequency: "37647",
            preamble: "",
            irCode: "340,169,19,170,19,85,19,170,19,85,19,170,19,85,19,85,19,85,19,85,19,85,19,85,19,85,19,85,19,170,19,85,19,170,19,1158,340,84,19,3321,340,84,19,3321,340,84,19,3764",
            repeat: "1"
        }).then(function() {
            res.json();
        })
    });

    return config.get('host.url') + endpoint;
};