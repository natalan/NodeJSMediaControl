var request = require('request'),
    _ = require('underscore'),
    Promise = require("bluebird"),
    config = require('../config');

/*
$.ajax({
    url: 'http://192.168.1.16/api/v1/irports/1/sendir',
    data: JSON.stringify({
        frequency: "5000",
        preamble: "50,60,50,60,50,60,50,600",
        irCode: "50,600",
        repeat: "20"
    }),
    contentType: 'application/json',
    type: 'POST'
}).done(function (result) {
    alert(result.crossover);
}).fail(function (err) { alert('error')})
*/

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

function _files() {
    var methodOptions = {
            method: 'GET',
            uri: blasterURI + '/files'
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

function _send(code) {
    var methodOptions = {
            method: 'POST',
            uri: blasterURI + '/irports/1/sendir',
            json: true,
            body: code
        },
        options = _.extend({}, globalOptions, methodOptions),
        resolver = _makeResolver(methodOptions);

    request(options, function (error, response, networkObject) {
        if (error) {
            resolver.reject(JSON.stringify(error));
        } else if (response.statusCode == 404) {
            resolver.reject(JSON.stringify(networkObject));
        } else {
            resolver.resolve({message: 'ok'});
        }
    });

    return resolver.promise;
};


function _learn() {
    var methodOptions = {
            method: 'GET',
            uri: blasterURI + '/irlearn',
            json: true
        },
        options = _.extend({}, globalOptions, methodOptions),
        resolver = _makeResolver(methodOptions);

    request(options, function (error, response, learnObject) {
        if (error) {
            resolver.reject(JSON.stringify(error));
        } else if (response.statusCode != 200) {
            resolver.reject(JSON.stringify(learnObject));
        } else {
            resolver.resolve(learnObject);
        }
    });

    return resolver.promise;
};

function _connectors() {
    var methodOptions = {
            method: 'GET',
            uri: blasterURI + '/connectors',
            json: true
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


function _testLocalPost() {
    var testMessage = {
        "message": "Hi, it actually works!"
    };

    var methodOptions = {
            method: 'POST',
            uri: 'http://basicAuthUser:basicAuthPassword@dm8604.myfoscam.org:2000/test',
            //uri: 'http://localhost:2000/test',
            json: true,
            body: testMessage,
            headers: {
                '-TestHeader': '-test value!'
            }
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
    network: _network,
    files: _files,
    send: _send,
    learn: _learn,
    connectors: _connectors,
    test: _testLocalPost
};
