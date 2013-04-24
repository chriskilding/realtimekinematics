"use strict";

define([
], function () {

    var distanceSquaredBetween = function (a, b) {
        if (a.length !== b.length) {
            return null;
        }
        
        var distSquared = a.map(function (aElement, index) {
            return Math.pow(aElement - b[index], 2);
        }).reduce(function (c, d) {
            return c + d;
        });
    };
    
    var distanceBetween = function (a, b) {
        var squared = distanceSquaredBetween(a, b);
        
        if (squared) {
            return Math.sqrt(squared);
        } else {
            return null;
        }
    };
    
    function PastAndPresent() {
        // A reusable 3vec for holding the coords passed into push method;
        this.latestCoords = [0, 0, 0];
        this.previousCoords = [0, 0, 0];
    }
    
    
    PastAndPresent.prototype.push = function (coords, operationFunc, context) {
        this.latestCoords = coords;
        
        var returnVal;
        if (operationFunc) {
            // A 'this' context is EXPECTED      
            returnVal = operationFunc.call(context, this.previousCoords, this.latestCoords);
        }
        
        // Update the currentCoords
        this.previousCoords = coords;
        
        return returnVal;
    };
    
    PastAndPresent.prototype.clear = function () {
        this.latestCoords = [0, 0, 0];
        this.previousCoords = [0, 0, 0];
    };
    
    // Frequently used callback function
    PastAndPresent.prototype.getDistance = function (previousCoords, latestCoords) {
        // Get Euclidean distance between this point and the last
        return distanceBetween(previousCoords, latestCoords);
    };
    
    PastAndPresent.prototype.getDistanceFromLatest = function (otherCoords) {
        return distanceBetween(this.latestCoords, otherCoords);
    };
    
    return PastAndPresent;
});
