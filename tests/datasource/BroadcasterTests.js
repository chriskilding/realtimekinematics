"use strict";
define(function (require) {

	// Import depdendencies.
	var Broadcaster = require("mocap/datasource/Broadcaster");
	
    var user = JSON.parse(require("text!mocap/sample-user.json"));
    
    var bcaster;
  
	// Define the QUnit module and lifecycle.
	QUnit.module("datasource/Broadcaster", {
        setup: function () {
            bcaster = new Broadcaster();
            sinon.spy(bcaster.vent.rawData, "dispatch");
            sinon.spy(bcaster.vent.skeleton, "dispatch");
        },
        teardown: function () {
            bcaster.vent.rawData.dispatch.restore(); // For safety
            bcaster.vent.skeleton.dispatch.restore(); // For safety
            bcaster = null;
        }
	});
	
	QUnit.test("broadcastUser - raw data is broadcast", function (assert) {
        bcaster.broadcastUser(user);
        
        var spied = bcaster.vent.rawData.dispatch;
        
        assert.ok(spied.calledOnce, true);
        assert.deepEqual(spied.getCall(0).args[0], user, true);
	});
	
	QUnit.test("broadcastUser - skeleton is broadcast", function (assert) {
        bcaster.broadcastUser(user);
        
        var spied = bcaster.vent.skeleton.dispatch;
        
        assert.ok(spied.calledOnce, true);
        assert.deepEqual(spied.getCall(0).args[0], user.skeleton, true);
    
	});
  
	QUnit.test("broadcastUser - a subscriber gets the raw data", function (assert) {
        var spy = sinon.spy();
        bcaster.vent.rawData.add(spy);
        
        bcaster.broadcastUser(user);
            
        assert.ok(spy.calledOnce, true);
        assert.deepEqual(spy.getCall(0).args[0], user, true);
	});
  
	QUnit.test("broadcastUser - a subscriber gets the skeleton data", function (assert) {
        var spy = sinon.spy();
        bcaster.vent.skeleton.add(spy);
        
        bcaster.broadcastUser(user);
            
        assert.ok(spy.calledOnce, true);
        assert.deepEqual(spy.getCall(0).args[0], user.skeleton, true);
	});
});