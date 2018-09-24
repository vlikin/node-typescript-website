var _ = require('lodash');
var config = require('./default');

module.exports = _.defaultsDeep(
    {
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
