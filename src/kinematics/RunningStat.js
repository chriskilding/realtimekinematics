"use strict";

// The core of several other modules in this library, RunningStat
// accepts new numerical data through push(), and computes some
// intermediate values in O(1) time that allow it to then compute
// the variance, mean, standard deviation, and total number of
// data points in O(1) time at any point.
//
// This uses an algorithm for accurately computing running variance
// Ported from the C++ version by John D. Cook
// available at http://www.johndcook.com/standard_deviation.html
define([
], function () {

    function RunningStat() {
        this.m_n = 0;
        
        this.m_oldM = 0;
        
        this.m_newM = 0;
        
        this.m_oldS = 0;
        
        this.m_newS = 0;
    }
    
    RunningStat.prototype.clear = function () {
        this.m_n = 0;
    };
    
    RunningStat.prototype.push = function (x) {
        this.m_n++;
        
        // See Knuth TAOCP vol 2, 3rd edition, page 232
        if (this.m_n === 1) {
            this.m_oldM = this.m_newM = x;
            this.m_oldS = 0.0;
        } else {
            this.m_newM = this.m_oldM + (x - this.m_oldM) / this.m_n;
            this.m_newS = this.m_oldS + (x - this.m_oldM) * (x - this.m_newM);
            
            // set up for next iteration
            this.m_oldM = this.m_newM;
            this.m_oldS = this.m_newS;
        }
    };
    
    RunningStat.prototype.numDataValues = function () {
        return this.m_n;
    };
    
    RunningStat.prototype.mean = function () {
        return (this.m_n > 0) ? this.m_newM : 0.0;
    };
    
    RunningStat.prototype.variance = function () {
        return ((this.m_n > 1) ? this.m_newS / (this.m_n - 1) : 0.0);
    };
    
    RunningStat.prototype.standardDeviation = function () {
        return Math.sqrt(this.variance());
    };
    
    return RunningStat;
});