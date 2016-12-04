process.env.NODE_ENV = 'test';

var chai = require('chai');
var expect = chai.expect;
var assert = require('assert');
var server = require('../../server/server')

describe('Service Request Tests', function () {

  var Patient;
  var Service;
  var ServiceRequest;
  var createdPatient;

  before(function(done) {
    Patient = server.models.Patient;
    Service = server.models.Service;
    ServiceRequest = server.models.ServiceRequest;

    var patient = new Patient({
      SIP: '12345',
      phone: '965735162',
      name: 'John Rambo'
    });

    Patient.create(patient, function(err, persistedPatient) {
      createdPatient = persistedPatient;
      done();
    });

  })

  it('Create a new Service Request for an existing Patient', function (done) {

    ServiceRequest.create({
      date: new Date(),
      serviceType: 1,
      patient: new Patient({ SIP: '12345' })
    }, function(err, serviceRequest) {

      expect(serviceRequest).to.exist;
      expect(serviceRequest.serviceType).to.equal(1);
      expect(serviceRequest.patientId).to.equal(createdPatient.id);

      //also check that a Service has been created from the Service Request
      Service.find({where: {serviceRequestId: serviceRequest.id}}, function(err, service) {
        expect(service).to.exist;
        done();
      });

    })
  });

  it('Create a Service Request for an unexisting Patient', function (done) {

    var patient = new Patient({
      SIP: '112233',
      phone: '661764893',
      name: 'Peggy Sue'
    });

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
        expect(persistedPatient.phone).to.equal(patient.phone);

        //also check that a Service has been created from the Service Request
        Service.find({where: {serviceRequestId: serviceRequest.id}}, function(err, service) {
          expect(service).to.exist;
          done();
        });

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
