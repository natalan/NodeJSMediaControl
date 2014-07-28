

module.exports = function(app) {
    var api = require("./api")(app);

    app.get('/', function(req, res) {
        res.render('index', { title: 'Express' });
    });
};