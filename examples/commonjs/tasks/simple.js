module.exports = function (gulp) {

  var tasks = {
    'first-task': {
      fn: firstTask,
      description: 'My first task'
    },
    'second-task': {
      fn: secondTask,
      description: 'My second task'
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
