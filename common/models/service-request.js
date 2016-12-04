'use strict';

module.exports = function(ServiceRequest) {

  ServiceRequest.observe('before save', function(ctx, next) {

    var app = require('./../../server/server');
    var Patient = app.models.Patient;

    //if the instance contains the info of the patient
    if(!!ctx.instance.patient && !ctx.instance.patient.id && !!ctx.instance.__cachedRelations.patient) {

      var patient = ctx.instance.__cachedRelations.patient;
      Patient.findOne({where: { SIP: patient.SIP }}, function(err, persistedPatient) {
        //if exists, do not created again
        if(persistedPatient != null) {
          ctx.instance.patientId = persistedPatient.id;
          next();
        }
        //if not exists, create and assign to the service request
        else {
          Patient.create(patient, function (err, createdPatient) {
            ctx.instance.patientId = createdPatient.id;
            next();
          });
        }
      });

    }
    else {
      next();
    }

  });


  ServiceRequest.observe('after save', function(ctx, next) {

    if(ctx.isNewInstance) {

      var Service = ServiceRequest.app.models.Service;

      Service.create({
        date: ctx.instance.date,
        serviceRequestId: ctx.instance.id,
        patientId: ctx.instance.patientId
      }, function(err, service) {

        //great!

      });
    }

    next();


  });

  ServiceRequest.observe('loaded', function(ctx, next) {

    if(!!ctx.instance && !!ctx.instance.serviceType) {
      if (ctx.instance.serviceType == 1) {
        ctx.instance.serviceDescription = "Dialisis";
      }
      else if (ctx.instance.serviceType == 2) {
        ctx.instance.serviceDescription = "Quimio";
      }
      else if (ctx.instance.serviceType == 3) {
        ctx.instance.serviceDescription = "Radio";
      }
    }

    next();
  });


};
