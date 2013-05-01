define(function (require) {
    "use strict";
    
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
	
	QUnit.test("getMetric - resets to zero upon clearing", 1, function (assert) {
        speedStat.push([20, 20, 0]);
        speedStat.clear();
                
        assert.equal(speedStat.getMetric(), 0, true);
	});
	
	QUnit.test("getMetric - starts at zero", 1, function (assert) {
        assert.equal(speedStat.getMetric(), 0, true);
	});
  
	QUnit.test("getMetric - add one data point, still zero", 1, function (assert) {
        speedStat.push([20, 20, 0]);
        assert.equal(speedStat.getMetric(), 0, true);
	});
	
});