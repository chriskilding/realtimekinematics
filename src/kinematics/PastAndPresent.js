"use strict";

define([
    "lib/sylvester"
], function (Sylvester) {

    function PastAndPresent() {
        // A reusable 3vec for holding the coords passed into push method;
        // if we create just ONE vector now instead of a new one every time push is called,
        // we will avoid filling up memory with needless throwaway vectors
        this.latestCoords = Sylvester.Vector.Zero(3);
        this.previousCoords = Sylvester.Vector.Zero(3);
    }
    
    
    PastAndPresent.prototype.push = function (coords, operationFunc, context) {
        this.latestCoords.setElements(coords);
        
        var returnVal;
        if (operationFunc) {
            // A 'this' context is EXPECTED      
            returnVal = operationFunc.call(context, this.previousCoords, this.latestCoords);
        }
        
        // Update the currentCoords
        this.previousCoords.setElements(coords);
        
        return returnVal;
    };
    
    PastAndPresent.prototype.clear = function () {
        this.latestCoords.setElements([0, 0, 0]);
        this.previousCoords.setElements([0, 0, 0]);
    };
    
    // Frequently used callback function
    PastAndPresent.prototype.getDistance = function (previousCoords, latestCoords) {
        // Get Euclidean distance between this point and the last
        return previousCoords.distanceFrom(latestCoords);
    };
    
    PastAndPresent.prototype.getDistanceFromLatest = function (otherCoords) {
        return this.latestCoords.distanceFrom(otherCoords);
    };
    
    return PastAndPresent;
});
