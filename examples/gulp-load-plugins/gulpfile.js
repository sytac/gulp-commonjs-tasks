var gulp = require('gulp'),
  path = require('path'),
  $ = require('gulp-load-plugins')();

var taskLoader = require('gulp-commonjs-tasks/task-loader');

var tasks = taskLoader.load(path.resolve(__dirname, 'tasks'), gulp, $);

tasks.addHelpTask();
