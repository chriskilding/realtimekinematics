{
    "baseUrl": "../lib",
    "paths": {
        "runningkinematics": "../runningkinematics"
    },
    "include": ["../tools/almond", "runningkinematics"],
    "exclude": ["sylvester", "mocap"],
    "out": "../dist/realtimekinematics.js",
    "wrap": {
        "startFile": "wrap.start",
        "endFile": "wrap.end"
    }
}
