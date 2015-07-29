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
