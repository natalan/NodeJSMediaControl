var Backbone = require('backbone'),
    Camera = require('../models/CameraModel'),
    data = require('../cameras.json');

var Cameras = Backbone.Collection.extend({
    model: Camera
});

var myCameras = new Cameras(data);
module.exports = myCameras;