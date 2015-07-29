[ ![Codeship Status for sytac/gulp-commonjs-tasks](https://codeship.com/projects/7296a1a0-1788-0133-a70a-6a93520ab972/status?branch=master)](https://codeship.com/projects/93633)

# gulp-commonjs-tasks
_Gulp tasks as CommonJS modules_

## Why?
Because large gulpfiles are a pain and CommonJS modules are fine for managing gulp tasks.

### Features
- Gulp tasks as CommonJS modules.
- Pass as many arguments as you need to your modules.
- Built-in [run-sequence](https://www.npmjs.com/package/run-sequence) for more fine grained control over sequences.
- Anonymous dependencies and sequences, no need to create a gulp task for every dependent or sequential task.
- Inheritance of optional task params.
- Self documenting tasks on the command line.
- Plays well with [gulp-load-plugins](https://www.npmjs.com/package/gulp-load-plugins).

### Installation
Install `gulp` and `gulp-commonjs-tasks` dependencies.

```bash
$ npm install --save-dev gulp gulp-commonjs-tasks
```

### Examples

[Detailed examples on features](docs/example-overview.md) can be found in [./docs](docs/example-overview.md). The actual examples can be found in the `./examples` directory.


## API

[API details](docs/api.md) can be found in [./docs/api/md](docs/api.md).

#### Gulp tasks as CommonJS modules

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

### A more elaborate example

We can also add optional command line parameters. Handling these are your own responsibility, a simple way is using [gulp-util](https://github.com/gulpjs/gulp-util)'s `env` property.
Tasks with sequences or dependencies will inherit the optional parameters when calling the help task.

```js
// ./examples/options/tasks/options.js

module.exports = function (gulp) {

  var gutil = require('gulp-util');

  var tasks = {
    'first': {
      fn: firstTask,
      description: 'Shows info about this task',
      options: {
        '-f, --foo': 'Foo option'
      }
    },
    'second': {
      fn: secondTask,
      description: 'Show info about the second task',
      options: {
        '-b, --bar': 'Bar option'
      }
    },
    'third': {
      fn: thirdTask,
      seq: ['first', 'second'],
      description: 'Info about third task',
      options: {
        '-s, --snafu': 'Snafu option'
      }
    },
    'fourth': {
      fn: fourthTask,
      dep: ['third'],
      description: 'Info about fourth task',
      options: {
        '-p, --pebkac': 'Pebkac option'
      }
    }
  };

  return tasks;

  function firstTask() {
    var option = gutil.env.f || gutil.env.foo;

    console.log('first option: f/foo', option);
  }

  function secondTask() {
    var option = gutil.env.b || gutil.env.bar;

    console.log('second option: b/bar', option);
  }

  function thirdTask() {
    var option = gutil.env.s || gutil.env.snafu;

    console.log('third option: s/snafu', option);
  }

  function fourthTask() {
    var option = gutil.env.p || gutil.env.pebkac;

    console.log('fourth option: p/pebkac', option);
    console.log('All options', gutil.env);
  }
};

```

```bash
[19:35:22] Starting 'help'...
help Usage
  gulp task [ option ... ]
Tasks
  help     : Show help
    -a, --all            : Also show tasks without descriptions
  first    : Shows info about this task
    -o, --option     : Some option
  second   : Show info about the second task
    -m, --more       : Another option
  third    : Info about third task
    -o, --option     : Some option
    -m, --more       : Another option
    -e, --evenmore   : And another option
  fourth   : Info about fourth task
    -e, --evenmore   : And another option
    -o, --option     : Some option
    -m, --more       : Another option
    -f, --foo        : And another option
```

For subjects like sequences, dependencies, promises, and more head over to [./docs/](docs/example-overview)!
