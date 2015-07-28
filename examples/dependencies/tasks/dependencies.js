module.exports = function (gulp) {

  var tasks = {
    'first': {
      fn: firstTask,
      description: 'My first task'
    },
    'second': {
      dep: ['first'],
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
