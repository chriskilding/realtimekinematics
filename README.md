# realtimekinematics

## Loading the library
This library can be used either the 'normal' way (with global variables) or with AMD / require.js, where you should require the `realtimekinematics` module for use in your code.

## Dependencies
**Core dependencies:** this library *must* have access to the following third-party libraries:

- underscore

**Optional dependencies:** , the library also needs one or more of the following:


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
