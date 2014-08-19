var auth = require('../utils/auth');

module.exports = function(app) {
    var api = require("./api")(app);

    app.get('/', auth, function(req, res) {
        res.render('index', {
            title: 'Natalan Ethernet'
        });
    });
};