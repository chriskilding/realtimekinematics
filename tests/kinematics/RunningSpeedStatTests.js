define(function (require) {

	// Import dependencies.
	var speedstatlib = require("src/kinematics/RunningSpeedStat");
	
  var speedStat;
  
	// Define the QUnit module and lifecycle.
	QUnit.module("kinematics/RunningSpeedStat", { 
		setup: function () {
      speedStat = new speedstatlib();
		},
		teardown: function () {
      speedStat = null;
		}
	});
	
	QUnit.test("getMetric - resets to zero upon clearing", function () {     
        speedStat.push([20, 20, 0]);
        speedStat.clear();
                
        QUnit.equal(speedStat.getMetric(), 0, true);    
	});
	
	QUnit.test("getMetric - starts at zero", function () {             
        QUnit.equal(speedStat.getMetric(), 0, true);    
	});
  
	QUnit.test("getMetric - add one data point, still zero", function () { 
        speedStat.push([20, 20, 0]);
        QUnit.equal(speedStat.getMetric(), 0, true);  
	});
	
});