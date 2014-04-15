var request = require('request'),
    _ = require('underscore'),
    Promise = require("bluebird"),
    config = require('../config');

var blasterURI = 'http://' + config.get('blaster.ip') + config.get('blaster.api'),
    _makeResolver = function(opts) {
        console.log("BlasterClient :: Sending %s request to %s", opts.method, opts.uri);
        var resolver = Promise.defer();
        resolver.promise.then(function() {
            console.log("BlasterClient :: Successful %s request to %s", opts.method, opts.uri);
        }, function(err) {
            console.error("BlasterClient :: Error %s request to %s", opts.method, opts.uri, err);
        });
        return resolver;
    },
    globalOptions = {
        json: true
    };

function _network() {
    var methodOptions = {
            method: 'GET',
            uri: blasterURI + '/network'
        },
        options = _.extend({}, globalOptions, methodOptions),
        resolver = _makeResolver(methodOptions);

    request(options, function (error, response, networkObject) {
        if (error) {
            resolver.reject(JSON.stringify(error));
        } else if (response.statusCode == 404) {
            resolver.reject(JSON.stringify(networkObject));
        } else {
            resolver.resolve(networkObject);
        }
    });

    return resolver.promise;
};

module.exports = {
    network: _network
};
