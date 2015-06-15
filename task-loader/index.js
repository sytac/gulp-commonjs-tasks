var fs = require('fs'),
  lang = require('lodash/lang'),
  path = require('path'),
  util = require('util');

module.exports = function taskLoader(taskDir, gulp) {

  var customOptions = ['usage',
    'description',
    'seq',
    'options',
    'isDefault'
  ];

  var defaultTaskNames = [];

  var args = [];

  var sequenceCount = 0;
  var currentPriority = -10;

  if (arguments.length > 0) {
    args = Array.prototype.slice.call(arguments)
      .splice(1);
  }
  // get all tasks

  var runSequence = require('run-sequence')
    .use(gulp),
    taskNames = [];

  // todo: clean this mess up
  fs.readdirSync(taskDir)
    .map(function(file) {
      var stats = fs.statSync(taskDir + path.sep + file);
      if (stats.isFile() && path.extname(file) === '.js') {
        var tasks;
        var requiredTasks = require(taskDir + path.sep + file);
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
            .map(function(taskName) {
              var task = tasks[taskName];
              var taskArgs = [taskName];
              if (lang.isFunction(task)) {
                taskArgs.push([]);
                taskArgs.push(task);
              } else if (lang.isObject(task)) {
                if (task.isDefault) {
                  defaultTaskNames.push(taskName);
                }
                if (task.seq) {
                  sequenceCount++;
                  var sequence = [];
                  var seqIndex = 1;
                  var anonCount = 0;

                  var _p = function(seqTasks) {
                    return seqTasks.map(function(seqTask) {
                      if (lang.isString(seqTask)) {
                        return seqTask;
                      } else if (lang.isFunction(seqTask)) {
                        var fnName = _functionName(seqTask);
                        if (!fnName) {
                          anonCount++;
                          fnName = util.format('anonymous-%s',
                            anonCount);
                        }


                        var seqName = util.format(
                          '%s-(index: %s, fnName: %s)', taskName,
                          seqIndex, fnName);
                        gulp.task.apply(gulp, [
                          seqName, [],
                          seqTask
                        ]);

                        console.log(_functionName(seqTask));

                        seqIndex++;
                        return seqName;
                      } else if (lang.isArray(seqTask)) {
                        console.log('array', seqTask);
                        sequenceCount++;
                        return _p(seqTask);
                      }

                    });
                  }
                  task.seq = _p(task.seq);
                  if (!task.fn) {
                    task.fn = function(done) {
                      runSequence.apply(
                        null, task.seq
                        .concat(
                          done));
                    }
                  } else {
                    var subName = 'post-' +
                      taskName;
                    var origFn = task.fn;
                    gulp.task.apply(gulp, [
                      subName, [],
                      origFn
                    ]);

                    task.fn = function(done) {
                      runSequence.apply(
                        null, task.seq
                        .concat(
                          subName
                        )
                        .concat(
                          done));
                    }
                  }
                }
                var deps = [];
                var depIndex = 1;
                var anonCount = 0;
                if (lang.isArray(task.dep)) {
                  task.dep.map(function(taskDep) {
                    var dep = taskDep;
                    if (lang.isFunction(taskDep)) {
                      var fnName = _functionName(taskDep);
                      if (!fnName) {
                        anonCount++;
                        fnName = util.format('anonymous-%s',
                          anonCount);
                      }
                      var depName = util.format(
                        '%s-(index: %s, fnName: %s)', taskName,
                        depIndex, fnName);
                      gulp.task.apply(gulp, [
                        depName, [],
                        taskDep
                      ]);
                      depIndex++;
                      dep = depName;
                      console.log('--', depName);
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
                taskNames.push(taskArgs[0]);
                gulp.task.apply(gulp,
                  taskArgs);

                // priority
                if (task.description) {

                  var priority = task.priority;
                  if (!priority) {
                    priority = currentPriority;
                    currentPriority = currentPriority - 10;
                  }
                  gulp.tasks[taskName].priority = priority;
                }
                customOptions.map(function(
                  customOption) {
                  var taskOption = task[
                    customOption];

                  if (taskOption) {

                    gulp.tasks[taskName]
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

  if (defaultTaskNames.length) {
    gulp.task('default', defaultTaskNames);
  }
  return {
    taskNames: taskNames
  };
}

function _functionName(fun) {
  var ret = fun.toString();
  ret = ret.substr('function '.length);
  ret = ret.substr(0, ret.indexOf('('));
  return ret;
}
