// A RunningStat scaled up for a whole vector (or 1D matrix)
define([
  'kinematics/RunningStat',
  'kinematics/Rounding'
], function(RunningStat, Rounding) {
  
  // Rounding strategy you want applied
  // when calculating overall mean, variance, or stddev
  // at the level of the whole array, all functions still operate in O(1) time
  // but we need for loops to access the RunningStat that is monitoring each array element
  function RunningArrayStat (arraySize, roundingStrategy) {    
    this.roundingStrategy = roundingStrategy || Rounding.strategies.max;
    
    this.rstats = [];
    for (var i = 0; i < arraySize; i++) {
      this.rstats.push(new RunningStat());
    }
  }

  RunningArrayStat.prototype.push = function (vector) {    
    this.rstats.forEach(function (rstat, index, array) {
      var value = vector[index];
      //console.log('val', value);
      // Don't add nulls
      if (value) {
        rstat.push(value);
      }
    });
  };
  
  RunningArrayStat.prototype.mean = function () {
    var that = this;
    return this.rstats.reduce(function (previousValue, currentRstat, index, array) {
      return Rounding.helpers.reduction(previousValue, currentRstat.mean(), that.roundingStrategy);
    }, 0);
  };
  
  RunningArrayStat.prototype.variance = function () {
    var that = this;
    return this.rstats.reduce(function (previousValue, currentRstat, index, array) {
      return Rounding.helpers.reduction(previousValue, currentRstat.variance(), that.roundingStrategy);
    }, 0);
  };
  
  RunningArrayStat.prototype.standardDeviation = function () {
    var that = this;
    return this.rstats.reduce(function (previousValue, currentRstat, index, array){ 
      return Rounding.helpers.reduction(previousValue, currentRstat.standardDeviation(), that.roundingStrategy);
    }, 0);
  };
  
  RunningArrayStat.prototype.clear = function () {
    this.rstats.forEach(function (rstat) {
      rstat.clear();
    });
  };
  
  return RunningArrayStat;
});