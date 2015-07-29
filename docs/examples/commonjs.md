#### Gulp tasks as CommonJS modules
Here's an example of your regular average gulpfile with some arbitrary tasks, a help task and a default task.

```js
// ./examples/straight-gulp/gulpfile.js

var gulp = require('gulp');

gulp.task('first-task', function (done) {
  done();
});

gulp.task('second-task', function (done) {
  done();
});

var help = {
  'first-task': 'My first task',
  'second-task': 'My second task'
};

gulp.task('help', function () {
  Object.keys(help).map(function (taskName) {
    console.log(taskName + ' ' + help[taskName]);
  });
});

gulp.task('default', ['help']);

```

Let's try create the same with a CommonJS module.

Create a `gulpfile.js` file and add the following:

```js
// ./examples/commonjs/gulpfile.js

var gulp = require('gulp');
var taskLoader = require('gulp-commonjs-tasks/task-loader');

// load tasks
var tasksContext = taskLoader.load('./tasks', gulp);

// Add the gulp help task
tasksContext.addHelpTask();

```

Now let's create a module in `./tasks` and call it `simple.js`

```js
// ./examples/commonjs/tasks/simple.js

module.exports = function (gulp) {

  var tasks = {
    'first-task': {
      fn: firstTask,
      description: 'My first task'
    },
    'second-task': {
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

The CommonJS module above returns a function which takes in the `gulp` object as an argument. This argument is needed to access gulp tasks in other task files. It is not mandatory, but if you'd like to use `gulp.src()` for instance, you need it.

```bash
[gulp-commonjs-tasks-examples] cd examples/straight-gulp
[straight-gulp] gulp
[07:08:10] Using gulpfile ~/temp/gulp-commonjs-tasks-examples/examples/straight-gulp/gulpfile.js
[07:08:10] Starting 'help'...
first-task My first task
second-task My second task
[07:08:10] Finished 'help' after 156 μs
[07:08:10] Starting 'default'...
[07:08:10] Finished 'default' after 7.22 μs
```

```bash
[gulp-commonjs-tasks-examples] cd examples/commonjs
[commonjs] gulp
[07:06:08] Using gulpfile ~/gulp-commonjs-tasks-examples/examples/commonjs/gulpfile.js
[07:06:08] Starting 'help'...
help Usage
  gulp task [ option ... ]
Tasks
  help          : Show help
    -a, --all   : Also show tasks without descriptions
  first-task    : My first task
  second-task   : My second task
[07:06:08] Finished 'help' after 1.87 ms
[07:06:08] Starting 'default'...
[07:06:08] Finished 'default' after 17 μs
```
