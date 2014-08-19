var config = require('./config/'),
    logger = require('./utils/logger');


var express = require('express'),
    http = require('http'),
    path = require('path');

var app = express();

app.disable('x-powered-by');

app.set('port', config.get("host.port"));
app.set('views', __dirname + '/views');
app.set('view engine', 'hjs');
app.configure(function() {
    app.use(express.logger('dev'));
    app.use(express.cookieParser());
    app.use(express.bodyParser({limit: '50mb'}));
    app.use(express.methodOverride());
    app.use(express.session({
        secret: config.get("app.secret"),
        cookie: {
            path: '/',
            httpOnly: true,
            signed: true
        }
    }));
    app.use(function (req, res, next) {
        res.header('X-FRAME-OPTIONS', "SAMEORIGIN");
        next();
    });
    app.use(app.router);
    app.use(require('less-middleware')({
        src: __dirname + '/public/stylesheets',
        prefix: '/stylesheets',
        compress: true,
        force: true
    }));

    app.use(express.compress());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


var setupRoutes = require("./routes");
setupRoutes(app);

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port') + " in " + config.get("env") + " mode");
});
