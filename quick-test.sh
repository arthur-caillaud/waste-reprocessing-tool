# generates a mocha test but does not store the results
./node_modules/.bin/mocha --recursive ./test/ --require ./test/test_helper.js --require ignore-styles --compilers js:babel-core/register
