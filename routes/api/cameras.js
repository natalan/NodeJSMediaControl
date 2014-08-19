var config = require('../../config/'),
    Cameras = require('../../collections/Cameras');


var endpoint = '/api/cameras',
    ensureAuth = require('../../utils/auth');

module.exports = function(app) {
    app.get(endpoint, ensureAuth, function(req, res) {
        res.json(Cameras.toJSON());
    });

    app.get(endpoint + '/:id', ensureAuth, function(req, res) {
        var camera = Cameras.get(req.params.id);
        if (!camera) {
            res.send(400, 'Unknown camera ID');
        } else {
            res.json(camera.toJSON());
        }
    });

    return config.get('host.url') + endpoint;
};