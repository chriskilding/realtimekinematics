"use strict";

// A convenience enumeration of all the tracked body joints, mapping
// human-readable names e.g. RightHand to their (arbitrary and hard
// to remember) numerical ID in the received data packets. This may
// help you to write less error-prone code when using mocapjs.
define([
], function () {
  
    // We ignore the invalid ones!
    return {
        Head: 1,
        LeftAnkle: 19,
        LeftCollar: 5,
        LeftElbow: 7,
        LeftFingertip: 10,
        LeftFoot: 20,
        LeftHand: 9,
        LeftHip: 17,
        LeftKnee: 18,
        LeftShoulder: 6,
        LeftWrist: 8,
        Neck: 2,
        RightAnkle: 23,
        RightCollar: 11,
        RightElbow: 13,
        RightFingertip: 16,
        RightFoot: 24,
        RightHand: 15,
        RightHip: 21,
        RightKnee: 22,
        RightShoulder: 12,
        RightWrist: 14,
        Torso: 3,
        Waist: 4
    };
  
});