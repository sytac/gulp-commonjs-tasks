## Promises, promises...

Next to returning a stream we can also return promises or invoke a callback when a gulp task is done. The next example demonstrates to use of [Q](https://www.npmjs.com/package/q) promises, [bluebird promises](https://www.npmjs.com/package/bluebird) or regular [gulp callbacks](https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulptaskname-deps-fn)

```js
// ./examples/promises/tasks/promises.js

module.exports = function (gulp) {
  var Q = require('q');
  var Promise = require('bluebird');

  var tasks = {
    'q': {
      fn: qTask,
      description: 'A task which returns a Q promise'
    },
    'bluebird': {
      fn: bluebirdTask,
      description: 'A task which returns a bluebird promise'
    },
    'callback': {
      fn: callbackTask,
      description: 'A task with a callback function'
    },
    'mixed': {
      seq: ['q', 'bluebird', 'callback'],
      description: 'A task which runs q, bluebird and callback in sequence'
    }
  };

  return tasks;

  function qTask() {
    var deferred = Q.defer();

    setTimeout(function () {
      console.log('Q resolved');
      deferred.resolve();
    }, 1000);

    return deferred.promise;
  }

  function bluebirdTask() {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        console.log('bluebird resolved');
        resolve();
      }, 500);
    });
  }

  function callbackTask(done) {
    setTimeout(function () {
      console.log('Callback done');
      done();
    }, 1500);
  }
};

```
