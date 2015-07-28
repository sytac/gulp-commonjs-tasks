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
