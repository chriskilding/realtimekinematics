// Copyright © 2013 Christopher Kilding

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD.
        define([], factory);
    } else {
        // Browser globals
        root.realtimekinematics = factory();
    }
}(this, function () {



/**
 * almond 0.1.2 Copyright (c) 2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var defined = {},
        waiting = {},
        config = {},
        defining = {},
        aps = [].slice,
        main, req;

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {},
            nameParts, nameSegment, mapValue, foundMap,
            foundI, foundStarMap, starI, i, j, part;

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);

                name = baseParts.concat(name.split("/"));

                //start trimDots
                for (i = 0; (part = name[i]); i++) {
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            return true;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (waiting.hasOwnProperty(name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!defined.hasOwnProperty(name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    function makeMap(name, relName) {
        var prefix, plugin,
            index = name.indexOf('!');

        if (index !== -1) {
            prefix = normalize(name.slice(0, index), relName);
            name = name.slice(index + 1);
            plugin = callDep(prefix);

            //Normalize according
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            p: plugin
        };
    }

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    main = function (name, deps, callback, relName) {
        var args = [],
            usingExports,
            cjsModule, depName, ret, map, i;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (typeof callback === 'function') {

            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i++) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = makeRequire(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = defined[name] = {};
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = {
                        id: name,
                        uri: '',
                        exports: defined[name],
                        config: makeConfig(name)
                    };
                } else if (defined.hasOwnProperty(depName) || waiting.hasOwnProperty(depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else if (!defining[depName]) {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback.apply(defined[name], args);

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                    cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync) {
        if (typeof deps === "string") {
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 15);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        config = cfg;
        return req;
    };

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        waiting[name] = [name, deps, callback];
    };

    define.amd = {
        jQuery: true
    };
}());

define("tools/almond", function(){});

define('src/util/Vector',[
], function () {
    
    
    var distanceSquaredBetween = function (a, b) {
        if (a.length === b.length) {
            return a.map(function (aElement, index) {
                return Math.pow(aElement - b[index], 2);
            }).reduce(function (c, d) {
                return c + d;
            });
        }
    };
    
    var distanceBetween = function (a, b) {
        var squared = distanceSquaredBetween(a, b);
        
        if (squared) {
            return Math.sqrt(squared);
        }
    };
    
    var dot = function (a, b) {
        if (a.length === b.length) {
            return a.map(function (aElem, index) {
                return aElem * b[index];
            }).reduce(function (c, d) {
                return c + d;
            });
        }
    };
    
    var dup = function (vec) {
        return vec.map(function (val) {
            return val;
        });
    };

    var modulus = function (vec) {
        return Math.sqrt(dot(vec));
    };
    
    var toUnitVector = function (vec) {
        var r = modulus(vec);
        
        if (r === 0) {
            return dup(vec);
        }
        
        return vec.map(function (x) {
            return x / r;
        });
    };
    
    var angleBetween = function (a, b) {
        // See http://chortle.ccsu.edu/vectorlessons/vch10/vch10_5.html
        // We are dealing with non-unit vectors so...
        // (1) normalize each vector
        var normA = toUnitVector(a);
        var normB = toUnitVector(b);
        
        // (2) compute the dot product
        var product = dot(normA, normB);
        
        // (3) take the arc cos to get the angle.
        return Math.acos(product);
    };
    
    return {
        distanceBetween: distanceBetween,
        distanceSquaredBetween: distanceSquaredBetween,
        dot: dot,
        dup: dup,
        modulus: modulus,
        angleBetween: angleBetween
    };
});
// Useful when measuring inter-frame deltas, a PastAndPresent
// instance holds a continuously updated reference to the
// vector from the frame before, so that when new data rolls
// in, a specified callback function can be used to compare
// the two values in the manner of your choice. After the
// callback executes, the latest vector becomes the previous
// vector.
define('src/kinematics/PastAndPresent',[
    "src/util/Vector"
], function (Vector) {
    
    
    function PastAndPresent() {
        // A reusable 3vec for holding the coords passed into push method;
        this.latestCoords = [0, 0, 0];
        this.previousCoords = [0, 0, 0];
    }
    
    
    PastAndPresent.prototype.push = function (coords, operationFunc, context) {
        this.latestCoords = coords;
        
        var returnVal;
        if (operationFunc) {
            // A 'this' context is EXPECTED in the args
            returnVal = operationFunc.call(context, this.previousCoords, this.latestCoords);
        }
        
        // Update the currentCoords
        // Defend against nulls
        if (coords) {
            this.previousCoords = coords;
        }
        
        return returnVal;
    };
    
    PastAndPresent.prototype.clear = function () {
        this.latestCoords = [0, 0, 0];
        this.previousCoords = [0, 0, 0];
    };
    
    // Frequently used callback function
    PastAndPresent.prototype.getDistance = function (previousCoords, latestCoords) {
        // Get Euclidean distance between this point and the last
        return Vector.distanceBetween(previousCoords, latestCoords);
    };
    
    PastAndPresent.prototype.getDistanceFromLatest = function (otherCoords) {
        return Vector.distanceBetween(this.latestCoords, otherCoords);
    };
    
    return PastAndPresent;
});

// Computes an Exponentially Weighted Moving Average
// every time it is updated, with a customizable decay value.
define('src/kinematics/RollingAverage',[
], function () {
    

    function RollingAverage(decay) {
        // The decay factor (between 0 and 1)
        this.decay = decay || 0.5;
        this.oldValue = null;
    }
    
    RollingAverage.prototype.clear = function () {
        this.oldValue = null;
    };
    
    RollingAverage.prototype.push = function (value) {
        if (!this.oldValue) {
            this.oldValue = value;
            return value;
        }
        var newValue = this.oldValue + this.decay * (value - this.oldValue);
        this.oldValue = newValue;
        return newValue;
    };
    
    return RollingAverage;
});
// Rounding is a collection of helpers for taking
// a bunch of vectors and producing a single vector
// from them, composed of the highest / lowest /
// (insert criteria here) values from each vector.
// It also enumerates the 'rounding' strategies.
define('src/kinematics/Rounding',[
], function () {
    
    
    var strategies = {
        max: 1,
        min: 2,
        mean: 3,
        median: 4
    };
    
    // Helper function you can use to reduce two values
    // perhaps in a list or array
    var reductionHelper = function (previousValue, currentValue, roundingStrategy) {
        var previousValueIsBigger = previousValue > currentValue;
        var returner = null;
        
        switch (roundingStrategy) {
        case strategies.max:
            (previousValueIsBigger) ? returner = previousValue : returner = currentValue;
            break;
        case strategies.min:
            (previousValueIsBigger) ? returner = currentValue : returner = previousValue;
            break;
        default:
            // Default to max
            returner = reductionHelper(previousValue, currentValue, strategies.max);
        }
        
        return returner;
    };
    
    return {
        strategies: strategies,
        helpers: {
            reduction: reductionHelper
        }
    };
});
// The core of several other modules in this library, RunningStat
// accepts new numerical data through push(), and computes some
// intermediate values in O(1) time that allow it to then compute
// the variance, mean, standard deviation, and total number of
// data points in O(1) time at any point.
//
// This uses an algorithm for accurately computing running variance
// Ported from the C++ version by John D. Cook
// available at http://www.johndcook.com/standard_deviation.html
define('src/kinematics/RunningStat',[
], function () {
    

    function RunningStat() {
        this.m_n = 0;
        
        this.m_oldM = 0;
        
        this.m_newM = 0;
        
        this.m_oldS = 0;
        
        this.m_newS = 0;
    }
    
    RunningStat.prototype.clear = function () {
        this.m_n = 0;
    };
    
    RunningStat.prototype.push = function (x) {
        this.m_n++;
        
        // See Knuth TAOCP vol 2, 3rd edition, page 232
        if (this.m_n === 1) {
            this.m_oldM = this.m_newM = x;
            this.m_oldS = 0.0;
        } else {
            this.m_newM = this.m_oldM + (x - this.m_oldM) / this.m_n;
            this.m_newS = this.m_oldS + (x - this.m_oldM) * (x - this.m_newM);
            
            // set up for next iteration
            this.m_oldM = this.m_newM;
            this.m_oldS = this.m_newS;
        }
    };
    
    RunningStat.prototype.numDataValues = function () {
        return this.m_n;
    };
    
    RunningStat.prototype.mean = function () {
        return (this.m_n > 0) ? this.m_newM : 0.0;
    };
    
    RunningStat.prototype.variance = function () {
        return ((this.m_n > 1) ? this.m_newS / (this.m_n - 1) : 0.0);
    };
    
    RunningStat.prototype.standardDeviation = function () {
        return Math.sqrt(this.variance());
    };
    
    return RunningStat;
});
// Performs inter-frame analysis of the positions
// of vectors to determine the straight-line distance
// which the object has travelled during the time
// window between the frames, and computes its speed
// from this.
define('src/kinematics/RunningSpeedStat',[
    'src/kinematics/RunningStat',
    'src/kinematics/PastAndPresent'
], function (RunningStat, PastAndPresent) {
    
  
    function RunningSpeedStat() {
        this.pnp = new PastAndPresent();
        this.runningStat = new RunningStat();
    }
    
    RunningSpeedStat.prototype.push = function (coords) {
        // Get Euclidean distance between this point and the last
        // (If this is the first point, distance will be zero)
        var distance = this.pnp.push(coords, this.pnp.getDistance, this);
        
        // and then add it to the running stat
        this.runningStat.push(distance);
        return distance;
    };
    
    RunningSpeedStat.prototype.getMetric = function () {
        return this.runningStat.variance();
    };
    
    RunningSpeedStat.prototype.clear = function () {
        this.pnp.clear();
        // and reset the RunningStat
        this.runningStat.clear();
    };
    
    return RunningSpeedStat;
});
// A metric for the Newtonian acceleration of a movement
define('src/kinematics/RunningAccelerationStat',[
    'src/kinematics/RunningStat',
    'src/kinematics/RunningSpeedStat',
    'src/kinematics/PastAndPresent'
], function (RunningStat, RunningSpeedStat, PastAndPresent) {
    

    // We look at the 'difference of differences'
    // as described in http://research.microsoft.com/pubs/172555/KinectGaitEMBC2012.pdf
    // to gain a rudimentary notion of acceleration
    function RunningAccelerationStat() {
        this.runningStat = new RunningStat();
        this.speedStat = new RunningSpeedStat();
        
        // A measure of the 'start' velocity
        this.previousVelocity = 0;
    }
    
    RunningAccelerationStat.prototype.push = function (coords) {
        // An estimate of the 'latest' velocity
        var endVelocity = this.speedStat.push(coords);
        
        // acceleration = difference between previous velocity and this one
        // since data arrives in pretty regular intervals (30Hz)
        // can ignore dividing by time taken
        // don't take Math.abs as accn can be negative
        // a = (v - u) / t
        var acceleration = endVelocity - this.previousVelocity;
        
        this.runningStat.push(acceleration);
    };
    
    RunningAccelerationStat.prototype.getMetric = function () {
        // High avg acceleration may suggest stronger movement
        return this.runningStat.mean();
    };
    
    RunningAccelerationStat.prototype.clear = function () {
        this.speedStat.clear();
        this.runningStat.clear();
        this.previousVelocity = 0;
    };
    
    return RunningAccelerationStat;
});
// A RunningArrayStat performs the same function
// as a RunningStat, but can accept whole vectors
// rather than just individual numerical values.
define('src/kinematics/RunningArrayStat',[
    'src/kinematics/RunningStat',
    'src/kinematics/Rounding'
], function (RunningStat, Rounding) {
    

    // Rounding strategy you want applied
    // when calculating overall mean, variance, or stddev
    // at the level of the whole array, all functions still operate in O(1) time
    // but we need for loops to access the RunningStat that is monitoring each array element
    function RunningArrayStat(arraySize, roundingStrategy) {
        this.roundingStrategy = roundingStrategy || Rounding.strategies.max;
        
        this.rstats = [];
        var i;
        for (i = 0; i < arraySize; i++) {
            this.rstats.push(new RunningStat());
        }
    }
    
    RunningArrayStat.prototype.push = function (vector) {
        this.rstats.forEach(function (rstat, index, array) {
            var value = vector[index];

            // Don't add nulls
            if (value) {
                rstat.push(value);
            }
        });
    };
    
    RunningArrayStat.prototype.mean = function () {
        var that = this;
        return this.rstats.reduce(function (previousValue, currentRstat, index, array) {
            return Rounding.helpers.reduction(previousValue, currentRstat.mean(), that.roundingStrategy);
        }, 0);
    };
    
    RunningArrayStat.prototype.variance = function () {
        var that = this;
        return this.rstats.reduce(function (previousValue, currentRstat, index, array) {
            return Rounding.helpers.reduction(previousValue, currentRstat.variance(), that.roundingStrategy);
        }, 0);
    };
    
    RunningArrayStat.prototype.standardDeviation = function () {
        var that = this;
        return this.rstats.reduce(function (previousValue, currentRstat, index, array) {
            return Rounding.helpers.reduction(previousValue, currentRstat.standardDeviation(), that.roundingStrategy);
        }, 0);
    };
    
    RunningArrayStat.prototype.clear = function () {
        this.rstats.forEach(function (rstat) {
            rstat.clear();
        });
    };
    
    return RunningArrayStat;
});
// Monitors freeness or boundness for a 'system' of joints
// e.g. hand, wrist, elbow, shoulder
define('src/kinematics/RunningFreenessStat',[
    'src/kinematics/RunningArrayStat',
    'src/kinematics/Rounding',
    "src/util/Vector"
], function (RunningArrayStat, Rounding, Vector) {
    
    
    // pass in an array of the associated Joint pairs you'll track
    // for a hand that would be:
    // [
    //   [ Joints.RightShoulder, Joints.RightElbow ],
    //   [ Joints.RightElbow, Joints.RightWrist ],
    //   [ Joints.RightWrist, Joints.RightHand ]
    // ]
    function RunningFreenessStat(jointPairs) {
        this.jointPairs = jointPairs || [];
        // Need as many running stats as we do joints tracked
        this.rstat = new RunningArrayStat(this.jointPairs.length);
        
        this.vecA = [0, 0, 0];
        this.vecB = [0, 0, 0];
    }
    
    // Needs WHOLE skeleton
    RunningFreenessStat.prototype.push = function (skeleton) {
        // We will get the ROTATION values for every point;
        // position may change as the whole 'joint system' moves through space,
        // but rotation of each joint will stay same/similar if movement is bound
        var that = this;
        var anglesArray = this.jointPairs.map(function (pair) {
            // Which joint IDs are we talking about
            // Get the corresponding data off the skeleton
            var firstJoint = {};
            firstJoint.id = pair[0];
            firstJoint.data = skeleton[firstJoint.id];
            
            var secondJoint = {};
            secondJoint.id = pair[1];
            secondJoint.data = skeleton[secondJoint.id];
            
            // Safety
            var angle = null;
            
            if (firstJoint.data && secondJoint.data) {
                that.vecA = firstJoint.data.position;
                that.vecB = secondJoint.data.position;
                
                try {
                    angle = Vector.angleBetween(that.vecA, that.vecB);
                } catch (e) {
                }
            }
            
            return angle;
        });
    
        // Now push it into the corresponding RunningFreenessStat 
        // position may change as the whole 'joint system' moves through space,
        // but angle between each joint pair will stay same/similar if movement is bound
        //console.log('anglesArray', anglesArray);
        that.rstat.push(anglesArray);
        
        return this.getValue();
    };
    
    RunningFreenessStat.prototype.getValue = function () {
        // use variance for now
        return this.rstat.variance();
    };
    
    RunningFreenessStat.prototype.clear = function () {
        this.rstat.clear();
        // vecA and vecB don't need to be cleared
        // they get overwritten before use anyway
    };
    
    return RunningFreenessStat;
});

// From http://oldhorse.hubpages.com/hub/drawing-calculus-numberical-integration-and-differentiation-in-javascript-part-6-in-a-series
define('src/kinematics/NumericalDifferentiator',[
], function () {
    
 
    function Point() {
        //this.prototype = pointbase;
        this.x = 0;
        this.y = 0;
    }
    
    function circle(angle) {
        var rval = new Point();
        
        rval.x = Math.cos(angle);
        rval.y = Math.sin(angle);
        return (rval);
    }
    
    function cos1overx2(x) {
        var rval = new Point();
        
        rval.x = x;
        rval.y = Math.cos(1 / (x * x));
        return rval;
    }
    
    // the function that creates derivative functions
    // fn = the function to compute the derivative of
    function ptdiff(fn, x, delta) {
        var rval = new Point();
        
        rval.x = x;
        rval.y = -(fn(x).y - fn(x + delta).y) / (delta);
        //bit of a hack to keep the integration function from reseting
        return (rval);
    }
    
    function diff(fn, delta) {
        var rval = function (x) {
            return ptdiff(fn, x, delta);
        };
        
        return rval;
    }
    
    // The function that returns differential
    function ptint(fn, x, delta) {
        var rval = new Point();
        
        rval.x = x;
        rval.y = fn(x - delta).y * delta;
        return (rval);
    }
    
    function int(fn, delta) {
        var sum = 0;
        var lastx = 1000;
        
        var rval = function (x) {
            if (x < lastx) {
                // assume new integral, reset
                sum = 0;
            } else {
                delta = x - lastx;
            }
            var pt = ptint(fn, x, delta);
            sum += pt.y;
            pt.y = sum;
            lastx = x;
            
            return (pt);
        };
        
        return rval;
    }
    
    // Definition of a func that can be differentiated or integrated
    // From here you can do
    // x2diff = diff( xsquared, 0.01 ); to differentiate
    // x2int = int( xsquared, 0.1 ); to integrate
    function xsquared(x) {
        var rval = new Point();
        
        rval.x = x;
        rval.y = x * x;
        return (rval);
    }
    
    return {
        point: Point,
        differentiate: diff,
        integrate: int
    };
});
// A metric for the force (weight or strength) of a movement
// NOTE: THIS DOES NOT YET WORK PROPERLY
define('src/kinematics/RunningImpactStat',[
    'src/kinematics/RunningStat',
    'src/kinematics/NumericalDifferentiator',
    'src/kinematics/PastAndPresent'
], function (RunningStat, NumericalDifferentiator, PastAndPresent) {
    

    // Rate at which velocity changes with time
    // is dv/dt as delta t approaches 0
    // (First derivative in terms of velocity)
    // http://phys23p.sl.psu.edu/syll/p211/lecture_notes_2012/p211c02_print.pdf
    function InstantaneousAccWithVelocity(v, t) {
        var rval = new NumericalDifferentiator.point();
        
        rval.x = v;
        rval.y = v / t;
        return (rval);
    }
    
    
    function RunningImpactStat() {
        this.runningStat = new RunningStat();
        this.pnp = new PastAndPresent();
    }
    
    RunningImpactStat.prototype.push = function (coords) {
        this.pnp.push(coords, this.pnpCallback, this);
    };
    
    RunningImpactStat.prototype.pnpCallback = function (previousCoords, latestCoords) {
        // Get Euclidean distance between this point and the last (could be 0)
        var distance = this.pnp.getDistance();
        
        // TODO find an equation for getting the instantaneous acceleration
        var acceleration = 0.0;
        
        // Because in Newtonian mechanics, force = mass * acceleration
        // as we are pretending that we are tracking a point mass
        // and the sampling frequency is high enough to make the movement linear
        // (between the start + end points in the time window)
        // we can just assign an arbitrary mass of 1kg
        // so the equation becomes force = 1 * acceleration
        // which cancels to force = acceleration
        this.runningStat.push(acceleration);
    };
    
    RunningImpactStat.prototype.clear = function () {
        this.pnp.clear();
        // and reset the RunningStat
        this.runningStat.clear();
    };
    
    return RunningImpactStat;
});
define('src/kinematics/RunningLineStraightnessStat',[
    'src/kinematics/PastAndPresent',
    "src/util/Vector"
], function (PastAndPresent, Vector) {
    

    /*
    * One way to get straightness of the line:
    * the "straightness" of a line, interpreted as the property that it minimizes distances between its points
    * 1. the displacement of line from start point to current end point = expected
    * 2. add up the euc. distances between each actual point = actual
    * 3. if displacement = distance, difference = 0, line totally straight / direct
    * 4. if actual is shorter or longer there will be a +ve or -ve delta
    */
    function RunningLineStraightnessStat() {
        this.cumulativeActualDistance = 0.0;
        this.startCoords = null;
        
        this.pnp = new PastAndPresent();
    }
    
    RunningLineStraightnessStat.prototype.push = function (coords) {
        this.pnp.push(coords, this.pnpCallback, this);
    };
    
    RunningLineStraightnessStat.prototype.pnpCallback = function (previousCoords, latestCoords) {
        if (this.startCoords) {
            // Get Euclidean distance between this point and the last
            try {
                var distance = this.pnp.getDistance(previousCoords, latestCoords);
                this.cumulativeActualDistance += distance;
            } catch (e) {
            }
        // Defend against nulls
        } else if (latestCoords) {
            // No history yet - set the latestCoords to be the startCoords
            // Delta is zero anyway so no change to cumulativeActualDistance
            // Duplicate the array by value to ensure no funny business
            this.startCoords = Vector.dup(latestCoords);
        }
    };
    
    // The "straightness" of the recorded line.
    // If total distance = displacement, it's perfectly straight.
    // If there is a difference, it's indirect.
    RunningLineStraightnessStat.prototype.delta = function () {
        // If no history yet the delta will be zero
        var delta = 0.0;
        
        if (this.startCoords) {
            var displacement = this.pnp.getDistanceFromLatest(this.startCoords);

            // The euc. distances between each actual point added together = actual
            // Guard against nulls
            if (displacement && this.cumulativeActualDistance) {
                delta = Math.abs(displacement - this.cumulativeActualDistance);
            }
        }
        
        return delta;
    };
    
    RunningLineStraightnessStat.prototype.clear = function () {
        this.cumulativeActualDistance = 0.0;
        this.startCoords = null;
        this.pnp.clear();
    };
    
    return RunningLineStraightnessStat;
});
// Monitors how much an object is moving over
// time using an EWMA. Lower values indicate
// the object is relatively stationary; higher
// values indicate it is less stable.
define('src/kinematics/RunningSteadinessStat',[
    'src/kinematics/PastAndPresent',
    'src/kinematics/RollingAverage'
], function (PastAndPresent, RollingAverage) {
    

    function RunningSteadinessStat() {
        this.pnp = new PastAndPresent();
        this.avg = new RollingAverage(0.9);
    }
    
    RunningSteadinessStat.prototype.push = function (coords) {
        // Get Euclidean distance between this point and the last
        // (If this is the first point, distance will be zero)
        var distance = this.pnp.push(coords, this.pnp.getDistance, this);
        
        // and then add it to the running stat
        var latestValue = this.avg.push(distance);
        
        return latestValue;
    };
    
    RunningSteadinessStat.prototype.clear = function () {
        this.pnp.clear();
        this.avg.clear();
    };
    
    return RunningSteadinessStat;
});
/*global define */

