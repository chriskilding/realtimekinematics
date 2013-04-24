"use strict";

// Only looking at JointUpdater's own methods (not its Broadcaster dependencies)
define(function (require) {

    // Import dependencies.
    var JointUpdater = require("mocap/datasource/JointUpdater");
    
    // Fixture
    var user = JSON.parse(require("text!mocap/sample-user.json"));
    
    var jUpdater;
  
	// Define the QUnit module and lifecycle.
	QUnit.module("datasource/JointUpdater", {
		setup: function () {
            // Right hand
            jUpdater = new JointUpdater(15);
            sinon.spy(jUpdater.vent.joint, "dispatch");
		},
		teardown: function () {
            jUpdater.vent.joint.dispatch.restore(); // For safety
            jUpdater = null;
		}
	});
	
	QUnit.test("update - joint data is broadcast", function (assert) {
        jUpdater.update(user.skeleton);
        
        var spied = jUpdater.vent.joint.dispatch;
        
        var expected = {
            position: user.skeleton["15"].position,
            rotation: user.skeleton["15"].rotation
        };
        
        assert.ok(spied.calledOnce, true);
        assert.deepEqual(spied.getCall(0).args[0], expected, true);
        
	});
});