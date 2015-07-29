#### Dependencies
Let's take a closer look at the `gulp.task` function.

```js
gulp.task('second', ['first'], function (done){
  console.log('second');
  done();
});

gulp.task('first', function (done) {
  console.log('first');
  done();
});
```

If we run task `second`, then task `first` will be executed first.

In our module format we add a `dep` property to provide the same functionality.

```js
// ./examples/dependencies/tasks/dependencies.js

module.exports = function (gulp) {

  var tasks = {
    'first': {
      fn: firstTask,
      description: 'My first task'
    },
    'second': {
      dep: ['first'],
      fn: secondTask,
      description: 'My second task'
    }
  };

  return tasks;

  function firstTask(done) {
    done();
  }

  function secondTask(done) {
    done();
  }
};

```

#### Referencing dependencies

Instead of creating a task for every dependency we can also reference functions.

```js
// ./examples/dependency-referencing/tasks/dependencies.js

module.exports = function (gulp) {

  var tasks = {
    'second': {
      dep: [firstTask, 'otherTask', function () {
        console.log('anonymous task');
      }],
      fn: lastTask,
      description: 'My second task'
    },
    'otherTask': {
      fn: otherTask
    }
  };

  return tasks;

  function firstTask(done) {
    console.log('firstTask');
    done();
  }

  function lastTask(done) {
    console.log('lastTask');
    done();
  }

  function otherTask(done) {
    console.log('other task');
    done();
  }
};

```
