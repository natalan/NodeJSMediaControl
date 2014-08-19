var Backbone = require('backbone');

const MOTION_TIMEOUT = 1000 * 60 * 5; // 5 mins

var CameraModel = Backbone.Model.extend({
    default: {
        motion: false,
        name: 'Foscam'
    },
    initialize: function() {
        this.motionTimer = null;
    },
    motionDetected: function() {
        var self = this;
        this.set('motion', true);
        if (this.motionTimer) {
            clearTimeout(this.motionTimer);
        } else {
            this.motionTimer = setTimeout(function() {
                self.set('motion', false);
            }, MOTION_TIMEOUT);
        }
    }
});

module.exports = CameraModel;