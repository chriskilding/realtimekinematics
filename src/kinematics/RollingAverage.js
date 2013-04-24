define([
], function(){
  
  function RollingAverage(decay) {    
    // The decay factor (between 0 and 1)
    this.decay = decay || 0.5;
    this.oldValue = null;
  }
  
  RollingAverage.prototype.clear = function() {
    this.oldValue = null;
  };
  
  RollingAverage.prototype.push = function(value) {    
    if (this.oldValue == null) {
        this.oldValue = value;
        return value;
    }
    var newValue = this.oldValue + this.decay * (value - this.oldValue);
    this.oldValue = newValue;
    return newValue;
  };

  return RollingAverage;
});