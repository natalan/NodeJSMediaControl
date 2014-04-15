var Blaster = require('../clients/BlasterClient');

var endpoint = '/blaster';

module.exports = function(app) {
    app.get(endpoint + '/network', function(req, res) {
        Blaster.network().then(function(network) {
            res.json(network);
        })
    });
};