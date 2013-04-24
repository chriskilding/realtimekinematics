// Enumerates the rounding strategies
// could be used in RunningArrayStat
define([
], function() {
  var strategies = {
    max: 1,
    min: 2,
    mean: 3,
    median: 4
  };
  
  // Helper function you can use to reduce two values
  // perhaps in a list or array
  var reductionHelper = function (previousValue, currentValue, roundingStrategy) {
    //console.log('prev', previousValue, 'cur', currentValue);
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
        // Defualt to max
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