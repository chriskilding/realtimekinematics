/*global require, define, test, expect, strictEqual, location */
"use strict";
    
var shim = {
    // At this time (Oct 2012) Underscore is not AMD compatible
    "underscore": {
        deps: [],
        exports: "_"
    },
    "zig": {
        deps: [],
        exports: "zig"  //attaches "zig" to the window object
    },
    "socketio": {
        deps: [],
        exports: "io"
    }
};

/*var paths = {
zig: '../lib/zig',
socketio: '../lib/socketio',
underscore: '../lib/underscore',
"js-signals": '../lib/js-signals',
text: '../lib/text'
};*/

// Defer Qunit so RequireJS can work its magic
// and resolve all modules.
QUnit.config.autostart = false;

// Configure RequireJS so it resolves relative module paths
require.config({
    baseUrl: '../lib',
    shim: shim,
    paths: {
        "mocap": "../mocap"
    }
});
//Override if in "dist" mode
if (location.href.indexOf('-dist') !== -1) {
    //Set location of mocap to the dist location
    require.config({
        paths: {
            'mocap': '../dist/mocap'
        }
    });
}

// A list of all QUnit test Modules.  Make sure you include the `.js` 
// extension so RequireJS resolves them as relative paths rather than using
// the `baseUrl` value supplied above.
var testModules = [
    "datasource/BroadcasterTests.js",
    "datasource/JointUpdaterTests.js",
    "datasource/JointUpdaterDepTests.js"
];

// Resolve all testModules and then start the Test Runner.
require(testModules, QUnit.start);
