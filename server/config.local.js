'use strict';

var GLOBAL_CONFIG = require('../global-config');

var env = (process.env.NODE_ENV || 'development');
var isDevEnv = env === 'development' || env === 'test';

module.exports = {
    restApiRoot: GLOBAL_CONFIG.restApiRoot,
    host: GLOBAL_CONFIG.hostname,
    port: GLOBAL_CONFIG.port,
    livereload: process.env.LIVE_RELOAD,
    isDevEnv: isDevEnv,
    legacyExplorer: GLOBAL_CONFIG.legacyExplorer
};