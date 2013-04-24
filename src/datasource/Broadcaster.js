"use strict";

// Motion tracking event broadcaster
//
// Instances of this module contain event emitters that will hand a stream of skeleton data
// to their listeners as data arrives.
//
// A 'raw' input data stream is also available for clients wishing to use extra 
// vendor-proprietary metadata emitted from their chosen back-end data source.
//
// The Broadcaster is independent of the back-end you choose to wire it up to,
// providing a single clean interface to bring data into your app.
define([
    'js-signals',
    'underscore'
], function (Signal, _) {
 
    function Broadcaster() {
        this.vent = {
            skeleton: new Signal(),
            rawData: new Signal()
        };
    }
    
    Broadcaster.prototype.broadcastUser = function (user) {
        // the whole user object
        this.vent.rawData.dispatch(user);
        // just the skeleton
        this.vent.skeleton.dispatch(user.skeleton);
    };
    
    return Broadcaster;
});