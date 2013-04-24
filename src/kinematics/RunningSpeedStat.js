"use strict";

// Performs inter-frame analysis of the positions
// of vectors to determine the straight-line distance
// which the object has travelled during the time
// window between the frames, and computes its speed
// from this.
define([
    'src/kinematics/RunningStat',
    'src/kinematics/PastAndPresent'
], function (RunningStat, PastAndPresent) {
  
    function RunningSpeedStat() {
        this.pnp = new PastAndPresent();
        this.runningStat = new RunningStat();
    }
    
    RunningSpeedStat.prototype.push = function (coords) {
        // Get Euclidean distance between this point and the last
        // (If this is the first point, distance will be zero)
        var distance = this.pnp.push(coords, this.pnp.getDistance, this);
        
        // and then add it to the running stat
        this.runningStat.push(distance);
        return distance;
    };
    
    RunningSpeedStat.prototype.getMetric = function () {
        return this.runningStat.variance();
    };
    
    RunningSpeedStat.prototype.clear = function () {
        this.pnp.clear();
        // and reset the RunningStat
        this.runningStat.clear();
    };
    
    return RunningSpeedStat;
});