// The main module that defines the public interface for this library.
define('runningkinematics',['require','src/kinematics/PastAndPresent','src/kinematics/RollingAverage','src/kinematics/Rounding','src/kinematics/RunningAccelerationStat','src/kinematics/RunningArrayStat','src/kinematics/RunningFreenessStat','src/kinematics/RunningImpactStat','src/kinematics/RunningLineStraightnessStat','src/kinematics/RunningSpeedStat','src/kinematics/RunningStat','src/kinematics/RunningSteadinessStat'],function (require) {
    

    //Return the module value.
    return {
        PastAndPresent: require('src/kinematics/PastAndPresent'),
        RollingAverage: require('src/kinematics/RollingAverage'),
        Rounding: require('src/kinematics/Rounding'),
        RunningAccelerationStat: require('src/kinematics/RunningAccelerationStat'),
        RunningArrayStat: require('src/kinematics/RunningArrayStat'),
        RunningFreenessStat: require('src/kinematics/RunningFreenessStat'),
        RunningImpactStat: require('src/kinematics/RunningImpactStat'),
        RunningLineStraightnessStat: require('src/kinematics/RunningLineStraightnessStat'),
        RunningSpeedStat: require('src/kinematics/RunningSpeedStat'),
        RunningStat: require('src/kinematics/RunningStat'),
        RunningSteadinessStat: require('src/kinematics/RunningSteadinessStat')
    };
});
    //Register in the values from the outer closure for common dependencies
    //as local almond modules
    
    //Use almond's special top-level, synchronous require
    // to trigger factory functions,
    // get the final module value,
    // and export it as the public value.
    return require('runningkinematics');
}));
