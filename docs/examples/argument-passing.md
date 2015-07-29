#### Argument passing
Passing arguments to each gulp task module is easy.

##### Passing multiple arguments
In our gulp file we'll pass on `defaults` and `moreDefaults`.

```js
// ./examples/passing-multiple-arguments/gulpfile.js

var gulp = require('gulp'),
  path = require('path');

var taskLoader = require('gulp-commonjs-tasks/task-loader');

var defaults = {
  foo: 'foo!',
  bar: 'bar!'
};

var moreDefaults = {
  snafu: 'snafu!',
  pebkac: 'pebkac!'
};

var tasks = taskLoader.load(path.resolve(__dirname, 'tasks'), gulp, defaults, moreDefaults);

```

In the task module `defaults` and `moreDefaults` are picked up.

```js
// ./examples/passing-multiple-arguments/tasks/multiple.js

module.exports = function (gulp, defaults, moreDefaults) {
  var tasks = {
    'multiple': {
      fn: function () {
        console.log('second argument', defaults);
        console.log('third argument', moreDefaults);
      }
    }
  };

  return tasks;
};

```

##### Passing a gulp plugin loader
The example above is not of much use in the real world, but passing on something like [gulp-load-plugins](https://www.npmjs.com/package/gulp-load-plugins) does make sense.

We pass on `gulp-load-plugins` as `$`.

```js
// ./examples/gulp-load-plugins/gulpfile.js

var gulp = require('gulp'),
  path = require('path'),
  $ = require('gulp-load-plugins')();

var taskLoader = require('gulp-commonjs-tasks/task-loader');

var tasks = taskLoader.load(path.resolve(__dirname, 'tasks'), gulp, $);

tasks.addHelpTask();

```

And we use it in a task to use `gulp-template`.

```js
// ./examples/gulp-load-plugins/tasks/readme.js

module.exports = function (gulp, $) {
  var tasks = {
    'create-readme': {
      fn: function () {
        return gulp.src('./templates/README.md')
          .pipe($.template({
            foo: 'foo!',
            bar: 'bar!'
          }))
          .pipe(gulp.dest('./'));
      },
      description: 'Create readme file'
    }
  };

  return tasks;
};

```

```bash
[gulp-load-plugins] gulp create-readme
[11:39:38] Using gulpfile ~/temp/gulp-commonjs-tasks-examples/examples/gulp-load-plugins/gulpfile.js
[11:39:38] Starting 'create-readme'...
[11:39:38] Finished 'create-readme' after 71 ms
[gulp-load-plugins] cat README.md
# My read me

Foo : foo!
Bar : bar!
```

##### Loading external defaults
Our gulp file

```js
// ./examples/external-defaults/gulpfile.js

var gulp = require('gulp'),
  path = require('path');

var taskLoader = require('gulp-commonjs-tasks/task-loader');

var defaults = require('./defaults.json');

var currentTasks = taskLoader.load(path.resolve(__dirname, 'tasks'), gulp, defaults);

currentTasks.addHelpTask();

```

A bit of json containing the defaults

```js
// ./examples/external-defaults/defaults.json

{
  "foo": "Foo value",
  "bar": "Bar value"
}

```

Our task module

```js
// ./examples/external-defaults/tasks/external.js

module.exports = function (gulp, defaults) {
  var tasks = {
    'external': {
      fn: function () {
        console.log('External defaults', defaults);
      },
      description: 'Displays external defaults'
    }
  };

  return tasks;
};

```
