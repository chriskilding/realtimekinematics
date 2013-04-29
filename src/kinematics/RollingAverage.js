// Computes an Exponentially Weighted Moving Average
// every time it is updated, with a customizable decay value.
define([
], function () {
    "use strict";

    function RollingAverage(decay) {
        // The decay factor (between 0 and 1)
        this.decay = decay || 0.5;
        this.oldValue = null;
    }
    
    RollingAverage.prototype.clear = function () {
        this.oldValue = null;
    };
    
    RollingAverage.prototype.push = function (value) {
        if (!this.oldValue) {
            this.oldValue = value;
            return value;
        }
        var newValue = this.oldValue + this.decay * (value - this.oldValue);
        this.oldValue = newValue;
        return newValue;
    };
    
    return RollingAverage;
});