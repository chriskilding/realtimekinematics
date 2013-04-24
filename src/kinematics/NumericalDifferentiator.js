// From http://oldhorse.hubpages.com/hub/drawing-calculus-numberical-integration-and-differentiation-in-javascript-part-6-in-a-series
define([
], function() {
  
  /*var pointbase = {
      x: 0,
      y: 0
  };*/
 
  function point() {
      //this.prototype = pointbase;
      this.x = 0;
      this.y = 0;
  };
 
  function circle( angle ) {
      var rval = new point();
 
      rval.x = Math.cos( angle );
      rval.y = Math.sin( angle );
      return( rval );
  }
 
  function cos1overx2( x ) {
      var rval = new point();
 
      rval.x = x;
      rval.y = Math.cos( 1 / ( x * x ) );
      return rval;
  }

  // the function that creates derivative functions
  // fn = the function to compute the derivative of
  function ptdiff( fn, x, delta ) {
      var rval = new point();
 
      rval.x = x;
      rval.y = -( fn( x ).y - fn( x + delta).y) / ( delta ); 
      //bit of a hack to keep the integration function from reseting
      return( rval );
  }
 
  function diff( fn, delta ) {
      var rval = function( x ) {
          return ptdiff( fn, x, delta );
      }
      return rval;
  }
 
  // The function that returns differential
  function ptint( fn, x, delta ) {
      var rval = new point();
 
      rval.x = x;
      rval.y = fn( x - delta ).y * delta;
      return( rval );
  }
 
  function int( fn, delta ) {
      var sum = 0;
      var lastx = 1000;
      var rval = function( x ) {
          if( x < lastx ) {
              // assume new integral, reset
              sum = 0;
          } else {
              delta = x - lastx;
          }
          var pt = ptint( fn, x, delta );
          sum += pt.y;
          pt.y = sum;
          lastx = x;
          return( pt );
      }
      return rval;
  }
 
  // Definition of a func that can be differentiated or integrated
  // From here you can do
  // x2diff = diff( xsquared, 0.01 ); to differentiate
  // x2int = int( xsquared, 0.1 ); to integrate
  function xsquared( x ) {
      var rval = new point();
 
      rval.x = x;
      rval.y = x * x;
      return( rval );
  }
         
  return {
    point: point,
    differentiate: diff,
    integrate: int
  };
});