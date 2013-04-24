define(function (require) {

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
  
	QUnit.test("reductionHelper - compare zero to zero", function () {             
    var actual = Rounding.helpers.reduction(0, 0, Rounding.strategies.max);
    QUnit.equal(actual, 0, true);    
	});
  
	QUnit.test("reductionHelper - 2 bigger than 1 (1)?", function () {             
    var actual = Rounding.helpers.reduction(1, 2, Rounding.strategies.max);
    QUnit.equal(actual, 2, true);    
	});
	
	QUnit.test("reductionHelper - 2 bigger than 1 (2)?", function () {             
    var actual = Rounding.helpers.reduction(2, 1, Rounding.strategies.max);
    QUnit.equal(actual, 2, true);    
	});
  
	QUnit.test("reductionHelper - 3 smaller than 10 (1)?", function () {             
    var actual = Rounding.helpers.reduction(3, 10, Rounding.strategies.min);
    QUnit.equal(actual, 3, true);    
	});
  
	QUnit.test("reductionHelper - 3 smaller than 10 (2)?", function () {             
    var actual = Rounding.helpers.reduction(10, 3, Rounding.strategies.min);
    QUnit.equal(actual, 3, true);    
	});
  
	QUnit.test("reductionHelper - default to max if no strategy specified", function () {             
    var actual = Rounding.helpers.reduction(1, 2);
    QUnit.equal(actual, 2, true);    
	});
  
	QUnit.test("reductionHelper - null is < 2 (max strategy)", function () {             
    var actual = Rounding.helpers.reduction(null, 2);
    QUnit.equal(actual, 2, true);    
	});
  
	QUnit.test("reductionHelper - 2 is > null (max strategy)", function () {             
    var actual = Rounding.helpers.reduction(2, null);
    QUnit.equal(actual, 2, true);    
	});
  
	QUnit.test("reductionHelper - null is < 2 (min strategy)", function () {             
    var actual = Rounding.helpers.reduction(2, null, Rounding.strategies.min);
    QUnit.equal(actual, null, true);    
	});
  
});