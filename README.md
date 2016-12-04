# loopback-example-app

This is an implementation of a really simple application to create ambulance transportation requests.
The application has been created using Loopback.

## Project layout

- `server` - Node application scripts and configuration files.
- `client` - Client JavaScript, HTML, and CSS files.
- `common` - Files common to client and server. The /models sub-directory contains all model JSON and JavaScript files. The /utils sub-directory contains libraries that are browserified and used in both server and client side
- `definitions` - API and product definition YAML files (IBM API Connect only).

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

#

