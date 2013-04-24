// Monitors freeness or boundness for a 'system' of joints
// e.g. hand, wrist, elbow, shoulder
define([
  'kinematics/RunningArrayStat',
  'kinematics/Rounding',
  'sylvester'
], function(RunningArrayStat, Rounding, Sylvester) {

  // Expects Sylvester vectors!
  var angleBetweenTwoVectors = function (a, b) {
    // See http://chortle.ccsu.edu/vectorlessons/vch10/vch10_5.html
    // We are dealing with non-unit vectors so...
    // (1) normalize each vector
    var normA = a.toUnitVector();
    var normB = b.toUnitVector();
    
    // (2) compute the dot product
    var product = normA.dot(normB);
    
    // (3) take the arc cos to get the angle.
    return Math.acos(product);
  };

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
    
    // Create vectors once, not millions of times!
    this.vecA = Sylvester.Vector.Zero();
    this.vecB = Sylvester.Vector.Zero();
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
        that.vecA.setElements(firstJoint.data.position);
        that.vecB.setElements(secondJoint.data.position);
        
        angle = angleBetweenTwoVectors(that.vecA, that.vecB);
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
  
  RunningFreenessStat.prototype.clear = function() {
    this.rstat.clear();
    // vecA and vecB don't need to be cleared
    // they get overwritten before use anyway
  };
  
  return RunningFreenessStat;
});
