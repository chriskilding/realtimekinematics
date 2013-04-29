// Rounding is a collection of helpers for taking
// a bunch of vectors and producing a single vector
// from them, composed of the highest / lowest /
// (insert criteria here) values from each vector.
// It also enumerates the 'rounding' strategies.
define([
], function () {
    "use strict";
    
    var strategies = {
        max: 1,
        min: 2,
        mean: 3,
        median: 4
    };
    
    // Helper function you can use to reduce two values
    // perhaps in a list or array
    var reductionHelper = function (previousValue, currentValue, roundingStrategy) {
        var previousValueIsBigger = previousValue > currentValue;
        var returner = null;
        
        switch (roundingStrategy) {
        case strategies.max:
            (previousValueIsBigger) ? returner = previousValue : returner = currentValue;
            break;
        case strategies.min:
            (previousValueIsBigger) ? returner = currentValue : returner = previousValue;
            break;
        default:
            // Default to max
            returner = reductionHelper(previousValue, currentValue, strategies.max);
        }
        
        return returner;
    };
    
    return {
        strategies: strategies,
        helpers: {
            reduction: reductionHelper
        }
    };
});