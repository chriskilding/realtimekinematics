define(function (require) {

	// Import depdendencies.
	var rstat = require("src/kinematics/RunningStat");
	
  var runningStat;
  
	// Define the QUnit module and lifecycle.
	QUnit.module("kinematics/RunningStat", { 
		setup: function () {
      runningStat = new rstat();
		},
		teardown: function () {
      runningStat = null;
		}
	});
	
	QUnit.test("numDataValues - starts at zero", function () {     
    var result = runningStat.numDataValues();
        
    QUnit.equal(result, 0, true);    
	});
	
	QUnit.test("numDataValues - add one data point, goes up", function () { 
    runningStat.push(20);
    QUnit.equal(runningStat.numDataValues(), 1, true);  
	});
	
	QUnit.test("numDataValues - reset to zero after clearing", function () {     
    runningStat.push(20);
    runningStat.clear();
        
    QUnit.equal(runningStat.numDataValues(), 0, true);    
	});
  
  // -------------------
  
	QUnit.test("Mean - starts at zero", function () {             
    QUnit.equal(runningStat.mean(), 0, true);    
	});
	
	QUnit.test("Mean - add one data point, equals that point", function () { 
    runningStat.push(20);
    QUnit.equal(runningStat.mean(), 20, true);  
	});
	
	QUnit.test("Mean - add two data points, equals halfway between them", function () { 
    var point1 = 20;
    var point2 = 40;
    var expectedAvg = 30;
    
    runningStat.push(point1);
    runningStat.push(point2);
    QUnit.equal(runningStat.mean(), expectedAvg, true);  
	});

	QUnit.test("Mean - clear all data sends it back to zero", function () { 
    runningStat.push(20);
    runningStat.clear();
    
    QUnit.equal(runningStat.mean(), 0, true);  
	});

  // ----------------------
  
	QUnit.test("Variance - starts at zero", function () {             
    QUnit.equal(runningStat.variance(), 0, true);    
	});
	
	QUnit.test("Variance - add one data point, equals zero", function () { 
    runningStat.push(20);
    QUnit.equal(runningStat.variance(), 0, true);  
	});
  
	QUnit.test("Variance - add identical data points, still equals zero", function () { 
    runningStat.push(20);
    runningStat.push(20);
    
    QUnit.equal(runningStat.variance(), 0, true);  
	});
  
	QUnit.test("Variance - add data points different by 1, equals 0.5", function () { 
    runningStat.push(20);
    runningStat.push(21);
    
    // Variance = how far the numbers lie from the mean
    // the mean of 20 and 21 will be 20.5
    // therefore 20 and 21 are both 0.5 away from that
    
    QUnit.equal(runningStat.variance(), 0.5, true);  
	});
  
	QUnit.test("Variance - clear all data sends it back to zero", function () { 
    runningStat.push(20);
    runningStat.clear();
    
    QUnit.equal(runningStat.variance(), 0, true);  
	});
});