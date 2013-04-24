"use strict";

// A networked skeleton data source!
//
// allows streaming motion capture over a socket.io network connection
// from any compatible source; originally this was designed for use with
// the reconstruct-o-matic server
// (https://github.com/themasterchef/reconstruct-o-matic).
//
// If you have a locally installed sensor you can send your data stream
// up to this server to assist in the reconstruction of the skeleton;
// more sensors will increase the accuracy of the result. If you do not
// have a locally connected sensor, you can subscribe to a
// NetworkDataSource in read-only mode.
define([
    'socketio'
], function (io) {
    function NetworkDataSource(inputBcaster, outputBcaster, url) {
        this.socketInstance = io.connect(url || 'http://localhost:3000');
        this.outputBcaster = outputBcaster;
        inputBcaster.vent.rawData.add(this.sendMessage, this);
    }

    NetworkDataSource.prototype.start = function () {
        var that = this;
        this.socketInstance.on('response', function (data) {
            //console.log('Server returned data');
            //console.log(data);
            
            that.outputBcaster.broadcastUser(data);
        });
    };
    
    NetworkDataSource.prototype.stop = function () {
        this.socketInstance.off('response');
    };
    
    NetworkDataSource.prototype.sendMessage = function (msg) {
        this.socketInstance.emit('request', msg);
    };
    
    NetworkDataSource.prototype.sendCalibrationData = function (msg) {
        console.log('calibrating');
        this.socketInstance.emit('calibrate', msg);
    };
    
    NetworkDataSource.prototype.joinRoom = function (roomId) {
        console.log("Joining room");
        this.socketInstance.emit('subscribe', roomId);
    };
    
    NetworkDataSource.prototype.close = function () {
        this.socketInstance.off('response', this.ondata);
        this.socketInstance.leave();
    };
    
    return NetworkDataSource;
});