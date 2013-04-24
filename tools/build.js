{
    "baseUrl": "../",
    "paths": {
        "runningkinematics": "runningkinematics"
    },
    "include": ["tools/almond", "runningkinematics"],
    "exclude": ["lib/sylvester"],
    "out": "../dist/realtimekinematics.js",
    "wrap": {
        "startFile": "wrap.start",
        "endFile": "wrap.end"
    }
}
