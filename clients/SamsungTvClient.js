var config = require('../config/'),
    net = require('net'),
    Promise = require('bluebird'),
    _ = require('underscore');

var base64Encode = function(string) {
        return new Buffer(string).toString('base64');
    },
    _makeResolver = function(opts) {
        console.log("SamsungTV Client :: Sending %s command", opts.command);
        var resolver = Promise.defer();
        resolver.promise.then(function() {
            console.log("SamsungTV Client :: Successful %s command", opts.command);
        }, function(err) {
            console.error("SamsungTV Client :: Error sending %s command", opts.method, err);
        });
        return resolver;
    };

var _socketChunkOne = function (samsung) {
    var ipEncoded = base64Encode(config.get('host.ip')),
        macEncoded = base64Encode(config.get('host.mac'));

    var message = String.fromCharCode(0x64) +
        String.fromCharCode(0x00) +
        String.fromCharCode(ipEncoded.length) +
        String.fromCharCode(0x00) +
        ipEncoded +
        String.fromCharCode(macEncoded.length) +
        String.fromCharCode(0x00) +
        macEncoded +
        String.fromCharCode(base64Encode(config.get('host.name')).length) +
        String.fromCharCode(0x00) +
        base64Encode(config.get('host.name'));

    return String.fromCharCode(0x00) +
        String.fromCharCode(config.get('tv.appString').length) +
        String.fromCharCode(0x00) +
        config.get('tv.appString') +
        String.fromCharCode(message.length) +
        String.fromCharCode(0x00) +
        message;
};

var _socketChunkTwo = function(opts) {
    var options = _.extend({}, opts);

    var command = 'KEY_' + options.command,
        message = '';

    if(options.command) {
        message = String.fromCharCode(0x00) +
                  String.fromCharCode(0x00) +
                  String.fromCharCode(0x00) +
                  String.fromCharCode(base64Encode(command).length) +
                  String.fromCharCode(0x00) +
                  base64Encode(command);

        return String.fromCharCode(0x00) +
               String.fromCharCode(config.get('tv.tvAppString').length) +
               String.fromCharCode(0x00) +
               config.get('tv.tvAppString') +
               String.fromCharCode(message.length) +
               String.fromCharCode(0x00) +
               message;
    } else if(options.text) {
        message = String.fromCharCode(0x01) +
                  String.fromCharCode(0x00) +
                  String.fromCharCode(base64Encode(options.text).length) +
                  String.fromCharCode(0x00) +
                  base64Encode(options.text);

        return String.fromCharCode(0x01) +
               String.fromCharCode(config.get('tv.appString').length) +
               String.fromCharCode(0x00) +
               config.get('tv.appString') +
               String.fromCharCode(message.length) +
               String.fromCharCode(0x00) +
               message;
    }
}

var _send = function(opts) {
    var resolver = _makeResolver(opts),
        socket = net.connect(config.get('tv.port'), config.get('tv.ip'));

    socket.on('connect', function() {
        socket.write(_socketChunkOne());
        socket.write(_socketChunkTwo(opts));
        socket.end();
        resolver.resolve();
    });

    socket.on('error', function(error) {
        var errorMsg;

        if (error.code === 'EHOSTUNREACH' || error.code === 'ECONNREFUSED') {
            errorMsg = 'SamsungTV Client: Device is off or unreachable';
        } else {
            errorMsg = 'SamsungTV Client: ' + error.code;
        }
        resolver.reject(errorMsg);
    });

    return resolver.promise;
};

module.exports = {
    send: _send
};