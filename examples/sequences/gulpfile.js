var gulp = require('gulp');
var taskLoader = require('gulp-commonjs-tasks/task-loader');

// load tasks
var tasksContext = taskLoader.load('./tasks', gulp);

// Add the gulp help task
tasksContext.addHelpTask();
