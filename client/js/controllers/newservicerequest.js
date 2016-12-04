angular
  .module('app')
  .controller('NewServiceRequestController', function($scope, $state, PhoneUtils, ServiceRequest, Patient) {

  $scope.input = {};
  $scope.input.serviceType = 1; //by default
  $scope.patient = null;


  $scope.init = function() {

    $('#inputDate').datetimepicker(
      {
        format: 'DD/MM/YYYY',
        widgetPositioning: {
          horizontal: 'left',
          vertical: 'bottom'
        }
      }
    );

  }

  $scope.submitForm = function() {

    $scope.input.date = $('#inputDate').val();
    var day = moment($scope.input.date, "DD/MM/YYYY");

    var patient = $scope.patient;

    if(patient == null) {
      patient = new Patient();
      patient.SIP = $scope.input.sip;
      patient.phone = $scope.input.phone;
    }

    ServiceRequest.create(
      { date: day.toDate(),
        serviceType: $scope.input.serviceType,
        patient: patient
      }
      , function(serviceRequest) {

        alert('Servicio Creado con Exito!');

      }
    );

  }


  $scope.findPatient = function(sip) {
    Patient.find({filter: {
      where: {
        SIP: sip
      }
    }
    }, function(patients) {
      if(patients.length > 0) {
        var patient = patients[0];
        $scope.patient = patient;
        $scope.input.phone = patient.phone;
      }
      else {
        $scope.patient = null;
        $scope.input.phone = "";
      }
    });
  }

  $scope.validatePhone = function(phone) {

    //PhoneUtils was developed in server side and reused in client (ISOMORPHIC)
    var returnValue = PhoneUtils.validatePhone(phone);
    return returnValue;

  }

});
