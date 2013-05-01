define(function (require) {
    "use strict";
    
	// Import dependencies.
	var pnpLib = require("src/kinematics/PastAndPresent");
	
    var pnp;
  
	// Define the QUnit module and lifecycle.
	QUnit.module("PastAndPresent", {
        setup: function () {
            pnp = new pnpLib();
        },
        teardown: function () {
            pnp = null;
        }
	});
	
	QUnit.test("PastAndPresent - can clear even with no data points", 1, function (assert) {
        try {
            pnp.clear();
            assert.ok(true, "passed");
        } catch (e) {
            assert.ok(false, "an exception was thrown: " + e);
        }
	});
	
	QUnit.test("PastAndPresent - no callback passed means nothing returned", 1, function (assert) {
        var returner = pnp.push([0, 0, 0]);
        
        assert.equal(returner, null, true);
	});
  
});