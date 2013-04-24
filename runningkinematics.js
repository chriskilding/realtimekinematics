/*global define */

// The main module that defines the public interface for this library.
define(function (require) {
    'use strict';

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
