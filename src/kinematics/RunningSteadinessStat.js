"use strict";

// Steadiness stat
define([
    'src/kinematics/PastAndPresent',
    'src/kinematics/RollingAverage'
], function (PastAndPresent, RollingAverage) {
  
    function RunningSteadinessStat() {
        this.pnp = new PastAndPresent();
        this.avg = new RollingAverage(0.9);
    }
    
    RunningSteadinessStat.prototype.push = function (coords) {
        // Get Euclidean distance between this point and the last
        // (If this is the first point, distance will be zero)
        var distance = this.pnp.push(coords, this.pnp.getDistance, this);
        
        // and then add it to the running stat
        var latestValue = this.avg.push(distance);
        
        return latestValue;
    };
    
    RunningSteadinessStat.prototype.clear = function () {
        this.pnp.clear();
        this.avg.clear();
    };
    
    return RunningSteadinessStat;
});