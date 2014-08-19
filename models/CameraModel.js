var Backbone = require('backbone');

const MOTION_TIMEOUT = 1000 * 60 * 5; // 5 mins

var CameraModel = Backbone.Model.extend({
    defaults: {
        motion: 0,
        name: 'Foscam'
    },
    initialize: function() {
        this.motionTimer = null;
    },
    motionDetected: function() {
        var self = this;
        this.set('motion', 1);
        if (this.motionTimer) {
            clearTimeout(this.motionTimer);
        } else {
            this.motionTimer = setTimeout(function() {
                self.set('motion', 0);
            }, MOTION_TIMEOUT);
        }
    }
});

module.exports = CameraModel;