// A metric for the Newtonian acceleration of a movement
define([
    "src/kinematics/RunningStat",
    "src/kinematics/RunningSpeedStat",
    "src/kinematics/PastAndPresent"
], function (RunningStat, RunningSpeedStat, PastAndPresent) {
    "use strict";

    // We look at the 'difference of differences'
    // as described in http://research.microsoft.com/pubs/172555/KinectGaitEMBC2012.pdf
    // to gain a rudimentary notion of acceleration
    function RunningAccelerationStat() {
        this.runningStat = new RunningStat();
        this.speedStat = new RunningSpeedStat();
        
        // A measure of the 'start' velocity
        this.previousVelocity = 0;
    }
    
    RunningAccelerationStat.prototype.push = function (coords) {
        // An estimate of the 'latest' velocity
        var endVelocity = this.speedStat.push(coords);
        
        // acceleration = difference between previous velocity and this one
        // since data arrives in pretty regular intervals (30Hz)
        // can ignore dividing by time taken
        // don't take Math.abs as accn can be negative
        // a = (v - u) / t
        var acceleration = endVelocity - this.previousVelocity;
        
        this.runningStat.push(acceleration);
    };
    
    RunningAccelerationStat.prototype.getMetric = function () {
        // High avg acceleration may suggest stronger movement
        return this.runningStat.mean();
    };
    
    RunningAccelerationStat.prototype.clear = function () {
        this.speedStat.clear();
        this.runningStat.clear();
        this.previousVelocity = 0;
    };
    
    return RunningAccelerationStat;
});