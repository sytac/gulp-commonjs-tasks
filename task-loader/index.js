'use strict';

var assign = require('lodash/object/assign'),
  fs = require('fs'),
  gutil = require('gulp-util'),
  lang = require('lodash/lang'),
  path = require('path'),
  util = require('util');

var _task;
var runSequence;

module.exports = {
  load: load,
  context: {}
};

function load(taskDir, gulp) {
  runSequence = require('run-sequence')
    .use(gulp);
  if (arguments.length < 2) {
    throw 'Expecting at least two arguments: taskDir and gulp';
  }

  // let's first catch all the arguments here
  var args = Array.prototype.slice.apply(arguments);

  // let's add a state object we need to haul with the parser
  var state = {
    defaultTaskNames: [],
    sequenceCount: 0
  };

  args.unshift(state);

  var taskNames = [];

  _task = function () {
    var taskArgs = Array.prototype.slice.apply(arguments);
    taskNames.push(taskArgs[0]);
    return gulp.task.apply(gulp, taskArgs);
  };

  _parse.apply(this, args);

  if (state.defaultTaskNames.length) {
    _task('default', state.defaultTaskNames);
  }

  var taskInfo = require('../task-info')(gulp);
  assign(module.exports.context, {
    taskNames: taskNames,
    defaultTaskNames: state.defaultTaskNames,
    addHelpTask: addHelpTask.bind(this, gulp, taskInfo),
    taskTree: taskInfo.taskTree,
    cliHelp: taskInfo.cliHelp.bind(this, gutil.env)
  });

  return module.exports.context;
}

function addHelpTask(gulp, taskInfo, options) {
  options = options || {};

  gulp.task('help', function () {
    console.log('help', taskInfo.cliHelp(gutil.env, options));
  });

  gulp.tasks.help.description = 'Show help';
  gulp.tasks.help.options = {
    '-a, --all': 'Also show tasks without descriptions'
  };

  gulp.tasks.help.priority = !lang.isUndefined(options.priority) ?
    options.priority : 0;
  if (lang.isUndefined(options.isDefault) || options.isDefault === true) {
    var defaultTask = gulp.tasks.default;
    if (defaultTask) {
      defaultTask.dep.push('help');
    } else {
      gulp.task('default', ['help']);
    }
  }
}

