define(function (require) {
    "use strict";
    
	// Import dependencies.
	var rstat = require("src/kinematics/RunningArrayStat");
	
    var runningArrayStat;
  
	// Define the QUnit module and lifecycle.
	QUnit.module("kinematics/RunningArrayStat", {
        setup: function () {
            // For the sake of argument, have a size of three
            runningArrayStat = new rstat(3);
        },
        teardown: function () {
            runningArrayStat = null;
        }
	});
	
    // -------------------
  
	QUnit.test("Mean - starts at zero", 1, function (assert) {
        assert.equal(runningArrayStat.mean(), 0, true);
	});
	
	QUnit.test("Mean - add one data point, equals that point", 1, function (assert) {
        runningArrayStat.push([20, 20, 20]);
        assert.equal(runningArrayStat.mean(), 20, true);
	});
	
	QUnit.test("Mean - add two data points, equals halfway between them", 1, function (assert) {
        var point1 = [20, 20, 20];
        var point2 = [40, 40, 40];
        var expectedAvg = 30;
        
        runningArrayStat.push(point1);
        runningArrayStat.push(point2);
        assert.equal(runningArrayStat.mean(), expectedAvg, true);
	});

	QUnit.test("Mean - clear all data sends it back to zero", 1, function (assert) {
        runningArrayStat.push([20, 20, 20]);
        runningArrayStat.clear();
        
        assert.equal(runningArrayStat.mean(), 0, true);
	});

    // ----------------------
  
	QUnit.test("Variance - starts at zero", 1, function (assert) {
        assert.equal(runningArrayStat.variance(), 0, true);
	});
	
	QUnit.test("Variance - add one data point, equals zero", 1, function (assert) {
        runningArrayStat.push([20, 20, 20]);
        assert.equal(runningArrayStat.variance(), 0, true);
	});
  
	QUnit.test("Variance - add identical data points, still equals zero", 1, function (assert) {
        runningArrayStat.push([20, 20, 20]);
        runningArrayStat.push([20, 20, 20]);
        
        assert.equal(runningArrayStat.variance(), 0, true);
	});
  
	QUnit.test("Variance - add data points different by 1, equals 0.5", 1, function (assert) {
        runningArrayStat.push([20, 20, 20]);
        runningArrayStat.push([21, 21, 21]);
        
        // Variance = how far the numbers lie from the mean
        // the mean of 20 and 21 will be 20.5
        // therefore 20 and 21 are both 0.5 away from that
        
        assert.equal(runningArrayStat.variance(), 0.5, true);
	});
  
	QUnit.test("Variance - clear all data sends it back to zero", 1, function (assert) {
        runningArrayStat.push([20, 20, 20]);
        runningArrayStat.clear();
        
        assert.equal(runningArrayStat.variance(), 0, true);
	});
  
  // TODO now test with arrays containing 3 different values
  // TODO test with different rounding strategies
});