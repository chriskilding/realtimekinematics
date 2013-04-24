"use strict";

define([
    'src/kinematics/PastAndPresent'
], function (PastAndPresent) {
    /*
    * One way to get straightness of the line:
    * the "straightness" of a line, interpreted as the property that it minimizes distances between its points
    * 1. the displacement of line from start point to current end point = expected
    * 2. add up the euc. distances between each actual point = actual
    * 3. if displacement = distance, difference = 0, line totally straight / direct
    * 4. if actual is shorter or longer there will be a +ve or -ve delta
    */
    function RunningLineStraightnessStat() {
        this.cumulativeActualDistance = 0.0;
        this.startCoords = null;
        
        this.pnp = new PastAndPresent();
    }
    
    RunningLineStraightnessStat.prototype.push = function (coords) {
        this.pnp.push(coords, this.pnpCallback, this);
    };
    
    RunningLineStraightnessStat.prototype.pnpCallback = function (previousCoords, latestCoords) {
        if (this.startCoords) {
            // Get Euclidean distance between this point and the last
            var distance = this.pnp.getDistance(previousCoords, latestCoords);
            this.cumulativeActualDistance += distance;
        } else {
            // No history yet - set the latestCoords to be the startCoords
            // Delta is zero anyway so no change to cumulativeActualDistance
            // Duplicate the array by value to ensure no funny business
            this.startCoords = latestCoords.map(function (val) {
                return val;
            });
        }
    };
    
    // The "straightness" of the recorded line.
    // If total distance = displacement, it's perfectly straight.
    // If there is a difference, it's indirect.
    RunningLineStraightnessStat.prototype.delta = function () {
        // If no history yet the delta will be zero
        var delta = 0.0;
        
        if (this.startCoords) {
            var displacement = this.pnp.getDistanceFromLatest(this.startCoords);
            // The euc. distances between each actual point added together = actual
            delta = Math.abs(displacement - this.cumulativeActualDistance);
        }
        
        return delta;
    };
    
    RunningLineStraightnessStat.prototype.clear = function () {
        this.cumulativeActualDistance = 0.0;
        this.startCoords = null;
        this.pnp.clear();
    };
    
    return RunningLineStraightnessStat;
});