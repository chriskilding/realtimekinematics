define(function (require) {

	// Import depdendencies.
	var pnpLib = require("./PastAndPresent");
	
  var pnp;
  
	// Define the QUnit module and lifecycle.
	QUnit.module("kinematics/PastAndPresent", { 
		setup: function () {
      pnp = new pnpLib();
		},
		teardown: function () {
      pnp = null;
		}
	});
	
	QUnit.test("PastAndPresent - can clear even with no data points", function () {     
    try {
      pnp.clear();
      QUnit.ok(true, "passed");
    } catch(e) {
      QUnit.ok(false, "an exception was thrown: " + e);
    }  
	});
	
	QUnit.test("PastAndPresent - no callback passed means nothing returned", function () {     
    var returner = pnp.push([0, 0, 0]);
    
    QUnit.equal(returner, null, true);  
    
	});
  
});