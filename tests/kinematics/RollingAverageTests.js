define(function (require) {
    "use strict";
    
	// Import dependencies.
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
	
	QUnit.test("Constructor - default decay value", 1, function (assert) {
        assert.equal(avg.decay, 0.5, true);
	});
	
	QUnit.test("Constructor - accepts custom decay value", 1, function (assert) {
        var customAvg = new rollavg(0.9);
        assert.equal(customAvg.decay, 0.9, true);
	});
});