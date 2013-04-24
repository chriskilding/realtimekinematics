/*global define */

// The main module that defines the public interface for mocap.
define(function (require) {
    'use strict';

    //Return the module value.
    return {
        Broadcaster: require('mocap/datasource/Broadcaster'),
        DataRecorder: require('mocap/datasource/DataRecorder'),
        JointExtractor: require('mocap/datasource/JointExtractor'),
        JointGroups: require('mocap/datasource/JointGroups'),
        Joints: require('mocap/datasource/Joints'),
        JointUpdater: require('mocap/datasource/JointUpdater'),
        NetworkDataSource: require('mocap/datasource/NetworkDataSource'),
        ZigDataSource: require('mocap/datasource/ZigDataSource')
    };
});
