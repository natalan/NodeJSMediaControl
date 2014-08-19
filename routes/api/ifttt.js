var config = require('../../config/'),
    ifttt = require('express-ifttt');

var Cameras = require('../../collections/Cameras');

var getDevice = function(data) {
    var _type,
        _id = data.title;
    if (data.categories.length) {
        _type = data.categories[0];
    }

    if (_type == "camera") {
        var __id= _id.toLowerCase();
        if (__id.indexOf('porch') > -1) {
            _id = 'porch';
        } else if (__id.indexOf('garage') > -1) {
            _id = 'garage';
        } else if (__id.indexOf('living') > -1) {
            _id = 'livingRoom';
        }
    }

    return {
        "type": _type,
        "id": _id
    }
};

module.exports = function(app) {
    app.post('/xmlrpc.php', ifttt, function (req, res) {
        /* req.data should look something like the object below.
         {
         username: 'username',
         password: 'password',
         title: 'article title',
         description: 'article content',
         categories: [ 'category1', 'category2' ],
         mt_keywords: [ 'keyword1', 'keyword2' ],
         post_status: 'publish'
         }
         */

        var data = req.data,
            device = getDevice(data),
            actionArray = data.description.split('.'),
            action = {};

        if (actionArray.length) {
            action = {
                name: actionArray[0],
                argument: actionArray[1]
            };
        } else {
            action.name = data.description;
        }

        if (!device.type || !device.id) {
            console.error('ifttt :: device type or id is not set');
        }

        if (device.type == "camera") {
            var camera = Cameras.get(device.id);
            if (!camera) {
                console.error('ifttt :: cannot find camera with id: %s', device.id);
            }
            if (action.name == "motionDetected") {
                console.log("ifttt :: triggering %s on %s", action.name, device.id);
                camera.motionDetected();
            } else {
                console.error("ifttt :: action %s doesn't exist in %s", action.name, device.id);
            }
        }
        res.send(200);
    });
};