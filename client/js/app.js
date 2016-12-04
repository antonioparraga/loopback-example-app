// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: loopback-example-angular
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular
  .module('app', [
    'lbServices',
    'ui.router',
    'angularValidator'
  ])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider,
                                                            $urlRouterProvider) {
    $stateProvider
      .state('newservicerequest', {
        url: '/newservicerequest',
        templateUrl: 'views/newservicerequest.html',
        controller: 'NewServiceRequestController'
      })
    .state('services', {
      url: '/services',
      templateUrl: 'views/services.html',
      controller: 'ServicesController'
    });
    $urlRouterProvider.otherwise('newservicerequest');
  }]);
