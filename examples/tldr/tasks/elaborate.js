module.exports = function(gulp, config, env, movieQuote) {

  var Q = require('q');

  var tasks = {
    // Since this task has no description, it will not show up when
    // typing gulp help
    'simplest': simplestTask,

    // This task will show up when gulp help is executed
    'simple': {
      fn: simpleTask,
      description: 'A very simple task'
    },

    'show-arguments': {
      fn: showArgumentsTask,
      description: 'Shows the arguments of the ./tasks/elaborate.js module'
    },

    'with-options': {
      fn: function() {},
      description: 'This task has one option',
      options: {
        '--first': 'The first option'
      }
    },

    'also-with-options': {
      fn: function() {},
      description: 'This task also has one option',
      options: {
        '--second': 'The second option'
      }
    },

    'inherited-options': {
      fn: function() {},
      seq: ['with-options', 'also-with-options'],
      description: 'This task has one option and two inherited options',
      options: {
        '--third': 'The third option'
      }
    },
    // This task is pretty important, so it should show up first when
    // gulp help is executed
    'important': {
      fn: importantTask,
      description: 'The most important task',
      // the help task priority is set to 1000
      // the priority order starts at 0, every subsequent task has
      // a lower priority.
      // 0, -1, -2, -3, -4 ...
      priority: 1000
    },

    // This task will run a series of task asynchronously. Once those are done
    // dependentTask will run.
    // Basically this boils down to
    // gulp.task('dependencies', ['dep-1', 'dep-2', 'dep-3'], ... );
    'dependencies': {
      fn: dependentTask,
      dep: ['dep-1', 'dep-2', 'dep-3'],
      description: 'A task with dependencies'
    },

    // A trio of dependencies
    'dep-1': dep1Task,
    'dep-2': dep2Task,
    'dep-3': dep3Task,

    'anon-dependencies': {
      fn: taskWithAnonymousDependencies,
      dep: [function(done) {
        console.log('anon task 1');
        done();
      }, function() {
        var deferred = Q.defer();
        console.log('anon task 2 started');
        setTimeout(function() {
          console.log('anon task 2 resolved');
          deferred.resolve();
        }, 1000);
        console.log('anon task 2 ended');
        return deferred.promise;
      }, function() {
        console.log('anon task 3 started');
        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            console.log('anon task 3 resolved');
            resolve();
          }, 1500);
          console.log('anon task 3 ended');
        });

      }],
      description: 'A task with anonymous dependencies'
    },

    // This task will kick of sequence of tasks.
    // first sequence-1-a and sequence-1-b will be executed in asynchronously.
    // When both are done sequence-2-a and sequence-2-b are executed asynchronously.
    // When both sub sequences are done afterSequence will be executed.
    'sequence': {
      fn: afterSequence,
      seq: [
        [sequence1a, 'sequence-1-a', function() {
          console.log('anon');
        }, function() {}, 'sequence-1-b'],
        ['sequence-2-a', 'sequence-2-b', function() {},
          function() {}
        ]
      ],
      description: 'A sequence of tasks'
    },

    // Task with timeout of 2000 ms
    'sequence-1-a': sequence1a,

    // Task with timeout of 100 ms
    'sequence-1-b': sequence1b,

    // Task without timeout
    'sequence-2-a': sequence2a,

    // Task without timeout
    'sequence-2-b': sequence2b
  };

  return tasks;

  function foobar(done) {
    console.log('foobar!');
    done();
  }

  function simplestTask() {
    console.log('The simplest task');
  }

  function simpleTask() {
    var t = require('gulp-commonjs-tasks/task-info');
    console.log(t(gulp).taskTree());

    console.log('Executing a simple task');
  }

  function importantTask() {
    console.log('Executing an important task');
  }

  function showArgumentsTask() {
    console.log('Show some arguments');
    console.log('config:', config);
    console.log('env:', env);
    console.log('movieQuote:', movieQuote);
  }

  // dependencies

  function dependentTask() {
    console.log('dependentTask started');
    console.log('dependentTask ended');
  }

  function taskWithAnonymousDependencies() {
    console.log('taskWithAnonymousDependencies started');
    console.log('taskWithAnonymousDependencies ended');
  }

  function dep1Task() {
    console.log('dep1Task started');
    console.log('dep1Task ended');
  }

  function dep2Task(done) {
    console.log('dep2Task started');
    setTimeout(function() {

      console.log('dep2Task ended');
      done();
    }, 100);
  }

  function dep3Task() {
    console.log('dep3Task started');
    console.log('dep3Task ended');
  }

  // sequence
  function afterSequence(done) {
    console.log('afterSequence');
    done();
  }

  function sequence1a(done) {
    setTimeout(function() {
      console.log('sequence-1-a');
      done();
    }, 2000);
  }

  function sequence2a(done) {
    console.log('sequence-2-a');
    done();
  }

  function sequence1b(done) {
    setTimeout(function() {
      console.log('sequence-1-b');
      done();
    }, 100);
  }

  function sequence2b(done) {
    console.log('sequence-2-b');
    done();
  }
};
