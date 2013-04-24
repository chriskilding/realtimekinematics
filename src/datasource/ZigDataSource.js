/*jslint browser: true */
"use strict";

// Allows direct capture from a local copy of the ZigFu zig.js plugin,
// and a locally connected compatible sensor like the Microsoft Kinect.
define([
    'zig',
    'mocap/datasource/Joints'
], function (zig, Joints) {
    var zigObj = zig.findZigObject();
    
    var preprocessUserData = function (user) {
        // use joints 1-24 only - see above
        var i;
        for (i = 1; i <= 24; i++) {
            var joint = user.skeleton[i];
            
            if (joint) {
                var position = joint.position;
                
                position[0] /= 10;
                position[1] /= 10;
                position[2] = -position[2] / 10;
            }
        }
         
        return user;
    };
    
    function ZigDataSource(broadcaster, options) {
        this.broadcaster = broadcaster;
         
        // make it use the right context for 'this'
        var that = this;
        zig.addEventListener('userfound', function (user) {
            user.addEventListener('userupdate', function (user) {
                that.broadcaster.broadcastUser(preprocessUserData(user));
                //that.broadcaster.broadcastUser(user);
            });
        });
            
        if (options && (options.domElement)) {
            zig.init(options.domElement);
        } else {
            zig.embed();
        }
    }
    
    // from http://stackoverflow.com/questions/9543248/access-kinect-rgb-image-data-from-zigjs
    ZigDataSource.prototype.initWebcamStream = function (canvas) {
        var ctx = canvas.getContext('2d');
        
        // WARNING: REQUIRES V0.97+ (not yet on their CDN)     
        canvas.width = zigObj.imageMapResolution.width;
        canvas.height = zigObj.imageMapResolution.height;
        
        zigObj.requestStreams({updateImage: true});
        
        zigObj.addEventListener("NewFrame", function () {
            // Base64 decode the data - in Webkit and Gecko we can do
            // https://developer.mozilla.org/en-US/docs/DOM/window.atob
            //var rgbImage = window.atob(zigObj.imageMap);
                  
            var image = new Image();
            image.src = "data:image/png;base64," + zigObj.imageMap;
            image.onload = function () {
                ctx.drawImage(image, 0, 0);
            };
        });
    };
     
    ZigDataSource.prototype.close = function () {
        zig.removeEventListener('userfound');
        zig.removeEventListener('loaded');
    };
    
    
    return ZigDataSource;
});