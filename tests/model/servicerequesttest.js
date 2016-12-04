process.env.NODE_ENV = 'test';

var chai = require('chai');
var expect = chai.expect;
var assert = require('assert');
var server = require('../../server/server')

describe('Service Request Tests', function () {

  var Patient;
  var Service;
  var ServiceRequest;

  before(function() {
    Patient = server.models.Patient;
    Service = server.models.Service;
    ServiceRequest = server.models.ServiceRequest;
  })

  it('Create a new Service Request', function (done) {

    ServiceRequest.create({
      date: new Date(),
      serviceType: 1
    }, function(err, serviceRequest) {

      //assert.equal(serviceRequest.date, date);
      expect(serviceRequest).to.exist;
      expect(serviceRequest.serviceType).to.equal(1);
      done();

    })
  });

  it('Create a Service Request and a Patient at once', function (done) {

    var patient = new Patient()
    patient.SIP = '12345';
    patient.phone = '965735162';
    patient.name = 'John Rambo';

    var date = new Date();

    ServiceRequest.create({
      date: date,
      serviceType: 1,
      patient: patient
    }, function(err, serviceRequest) {

      expect(serviceRequest).to.exist;
      expect(Date(serviceRequest.date)).to.equal(Date(date));
      expect(serviceRequest.patientId).to.exist;

      Patient.findById(serviceRequest.patientId, function(err, persistedPatient) {
        expect(persistedPatient.SIP).to.equal(patient.SIP);
        done();
      });

    })
  });

  it('Check serviceDescription calculated field', function (done) {

    var patient = new Patient()
    patient.SIP = '88888';
    patient.phone = '661798444';

    ServiceRequest.create({
      date: new Date(),
      serviceType: 1, //dialisis
      patient: patient
    }, function(err, serviceRequest) {

      ServiceRequest.findById(serviceRequest.id, function(err, persistedServiceRequest) {
        expect(persistedServiceRequest.serviceDescription).to.equal('Dialisis')
        done();
      });

    })
  });

})
