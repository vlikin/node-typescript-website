var _ = require('lodash');
var config = require('./default');
var path = require('path');

module.exports = _.defaultsDeep(
  {
    static: [{
      path: '/static',
      dir: path.resolve(path.join(__dirname), '../../client/client/www')
    }],
  },
  config
);
