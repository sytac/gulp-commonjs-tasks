[ ![Codeship Status for sytac/gulp-commonjs-tasks](https://codeship.com/projects/7296a1a0-1788-0133-a70a-6a93520ab972/status?branch=master)](https://codeship.com/projects/93633)

# gulp-commonjs-tasks
_Gulp tasks as CommonJS modules_

## Why?
Because large gulpfiles are a pain, CommonJS modules are fine for managing gulp tasks.

### Features
- Gulp tasks as CommonJS modules.
- Pass as many arguments as you need to your modules.
- Built-in [run-sequence](https://www.npmjs.com/package/run-sequence) for more fine grained control over sequences.
- Anonymous dependencies and sequences, no need to create a gulp task for every dependend or sequenced task.
- Inheritance of optional task params.
- Self documenting tasks on the command line.
- Plays well with [gulp-load-plugins](https://www.npmjs.com/package/gulp-load-plugins).

### Installation
Install `gulp` and `gulp-commonjs-tasks` dependencies.

```bash
$ npm install --save-dev gulp gulp-commonjs-tasks
```

### Running the examples

In order to use a reference to this library we need to link it into `node_modules`.

```bash
$ gulp prepare
```

### Usage
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

#### Help

##### Description

As you probably have noticed by now, you can add a `description` property for every task. It can be used by the help task to provide some valuable information of what the task should do.

```js
// ./examples/description/tasks/description.js

module.exports = function (gulp) {

  var tasks = {
    'info': {
      fn: firstTask,
      description: 'Shows info about this task'
    },
    'second-task': {
      fn: secondTask,
      description: 'Shows info about the second task',
      options: {
        '-f, --foo': 'Some stuff'
      }
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

##### Options

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

## API

```js
var cjsTasks = require('gulp-commonjs-tasks');
var taskLoader = cjsTasks.taskLoader;
var taskInfo = cjsTasks.taskInfo;
```

### taskLoader

You can also retrieve this object directly.

```js
var taskLoader = require('gulp-commonjs-tasks/task-loader');
```

#### taskLoader.load(taskDir, gulp, args...)

The return value of `taskLoader.load()` is an object which contains the following keys.

```js
{
  taskNames: [ list of task names ],
  defaultTaskNames: [ list of default task names ],
  addHelpTask: [ adds a help task ],
  taskTree: [Function: returns all tasks ],
  cliHelp: [Function: returns formatted help string ]
}
```

### taskInfo

You can also retrieve this object directly.

```js
var taskInfo = require('gulp-commonjs-tasks/task-info');
```

#### taskInfo(gulp)

```js
{
  cliHelp: [Function: returns formatted help string ],
  taskTree: [Function: returns all tasks ]
}
```

##### cliHelp(options)

```js
{
  a : [ boolean: wether or not to display tasks without descriptions ],
  all : [ boolean: wether or not to display tasks without descriptions ]
}
```

##### taskTree()

Returns flattened tree of all tasks.
