var config = require('../config/'),
    net = require('net'),
    Promise = require('bluebird'),
    _ = require('underscore');

var chr = String.fromCharCode,
    base64Encode = function(string) {
        return new Buffer(string).toString('base64');
    },
    _makeResolver = function(command) {
        console.log("SamsungTV Client :: Sending %s command", command);
        var resolver = Promise.defer();
        resolver.promise.then(function() {
            console.log("SamsungTV Client :: Successful %s command", command);
        }, function(err) {
            console.error("SamsungTV Client :: Error sending %s command", command, err);
        });
        return resolver;
    };

var _socketChunkOne = function () {
    var ipEncoded = base64Encode(config.get('host.ip')),
        macEncoded = base64Encode(config.get('host.mac'));

    var message = chr(0x64) +
        chr(0x00) +
        chr(ipEncoded.length) +
        chr(0x00) +
        ipEncoded +
        chr(macEncoded.length) +
        chr(0x00) +
        macEncoded +
        chr(base64Encode(config.get('host.name')).length) +
        chr(0x00) +
        base64Encode(config.get('host.name'));

    return chr(0x00) +
        chr(config.get('tv.appString').length) +
        chr(0x00) +
        config.get('tv.appString') +
        chr(message.length) +
        chr(0x00) +
        message;
};

var _socketChunkTwo = function(command) {
    var message = '';

    if (command) {
        message = chr(0x00) +
                  chr(0x00) +
                  chr(0x00) +
                  chr(base64Encode(command).length) +
                  chr(0x00) +
                  base64Encode(command);

        return chr(0x00) +
               chr(config.get('tv.tvAppString').length) +
               chr(0x00) +
               config.get('tv.tvAppString') +
               chr(message.length) +
               chr(0x00) +
               message;
    }
}

var _send = function(command) {
    var resolver = _makeResolver(command),
        socket = net.connect(config.get('tv.port'), config.get('tv.ip'));

    socket.on('connect', function() {
        socket.write(_socketChunkOne());
        socket.write(_socketChunkTwo(command));
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