function _parse(state, taskDir, gulp) {
  taskDir = path.resolve(taskDir);

  var customOptions = ['usage',
    'description',
    'seq',
    'options',
    'isDefault'
  ];

  var args = Array.prototype.slice.call(arguments)
    .splice(2);

  var currentPriority = -10;

  // get all tasks
  // todo: clean up this mess
  fs.readdirSync(taskDir)
    .map(function (file) {
      var fullPath = taskDir + path.sep + file;
      var stats = fs.statSync(fullPath);
      if (stats.isFile() && path.extname(file) === '.js') {
        var tasks;
        var moduleId = path.join(taskDir, file);
        var requiredTasks = require(moduleId);
        module.children.forEach(function (childModule) {
          if (moduleId === childModule.id) {
            childModule.tasksContext = module.exports.context;
          }
        });

        if (lang.isFunction(requiredTasks)) {
          tasks =
            requiredTasks.apply(null, args);
          if (lang.isFunction(tasks)) {
            var taskFn = tasks;
            var taskName = path.basename(file, '.js');
            tasks = {};
            tasks[taskName] = {
              fn: taskFn
            };
          }
        } else {
          tasks = requiredTasks;
        }
        // let's assume it's an object
        if (lang.isObject(tasks)) {
          Object.keys(tasks)
            .map(function (taskName2) {
              var task = tasks[taskName2];

              var taskArgs = [taskName2];
              if (lang.isFunction(task)) {
                taskArgs.push([]);
                taskArgs.push(task);
              } else if (lang.isObject(task)) {

                // Check for default tasks
                _defaultTasks(gulp, taskName2, task, state);

                // sequences
                _sequences(gulp, taskName2, task, state);

                // dependencies
                var deps = [];
                var depIndex = 1;
                var anonCount = 0;
                if (lang.isArray(task.dep)) {
                  task.dep.map(function (taskDep) {
                    var dep = taskDep;
                    if (lang.isFunction(taskDep)) {
                      var fnName = _getFunctionName(taskDep);
                      if (!fnName) {
                        anonCount++;
                        fnName = util.format('anonymous-%s',
                          anonCount);
                      }
                      var depName = util.format(
                        '%s-(index: %s, fnName: %s)', taskName2,
                        depIndex, fnName);
                      _task.apply(gulp, [
                        depName, [],
                        taskDep
                      ]);
                      depIndex++;
                      dep = depName;
                    }
                    deps.push(dep);
                  });
                }
                taskArgs.push(deps);
                if (task.fn) {
                  taskArgs.push(task.fn);
                }
              } else if (lang.isArray(task)) {
                taskArgs.push(task);
              }

              if (taskArgs.length > 1) {
                _task.apply(gulp,
                  taskArgs);

                // priority
                if (task.description) {

                  var priority = task.priority;
                  if (!priority) {
                    priority = currentPriority;
                    currentPriority = currentPriority - 10;
                  }
                  gulp.tasks[taskName2].priority = priority;
                }
                gulp.tasks[taskName2].file = path.basename(file);
                gulp.tasks[taskName2].path = path.resolve(taskDir);
                customOptions.map(function (
                  customOption) {
                  var taskOption = task[
                    customOption];

                  if (taskOption) {

                    gulp.tasks[taskName2]
                      [
                        customOption
                      ] = taskOption;
                  }
                });
              }
            });
        }
      }
    });
}

function _defaultTasks(gulp, taskName, task, state) {
  // default task(s)
  if (task.isDefault) {
    state.defaultTaskNames.push(taskName);
  }
}

function _sequences(gulp, taskName, task, state) {
  if (task.seq) {
    state.sequenceCount++;

    var localState = {
      seqIndex: 1,
      anonCount: 0
    };


    task.seq = _parseSequence(gulp, taskName, task.seq, state, localState);

    // If task does not have a function assigned then create one...
    if (!task.fn) {
      task.fn = function (done) {
        runSequence.apply(
          null, task.seq
          .concat(
            done));
      };

    } else {
      // ... otherwise chop it off, and place it in a new task at the very end
      // of the sequence. Yes I could monkey patch the task function but that's
      // a bit too ghetto I think.
      var subName = taskName + '-post';
      var origFn = task.fn;
      _task.apply(gulp, [
        subName, [],
        origFn
      ]);

      task.fn = function (done) {
        runSequence.apply(
          null, task.seq
          .concat(
            subName
          )
          .concat(
            done));
      };
    }
  }
}

function _parseSequence(gulp, taskName, seqTasks, state, localState) {

  return seqTasks.map(function (seqTask) {
    if (lang.isString(seqTask)) {
      return seqTask;
    } else if (lang.isFunction(seqTask)) {
      var fnName = _getFunctionName(seqTask);
      if (!fnName) {
        localState.anonCount++;
        fnName = util.format('anonymous-%s',
          localState.anonCount);
      }

      var seqName = util.format(
        '%s-(index: %s, fnName: %s)',
        taskName,
        localState.seqIndex, fnName);
      _task.apply(gulp, [
        seqName, [],
        seqTask
      ]);

      localState.seqIndex++;
      return seqName;
    } else if (lang.isArray(seqTask)) {
      state.sequenceCount++;
      return _parseSequence(gulp, taskName, seqTask, state, localState);
    }
  });
}


function _getFunctionName(fn) {
  var fnName = fn.toString();
  fnName = fnName.substr('function '.length);
  fnName = fnName.substr(0, fnName.indexOf('('));
  return fnName;
}
