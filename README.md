# realtimekinematics
A JS library for doing real-time kinematics analysis on streams of motion data. The overarching principle is that, unlike some other mechanics libraries which accumulate data in an array and then perform a single (slow) analysis of it when movement ceases, in this library it's cheap to add 'one more' data point as it arrives from the stream, and cheap to compute the final result, as the statistics are generated in a cumulative manner by running only O(1) operations when each piece of data is added.

## Loading the library
This library can be used either the 'normal' way (with global variables) or with AMD / require.js, where you should require the `realtimekinematics` module for use in your code.

## Dependencies
For the time being, this library has no third party runtime dependencies; the only external libraries used are those which are needed to build it.

## To build
1. First install Node.js from your favorite source.
2. `cd` into the project directory.
3. Run `npm install` if necessary to obtain the necessary dependencies for building.
4. Run `node tools/r.js -o tools/build.js`.
5. The built (concatenated and minified) version of the library will be a single file under the `dist` folder.

## Tests
Unit testing is done with the QUnit and Sinon.js frameworks. To run the tests:

- open index.html in the `test` folder to test the code in a development environment, which will pull in the library files individually from the `src` folder.
- open index-dist-amd.html in the `test` folder to test the code in a production environment, which will test the concatenated and minified version of the library in `dist/realtimekinematics.js`.

## Module descriptions
- RunningStat: the core of several other modules, RunningStat accepts new numerical data through push(), and computes some intermediate values in O(1) time that allow it to then compute the variance, mean, standard deviation, and total number of data points in O(1) time at any point.
- PastAndPresent: useful when measuring inter-frame deltas, PNP holds a continuously updated reference to the vector from the frame before, so that when new data rolls in, a specified callback function can be used to compare the two values in the manner of your choice. After the callback executes, the latest vector becomes the previous vector.
- RunningSpeedStat: performs inter-frame analysis of the positions of vectors to determine the straight-line distance which the object has travelled during the time window between the frames, and computes its speed from this.
- RunningLineStraightnessStat: performs a displacement calculation similar to that of RunningSpeedStat, but with a view to calculating the difference between the overall *displacement* of the movement (if the object moved in a perfectly straight line from start to finish) and the actual *distance* it travelled. A higher value indicates a less direct path was taken.
- RollingAverage: computes an Exponentially Weighted Moving Average every time it is updated, with a customizable decay value.
- RunningArrayStat: performs the same function as RunningStat, but can accept whole vectors rather than just individual numerical values.
- Rounding: a collection of helpers for taking a bunch of vectors and producing a single vector from them, composed of the highest / lowest / (insert criteria here) values from each vector.
- RunningSteadinessStat: monitors how much an object is moving over time using an EWMA. Lower values indicate the object is relatively stationary; higher values indicate it is less stable.