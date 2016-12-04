# loopback-example-app

This is an implementation of a really simple application to create ambulance transportation requests.
The application has been created using Loopback.

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
`/client/js/controllers/services.js`

Nothing else!

This is the code to validate a phone using a server side library from client (because of the browserification thanks to isomorphic programming way)

```javascript
    var returnValue = PhoneUtils.validatePhone(phone);
    return returnValue;
    
```
`/client/js/controllers/newservicerequest.js`

# Common

This is where we define the common part of the model, meaning the classes that we use in both server and client side. We also add here all the libraries that we want to use in both client and server side, for example `phoneUtils.js`.

## Model and Persistence

Persistence in loopback is performed by [Juggler](https://github.com/strongloop/loopback-datasource-juggler), an ORM/ODM that provides a common set of interfaces for interacting with databases, REST APIs, and other types of data sources. It was originally forked from [JugglingDB](https://github.com/1602/jugglingdb).
Take into account that traditional ORMs are designed to work mainly against databases. This way allow to interact with whatever and make completely transparent the source of the information.


Model is defined within the subdirectory `models`. Each entity within our model has an specification file in .json and a .js file to add business logic and customize the entity.

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

By defining just this single file, loopback will generate a really complete restful API to allow creating, modifying, deleting and querying patients from client side:

```
PATCH /patients Patch an existing model instance or insert a new one into the data source.
GET /patients Find all instances of the model matched by filter from the data source.
PUT /patients Patch an existing model instance or insert a new one into the data source.
POST /patients Create a new instance of the model and persist it into the data source.
PATCH /patients/{id} Patch attributes for a model instance and persist it into the data source.
GET /patients/{id} Find a model instance by {{id}} from the data source.
HEAD /patients/{id} Check whether a model instance exists in the data source.
PUT /patients/{id} Patch attributes for a model instance and persist it into the data source.
DELETE /patients/{id} Delete a model instance by {{id}} from the data source.
GET /patients/{id}/exists Check whether a model instance exists in the data source.
POST /patients/{id}/replace Replace attributes for a model instance and persist it into the data source.
GET /patients/{id}/serviceRequests Queries serviceRequests of Patient.
POST /patients/{id}/serviceRequests Creates a new instance in serviceRequests of this model.
DELETE /patients/{id}/serviceRequests Deletes all serviceRequests of this model.
GET /patients/{id}/serviceRequests/{fk} Find a related item by id for serviceRequests.
PUT /patients/{id}/serviceRequests/{fk} Update a related item by id for serviceRequests.
DELETE /patients/{id}/serviceRequests/{fk} Delete a related item by id for serviceRequests.
GET /patients/{id}/serviceRequests/count Counts serviceRequests of Patient.
GET /patients/{id}/services Queries services of Patient.
POST /patients/{id}/services Creates a new instance in services of this model.
DELETE /patients/{id}/services Deletes all services of this model.
GET /patients/{id}/services/{fk} Find a related item by id for services.
PUT /patients/{id}/services/{fk} Update a related item by id for services.
DELETE /patients/{id}/services/{fk} Delete a related item by id for services.
GET /patients/{id}/services/count Counts services of Patient.
GET /patients/change-stream Create a change stream.
POST /patients/change-stream Create a change stream.
GET /patients/count Count instances of the model matched by where from the data source.
GET /patients/findOne Find first instance of the model matched by filter from the data source.
POST /patients/replaceOrCreate Replace an existing model instance or insert a new one into the data source.
POST /patients/update Update instances of the model matched by {{where}} from the data source.
POST /patients/upsertWithWhere Update an existing model instance or insert a new one into the data source based on the where criteria.
```

However, because loopback also generate a file to reuse the same API from client side, we are going to ignore the existente of this API.

We can also customize the behaviour of out entity Patient by adding code to the patient.js file.

