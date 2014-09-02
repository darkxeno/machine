# node-machine

First, here's a quick example:

```bash
$ node
> require('machinepack-github').getRepo
-----------------------------------------
 [Machine: get-repo]
 Fetch metadata about a github repo.
 
 Inputs:
  • repo      (type: string)
  • user      (type: string)
-----------------------------------------

> require('machinepack-github').getRepo({repo: 'sails', user: 'balderdashy'}).exec(console.log)

{ ... }
```



## Using a machine

With traditional options+callback function usage:

```javascript
var Github = require('machinepack-github');


Github.getRepo({
  user: 'balderdashy',
  repo: 'sails'
}, function (err, result) { /* ... */ });
```


With chainable helper functions and a switchback:

```javascript
var Github = require('machinepack-github');

Github.getRepo
.configure({
  user: 'balderdashy',
  repo: 'sails'
})
.exec({
  success: function (results){ /*...*/ },
  error: function (err){ /*...*/ },
  invalidApiKey: function (err){ /*...*/ },
  // etc.
});
```

With machinepack-independent/low-level usage:

```javascript
var Machine = require('node-machine');

Machine.build(require('machinepack-github/get-repo'))
.configure({
  user: 'balderdashy',
  repo: 'sails'
}).exec(function (err, results){
  if (err) {
    // ...
  }

  // ...
})
```




## Building your own machine

Machines are mostly just simple functions that always have the same usage paradigm:

```javascript
function (inputs, cb) {
  return cb();
}
```


If you define a function that way (let's say you export it from a local module called "foo.js"), you can actually use it as a machine like this:

```javascript
require('node-machine').build(require('./foo'))
.configure({
  // input values go here
})
.exec(function (err) {
  console.log('all done.');
});
```





## Advanced Usage

Since machine definitions are completely static, we must consider all of the various methods by which we might deserialize them and inject the runtime scope.

#### The `Machine` constructor

When you require `node-machine`, you get the stateless `Machine` constructor:

```javascript
var Machine = require('node-machine');

console.log(Machine);
/*
-----------------------------------------
 node-machine
 v0.2.2
 
 • License  : MIT
 • Docs     : http://node-machine.org
-----------------------------------------
*/
```


As with the top-level value exported from any node module, you really shouldn't make changes to this object since it would pollute the module elsewhere in the currently-running process (in other functions, other files, and even other modules!)


#### Building callable machines

`Machine.build()` is a static factory method which constructs callable functions.

```javascript
var Machine = require('node-machine');
var foobar = Machine.build(function foobar(inputs, cb){ return cb(); });
```

#### Executing machines

Once you have a callable machine function, you can call it directly:

```javascript
foobar({
  foo: 1,
  bar: 2
}, function (err, result) {

});
```

or just use the chainable convenience methods:

```javascript
foobar.configure({
  foo: 1,
  bar: 2
})
.exec(function (err, result) {

});
```

#### Chainable usage / deferred object

Calling `.configure()` on a machine returns a chainable intermediate object, much like a promise.

> In the future, this object might eventually be a promise.

This allows for some flexibility in how the machine is called:

```javascript
var thisFoobar = foobar.configure();
thisFoobar.configure({foo: 1});
thisFoobar.configure({bar: 2});
thisFoobar.exec(function (err, result){

});
```


#### Caching

Machines know how to cache their own results.

```javascript
var Machine = require('node-machine');
var ls = Machine.build(require('machinepack-fs/ls'));

ls
.configure({

})
.cache({ttl: 2000}) // this is the ttl, 2000ms === 2 seconds
.exec(console.log)
```
