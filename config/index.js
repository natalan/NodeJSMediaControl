var convict = require('convict');
var path = require('path');

var config = convict({
    env: {
        doc: "The applicaton environment.",
        format: ["localhost", "production"],
        default: "localhost",
        env: "NODE_ENV"
    },
    tv: {
        IP: {
            doc: "IP address of the TV",
            format: String,
            default: ""
        },
        port: {
            "doc": "port to check tv on",
            format: Number,
            default: 80
        }
    },
    blaster: {
        IP: {
            doc: "IP address of the blaster",
            format: String,
            default: ""
        },
        api: {
            doc: "path to REST API",
            format: String,
            default: ""
        }
    }
});

loadFile = function (filename) {
    config.loadFile(filename);
    config.validate();
};

// load environment dependent configuration
var env = config.get('env');
loadFile(path.join(__dirname, env + '.json'));

module.exports = config;