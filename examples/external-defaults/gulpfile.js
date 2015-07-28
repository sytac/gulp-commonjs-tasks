var gulp = require('gulp'),
  path = require('path');

var taskLoader = require('gulp-commonjs-tasks/task-loader');

var defaults = require('./defaults.json');

var currentTasks = taskLoader.load(path.resolve(__dirname, 'tasks'), gulp, defaults);

currentTasks.addHelpTask();
