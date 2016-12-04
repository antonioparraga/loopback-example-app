process.env.NODE_ENV = 'test';

var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var server = require('../../server/server')
var request = require('supertest')(server)
var GLOBAL_CONFIG = require('../../global-config');

describe('Rest API', function () {

  var Patient;
  var Service;
  var ServiceRequest;

  before(function() {
    Patient = server.models.Patient;
    Service = server.models.Service;
    ServiceRequest = server.models.ServiceRequest;
  })

  beforeEach(function (done) {
    Patient.upsert({SIP: 11111, phone: '661798444'}, function() { done() })
  })

  it('Post a new patient', function (done) {
    request.post(GLOBAL_CONFIG.restApiRoot + '/patients').send({SIP: 22222}).expect(200, done)
  });


})
