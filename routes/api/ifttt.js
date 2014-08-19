var config = require('../../config/'),
    ifttt = require('express-ifttt');

var Cameras = require('../../collections/Cameras');

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
            device = {
                type: data.title.split('.')[0],
                id: data.title.split('.')[1]
            },
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