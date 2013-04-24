{
    "baseUrl": "../lib",
    "paths": {
        "mocap": "../mocap"
    },
    "include": ["../tools/almond", "mocap"],
    "exclude": ["js-signals", "underscore", "socketio", "zig"],
    "out": "../dist/mocap.js",
    "wrap": {
        "startFile": "wrap.start",
        "endFile": "wrap.end"
    }
}
