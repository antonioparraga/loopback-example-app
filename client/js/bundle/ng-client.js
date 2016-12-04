'use strict';

// load lbclient via browserify's require
var validation = (function() {
  return require('phoneUtils');
})();

angular.module('app')
  .value('PhoneUtils', validation);
