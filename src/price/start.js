// transpile and shit
require('@babel/register')({
  extends: './.babelrc',
  ignore: [/node_modules/],
})


// Import the rest of our application.
module.exports = require('./server.js');


