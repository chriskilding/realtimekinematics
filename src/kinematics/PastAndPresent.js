// Useful when measuring inter-frame deltas, a PastAndPresent
// instance holds a continuously updated reference to the
// vector from the frame before, so that when new data rolls
// in, a specified callback function can be used to compare
// the two values in the manner of your choice. After the
// callback executes, the latest vector becomes the previous
// vector.
define([
    "src/util/Vector"
], function (Vector) {
    "use strict";
    
    function PastAndPresent() {
        // A reusable 3vec for holding the coords passed into push method;
        this.latestCoords = [0, 0, 0];
        this.previousCoords = [0, 0, 0];
    }
    
    
    PastAndPresent.prototype.push = function (coords, operationFunc, context) {
        this.latestCoords = coords;
        
        var returnVal;
        if (operationFunc) {
            // A 'this' context is EXPECTED in the args
            returnVal = operationFunc.call(context, this.previousCoords, this.latestCoords);
        }
        
        // Update the currentCoords
        // Defend against nulls
        if (coords) {
            this.previousCoords = coords;
        }
        
        return returnVal;
    };
    
    PastAndPresent.prototype.clear = function () {
        this.latestCoords = [0, 0, 0];
        this.previousCoords = [0, 0, 0];
    };
    
    // Frequently used callback function
    PastAndPresent.prototype.getDistance = function (previousCoords, latestCoords) {
        // Get Euclidean distance between this point and the last
        return Vector.distanceBetween(previousCoords, latestCoords);
    };
    
    PastAndPresent.prototype.getDistanceFromLatest = function (otherCoords) {
        return Vector.distanceBetween(this.latestCoords, otherCoords);
    };
    
    return PastAndPresent;
});
