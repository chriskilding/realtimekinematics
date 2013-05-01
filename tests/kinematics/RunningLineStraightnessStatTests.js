define(function (require) {
    "use strict";
    
	// Import dependencies.
	var straightstatlib = require("src/kinematics/RunningLineStraightnessStat");
	
    var straightStat;
  
	// Define the QUnit module and lifecycle.
	QUnit.module("kinematics/RunningLineStraightnessStat", {
        setup: function () {
            straightStat = new straightstatlib();
        },
        teardown: function () {
            straightStat = null;
        }
	});
	
	QUnit.test("Delta - starts at zero", 1, function (assert) {
        straightStat.push([20, 20, 0]);
        straightStat.clear();
                
        assert.equal(straightStat.delta(), 0, true);
	});
	
	QUnit.test("Delta - resets to zero upon clearing", 1, function (assert) {
        var result = straightStat.delta();
            
        assert.equal(result, 0, true);
	});
  
	QUnit.test("Delta - add one data point, still zero", 1, function (assert) {
        straightStat.push([20, 20, 0]);
        assert.equal(straightStat.delta(), 0, true);
	});
	
	QUnit.test("Delta - add points in perfect line data point, still zero", 1, function (assert) {
        straightStat.push([20, 20, 20]);
        straightStat.push([40, 40, 40]);
        assert.equal(straightStat.delta(), 0, true);
	});
  
});