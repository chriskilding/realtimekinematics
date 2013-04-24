// A metric for the force (weight or strength) of a movement
define([
  'src/kinematics/RunningStat',
  'src/kinematics/NumericalDifferentiator',
  'src/kinematics/PastAndPresent',
  'lib/sylvester'
], function(RunningStat, NumericalDifferentiator, PastAndPresent, Sylvester) {

  // Rate at which velocity changes with time
  // is dv/dt as delta t approaches 0
  // (First derivative in terms of velocity)
  // http://phys23p.sl.psu.edu/syll/p211/lecture_notes_2012/p211c02_print.pdf
  function InstantaneousAccWithVelocity(v, t) {
      var rval = new NumericalDifferentiator.point();
 
      rval.x = v;
      rval.y = v / t;
      return( rval );
  }
  
  // Rate at which velocity changes with time
  // is d^2 x / dt^2 as delta t approaches 0
  // (Second derivative in terms of displacement)
  function InstantaneousAccWithDisplacement(x, t) {
      var rval = new NumericalDifferentiator.point();
 
      rval.x = v;
      rval.y = v / t;
      return( rval );
  }

  function RunningImpactStat() {
    this.runningStat = new RunningStat();
    this.pnp = new PastAndPresent();
  }

  RunningImpactStat.prototype.push = function(coords) {                
    this.pnp.push(coords, this.pnpCallback, this);
  };
  
  RunningImpactStat.prototype.pnpCallback = function(previousCoords, latestCoords) {
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
  
  RunningImpactStat.prototype.clear = function() {
    this.pnp.clear();
    // and reset the RunningStat
    this.runningStat.clear();
  };
  
  return RunningImpactStat;  
});