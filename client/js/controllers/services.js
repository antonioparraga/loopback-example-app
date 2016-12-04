angular
  .module('app')
  .controller('ServicesController', function($scope, $state, Service) {

    $scope.services = [];

    $scope.init = function() {

      Service.find({ filter: {
        include: ['serviceRequest', 'patient']
        }
      }, function(services) {
        $scope.services = services;
      });

    };

    $scope.showRow = function(id) {

      Service.findById({id: id}, function(service) {
        alert("Ha accedido al registro " + service.id);
      });

    };


});
