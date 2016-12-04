# loopback-example-app

This is the implementation of a really really simple application in `Node` and `Loopback` to create ambulance transportation requests.
It has 3 entities ([Patient](https://github.com/aparraga/loopback-example-app/blob/master/common/models/patient.json), [ServiceRequest](https://github.com/aparraga/loopback-example-app/blob/master/common/models/service-request.json) and [Service](https://github.com/aparraga/loopback-example-app/blob/master/common/models/service.json)).

## Project layout

- `server` - Node application scripts and configuration files.
- `client` - Client JavaScript, HTML, and CSS files.
- `common` - Files common to client and server. The /models sub-directory contains all model JSON and JavaScript files. The /utils sub-directory contains libraries that are browserified and used in both server and client side
- `definitions` - API and product definition YAML files (IBM API Connect only).
- `tests` - Unit tests

The development is isomorphic. Javascript was traditionally the language of the web browser, performing computations directly on a user’s machine. This is referred to as “client-side” processing. With the advent of Node.js, JavaScript has become a compelling “server-side” language as well, which was traditionally the domain of languages like Java, Python and PHP.
In web development, an isomorphic application is one whose code (in this case, JavaScript) can run both in the server and the client. The main advantage is that you can reuse same libraries in client and server side, spedding up your development process.

## Server

We have just add a few configuration regarding database connection and model visibility. We have also created a different configuration for test environment regarding database connection (`datasources.test.json`).

## Client

Really simple angular scripts with 2 controllers. Loopback generates a few .js files in client side that replicates the server side API to make transparent the way it has to send or receive the information to and from server side. So no implicit calls to REST anymore! We just use the same API that we already use in server side.

For example, this is the code in client side to get all the services, and for each one the service request and the patient related with:

```javascript

      Service.find({ filter: {
        include: ['serviceRequest', 'patient']
        }
      }, function(services) {
        $scope.services = services;
      });

```
[services.js](https://github.com/aparraga/loopback-example-app/blob/master/client/js/controllers/services.js)

Nothing else!

This is the code to validate a phone using a server side library from client (because of the browserification thanks to isomorphic programming way)

```javascript
    var returnValue = PhoneUtils.validatePhone(phone);
    return returnValue;
    
```
[newservicerequest.js](https://github.com/aparraga/loopback-example-app/blob/master/client/js/controllers/newservicerequest.js)

# Common

This is where we define the common part of the model, meaning the classes that we use in both server and client side. We also add here all the libraries that we want to use in both client and server side, for example `phoneUtils.js`.

## Model and Persistence

Persistence in loopback is performed by [Juggler](https://github.com/strongloop/loopback-datasource-juggler), an ORM/ODM that provides a common set of interfaces for interacting with databases, REST APIs, and other types of data sources. It was originally forked from [JugglingDB](https://github.com/1602/jugglingdb).

Entities are defined within the subdirectory `models`. Each entity has an .json specification file and a .js file for custom business logic and behavior.

Example of .json specification for the entity Patient:

```javascript
{
  "name": "Patient",
  "plural": "patients",
  "base": "PersistedModel",
  "idInjection": true,
  "options": {
    "validateUpsert": true
  },
  "persistUndefinedAsNull": true,
  "properties": {
    "id": {
      "type": "string",
      "id": true,
      "defaultFn": "guid"
    },
    "SIP": {
      "type": "string",
      "id": false,
      "required": true,
      "description": "This is the SIP of the patient"
    },
    "birthDate": {
      "type": "date",
      "required": false,
      "description": "Birthdate of the patient"
    },
    "name": {
      "type": "string",
      "required": false,
      "description": "Complete name (first and last name)"
    },
    "phone": {
      "type": "string",
      "required": false,
      "index": true,
      "description": "Phone (should be unique)"
    }
  },
  "validations": [],
  "relations": {
    "services": {
      "type": "hasMany",
      "model": "Service",
      "foreignKey": "patientId"
    },
    "serviceRequests": {
      "type": "hasMany",
      "model": "ServiceRequest",
      "foreignKey": "patientId"
    }
  },
  "acls": [],
  "methods": {}
}
```
[patient.json](https://github.com/aparraga/loopback-example-app/blob/master/common/models/patient.json)

By defining just this single file, loopback will generate a really complete restful API to allow creating, modifying, deleting and querying patients from client side:

Verb        | Route           | Description  |
--- | --- | ---
PATCH | /patients | Patch an existing model instance or insert a new one into the data source.
GET | /patients | Find all instances of the model matched by filter from the data source. 
PUT | /patients | Patch an existing model instance or insert a new one into the data source. 
POST | /patients | Create a new instance of the model and persist it into the data source. 
PATCH | /patients/{id} | Patch attributes for a model instance and persist it into the data source. 
GET | /patients/{id} | Find a model instance by {{id}} from the data source. 
HEAD | /patients/{id} | Check whether a model instance exists in the data source. 
PUT | /patients/{id} | Patch attributes for a model instance and persist it into the data source. 
DELETE | /patients/{id} | Delete a model instance by {{id}} from the data source. 
GET | /patients/{id}/exists | Check whether a model instance exists in the data source. 
POST | /patients/{id}/replace | Replace attributes for a model instance and persist it into the data source. 
GET | /patients/{id}/serviceRequests | Queries serviceRequests of Patient. 
POST | /patients/{id}/serviceRequests | Creates a new instance in serviceRequests of this model. 
DELETE | /patients/{id}/serviceRequests | Deletes all serviceRequests of this model. 
GET | /patients/{id}/serviceRequests/{fk} | Find a related item by id for serviceRequests. 
PUT | /patients/{id}/serviceRequests/{fk} | Update a related item by id for serviceRequests. 
DELETE | /patients/{id}/serviceRequests/{fk} | Delete a related item by id for serviceRequests. 
GET | /patients/{id}/serviceRequests/count | Counts serviceRequests of Patient. 
GET | /patients/{id}/services | Queries services of Patient. 
POST | /patients/{id}/services | Creates a new instance in services of this model. 
DELETE | /patients/{id}/services | Deletes all services of this model. 
GET | /patients/{id}/services/{fk} | Find a related item by id for services. 
PUT | /patients/{id}/services/{fk} | Update a related item by id for services. 
DELETE | /patients/{id}/services/{fk} | Delete a related item by id for services. 
GET | /patients/{id}/services/count | Counts services of Patient. 
GET | /patients/change-stream | Create a change stream. 
POST | /patients/change-stream | Create a change stream. 
GET | /patients/count | Count instances of the model matched by where from the data source. 
GET | /patients/findOne | Find first instance of the model matched by filter from the data source. 
POST | /patients/replaceOrCreate | Replace an existing model instance or insert a new one into the data source. 
POST | /patients/update | Update instances of the model matched by {{where}} from the data source. 
POST | /patients/upsertWithWhere | Update an existing model instance or insert a new one into the data source based on the where criteria. 

It also generates the swagger specification with all the descriptions and so, so QA can use it within their own testing framework.

It's really simple to create new services or hook existing. For example, the following code is being executed right after creating and saving a new Service Request:

```javascript
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
```
[service-request.js](https://github.com/aparraga/loopback-example-app/blob/master/common/models/service-request.js)

Hooks are in fact one of the most powerful features of loopback. For example, imagine that we want to log each time someone access to a given information:

```javascript
  Service.observe('access', function logQuery(ctx, next) {

    if(!!ctx.query && !!ctx.query.where && !!ctx.query.where.id) {
      console.log('Usuario X ha accedido al Servicio ' + ctx.query.where.id);
    }

    next();
  });
```
[service.js](https://github.com/aparraga/loopback-example-app/blob/master/common/models/service.js)

It's also really useful to send events to a separate backend, for example, whenever node acts as a middleware and it's just part of the frontend.

## Mixins

Sometime we need to add common logic to more than one entities. Mixins allow to define logic and them associate it to a set of model entities.

For example:
```
  Model.observe('before save', function event(ctx, next) { //Observe any insert/update event on Model

    Model.beginTransaction({isolationLevel: Post.Transaction.READ_COMMITTED}, function(err, tx) {
      ctx.options.transaction = tx;
      next();
    });

  });
```
[transactionsupport.js](https://github.com/aparraga/loopback-example-app/blob/master/common/mixins/transactionsupport.js)

This mixin start a new transaction, so we don't need to care about within the code of each custom operation of an entity.

# Tests

In this sample we have defined 2 kind of tests:
- Rest API Tests
- Model tests

We use [Mocha](http://mochajs.org/) and [Supertest](https://github.com/visionmedia/supertest) for Rest API testing.

We can execute all the tests from root directory via `npm test` command:

```
$npm test

  Rest API
    ✓ Post a new patient (77ms)

  Service Request Tests
    ✓ Create a new Service Request
    ✓ Create a Service Request and a Patient at once
    ✓ Check serviceDescription calculated field


  4 passing (102ms)
```

The [Rest API Test](https://github.com/aparraga/loopback-example-app/blob/master/tests/api/test.js) launches a server (within milliseconds :) and test the API by calling to create a new patient via rest.
The [Service Request Test](https://github.com/aparraga/loopback-example-app/blob/master/tests/model/servicerequesttest.js) checks a few crud operations and business logic associated to it.

