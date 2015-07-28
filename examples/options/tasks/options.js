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
