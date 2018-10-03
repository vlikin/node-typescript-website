var _ = require('lodash');
var config = require('./default');
var path = require('path');

module.exports = _.defaultsDeep(
  {
    db: {
      host: 'db'
    },
  },
  config
);
