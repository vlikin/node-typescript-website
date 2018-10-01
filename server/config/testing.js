var _ = require('lodash');
var path = require('path');
var config = require('./default');

module.exports = _.defaultsDeep(
  {
    static: [{
      path: '/static',
      dir: path.resolve(path.join(__dirname), '../fixtures')
    }],
    server: {
      port: 929
    },
    fileStorage: '../test-files',
    db: {
      name: 'website_test'
    }
  },
  config
);
