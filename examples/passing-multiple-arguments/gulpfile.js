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
