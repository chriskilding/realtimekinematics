define(function (require) {

	// Import dependencies.
	var straightstatlib = require("src/kinematics/RunningLineStraightnessStat");
	
  var straightStat;
  
	// Define the QUnit module and lifecycle.
	QUnit.module("kinematics/RunningLineStraightnessStat", { 
		setup: function () {
      straightStat = new straightstatlib();
		},
		teardown: function () {
      straightStat = null;
		}
	});
	
	QUnit.test("Delta - starts at zero", function () {     
    straightStat.push([20, 20, 0]);
    straightStat.clear();
            
    QUnit.equal(straightStat.delta(), 0, true);    
	});
	
	QUnit.test("Delta - resets to zero upon clearing", function () {     
    var result = straightStat.delta();
        
    QUnit.equal(result, 0, true);    
	});
  
	QUnit.test("Delta - add one data point, still zero", function () { 
    straightStat.push([20, 20, 0]);
    QUnit.equal(straightStat.delta(), 0, true);  
	});
	
	QUnit.test("Delta - add points in perfect line data point, still zero", function () { 
    straightStat.push([20, 20, 20]);
    straightStat.push([40, 40, 40]);
    QUnit.equal(straightStat.delta(), 0, true);  
	});
  
});