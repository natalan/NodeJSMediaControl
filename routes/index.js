

module.exports = function(app) {
    var blaster = require('./blaster')(app),
        tv = require('./tv')(app);

    app.get('/', function(req, res) {
        res.render('index', { title: 'Express' });
    });
};