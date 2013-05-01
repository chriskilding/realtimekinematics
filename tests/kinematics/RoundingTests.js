define(function (require) {
    "use strict";
    
	// Import dependencies.
	var Rounding = require("src/kinematics/Rounding");
	  
	// Define the QUnit module and lifecycle.
	QUnit.module("kinematics/Rounding", {
		setup: function () {
		},
		teardown: function () {
		}
	});
	
  // -------------------
  
	QUnit.test("reductionHelper - compare zero to zero", 1, function (assert) {
        var actual = Rounding.helpers.reduction(0, 0, Rounding.strategies.max);
        assert.equal(actual, 0, true);
	});
  
	QUnit.test("reductionHelper - 2 bigger than 1 (1)?", 1, function (assert) {
        var actual = Rounding.helpers.reduction(1, 2, Rounding.strategies.max);
        assert.equal(actual, 2, true);
	});
	
	QUnit.test("reductionHelper - 2 bigger than 1 (2)?", 1, function (assert) {
        var actual = Rounding.helpers.reduction(2, 1, Rounding.strategies.max);
        assert.equal(actual, 2, true);
	});
  
	QUnit.test("reductionHelper - 3 smaller than 10 (1)?", 1, function (assert) {
        var actual = Rounding.helpers.reduction(3, 10, Rounding.strategies.min);
        assert.equal(actual, 3, true);
	});
  
	QUnit.test("reductionHelper - 3 smaller than 10 (2)?", 1, function (assert) {
        var actual = Rounding.helpers.reduction(10, 3, Rounding.strategies.min);
        assert.equal(actual, 3, true);
	});
  
	QUnit.test("reductionHelper - default to max if no strategy specified", 1, function (assert) {
        var actual = Rounding.helpers.reduction(1, 2);
        assert.equal(actual, 2, true);
	});
  
	QUnit.test("reductionHelper - null is < 2 (max strategy)", 1, function (assert) {
        var actual = Rounding.helpers.reduction(null, 2);
        assert.equal(actual, 2, true);
	});
  
	QUnit.test("reductionHelper - 2 is > null (max strategy)", 1, function (assert) {
        var actual = Rounding.helpers.reduction(2, null);
        assert.equal(actual, 2, true);
	});
  
	QUnit.test("reductionHelper - null is < 2 (min strategy)", 1, function (assert) {
        var actual = Rounding.helpers.reduction(2, null, Rounding.strategies.min);
        assert.equal(actual, null, true);
	});
  
});