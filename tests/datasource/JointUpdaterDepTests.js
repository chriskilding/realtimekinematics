"use strict";

define(function (require) {

	// Import depdendencies.
	var JointUpdater = require("mocap/datasource/JointUpdater");
	
    // Fixture
    var user = JSON.parse(require("text!mocap/sample-user.json"));
    
    // PRETEND Broadcaster (we'll keep this around across tests)
    // skips out testing the event system
    // spies on the event 'add' functions
    var bcaster = {
        vent: {
            rawData: {},
            skeleton: {
                add: sinon.spy()
            }
        }
    };
  
	// Define the QUnit module and lifecycle.
	QUnit.module("datasource/JointUpdater", {
		setup: function () {
      
		},
		teardown: function () {

		}
	});
	
	QUnit.test("broadcaster mock - joint updater attaches itself to broadcaster", function (assert) {
        // Right hand
        var jUpdater = new JointUpdater(15, bcaster);
        
        var spied = bcaster.vent.skeleton.add;
        
        assert.ok(spied.calledOnce, true);
        assert.deepEqual(spied.getCall(0).args[0], jUpdater.update, true);
	});
});