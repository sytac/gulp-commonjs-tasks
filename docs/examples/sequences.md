#### Sequences

I don't know about you but if you want to have some control of when tasks will be executed you'll end up using something like `run-sequence` to avoid the mess of chaining tasks together.


##### Introducing run-sequence

Using [run-sequence](https://www.npmjs.com/package/run-sequence) we can run tasks in sequence rather than all at once before running a task.

Here we have three tasks which are run in order by the `all` task. A `fn` property is not needed, but if you add it, it will executed when the sequence is done.

```js
// ./examples/sequences/tasks/sequence.js

module.exports = function (gulp) {

  var tasks = {
    'first': {
      fn: firstTask,
      description: 'My first task'
    },
    'second': {
      fn: secondTask,
      description: 'My second task'
    },
    'third': {
      fn: thirdTask,
      description: 'My third task'
    },
    'all': {
      seq: ['first', 'second', 'third'],
      description: 'All three tasks'
    },
    'all-and-self': {
      fn: lastTask,
      seq: ['first', 'second', 'third'],
      description: 'All three tasks'
    }
  };

  return tasks;

  function firstTask(done) {
    done();
  }

  function secondTask(done) {
    done();
  }

  function thirdTask(done) {
    done();
  }

  function lastTask(done) {
    done();
  }
};

```

##### Referencing sequences

We are not bound to handing task names in the `seq` array. We can also use function names or anonymous functions.

```js
// ./examples/sequence-referencing/tasks/sequence.js

module.exports = function (gulp) {

  var tasks = {
    'all': {
      seq: [firstTask, secondTask, thirdTask],
      description: 'All three tasks'
    }
  };

  return tasks;

  function firstTask(done) {
    done();
  }

  function secondTask(done) {
    done();
  }

  function thirdTask(done) {
    done();
  }
};

```

We can also mix the type of objects a sequence array can take.

```js
// ./examples/sequence-mixed-referencing/tasks/sequence.js

module.exports = function (gulp) {

  var tasks = {
    'first': {
      fn: firstTask,
      description: 'My first task'
    },
    'all': {
      fn: lastTask,
      seq: ['first', secondTask, function(done){
        done();
      }],
      description: 'All three tasks'
    }
  };

  return tasks;

  function firstTask(done) {
    done();
  }

  function secondTask(done) {
    done();
  }

  function lastTask(done) {
    done();
  }

};

```
