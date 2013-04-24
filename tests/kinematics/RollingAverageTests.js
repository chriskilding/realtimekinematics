define(function (require) {

	// Import depdendencies.
	var rollavg = require("src/kinematics/RollingAverage");
	
  var avg;
  
	// Define the QUnit module and lifecycle.
	QUnit.module("RollingAverage", { 
		setup: function () {
      avg = new rollavg();
		},
		teardown: function () {
      avg = null;
		}
	});
	
	QUnit.test("Constructor - default decay value", function () {             
    QUnit.equal(avg.decay, 0.5, true);    
	});
	
	QUnit.test("Constructor - accepts custom decay value", function () {             
    var customAvg = new rollavg(0.9);
    QUnit.equal(customAvg.decay, 0.9, true);    
	});
});