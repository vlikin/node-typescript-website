var _ = require('lodash');
var config = require('./default');

module.exports = _.defaultsDeep(
    {},
    config
);
