var convict = require('convict');
var path = require('path');

var config = convict({
    env: {
        doc: "The application environment.",
        format: ["development", "production"],
        default: "development",
        env: "NODE_ENV"
    },
    host: {

    },
    app: {
        secret: {
            doc: "session secret",
            format: String,
            default: ""
        }
    },
    tv: {
        ip: {
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
        ip: {
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