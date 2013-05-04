// Monitors freeness or boundness for a 'system' of joints
// e.g. hand, wrist, elbow, shoulder
define([
    "src/kinematics/RunningArrayStat",
    "src/kinematics/Rounding",
    "src/util/Vector"
], function (RunningArrayStat, Rounding, Vector) {
    "use strict";
    
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
    }
    
    // Needs WHOLE skeleton
    RunningFreenessStat.prototype.push = function (skeleton) {
        // We will get the ROTATION values for every point;
        // position may change as the whole 'joint system' moves through space,
        // but rotation of each joint will stay same/similar if movement is bound
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
                try {
                    angle = Vector.angleBetween(
                        firstJoint.data.position,
                        secondJoint.data.position
                    );
                } catch (e) {
                }
            }
            
            return angle;
        });
    
        // Now push it into the corresponding RunningFreenessStat 
        // position may change as the whole 'joint system' moves through space,
        // but angle between each joint pair will stay same/similar if movement is bound
        // console.log('anglesArray', anglesArray);
        this.rstat.push(anglesArray);
        
        return this.getValue();
    };
    
    RunningFreenessStat.prototype.getValue = function () {
        // use variance for now
        return this.rstat.variance();
    };
    
    RunningFreenessStat.prototype.clear = function () {
        this.rstat.clear();
    };
    
    return RunningFreenessStat;
});
