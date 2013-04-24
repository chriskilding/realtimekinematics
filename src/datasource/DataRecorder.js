"use strict";

// A geometry recorder.
//
// This is a fairly simple utility which is intended to be wired up
// to your Broadcaster or JointUpdater of choice, and records the data
// stream from the moment you call `start()` to the moment you call `stop()`.
define([
    'underscore'
], function (_) {
    function DataRecorder(options) {
        var opts = options || {};
        
        this.maxRecordingTime = opts.maxRecordingTime || null;
        
        // An array of [x,y,z] arrays!
        this.history = [];
        
        this.isRecording = false;
    }
    
    // Immutable snapshot of the recorded data
    // at this point in time
    DataRecorder.prototype.getHistory = function () {
        return _.clone(this.history);
    };
    
    DataRecorder.prototype.start = function () {
        this.isRecording = true;
        
        if (this.maxRecordingTime) {
            // Get the this context right
            var that = this;
            setTimeout(that.stop, that.maxRecordingTime);
        }
    };
    
    DataRecorder.prototype.stop = function () {
        this.isRecording = false;
    };
    
    DataRecorder.prototype.clear = function () {
        this.history = [];
    };
    
    DataRecorder.prototype.update = function (data) {
        if (this.isRecording) {
            this.history.push(data);
        }
    };
    
    return DataRecorder;
});