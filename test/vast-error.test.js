var test = require('tap').test
  , VAST = require('../index.js')
  , vast = new VAST({ VASTErrorURI: 'http://adserver.com/noad.gif' });

module.exports = vast;