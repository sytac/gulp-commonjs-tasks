module.exports = function (gulp) {

  var tasks = {
    'first': {
      fn: firstTask,
      description: 'My first task'
    },
    'second': {
      fn: secondTask,
      description: 'My second task'
    },
    'third': {
      fn: thirdTask,
      description: 'My third task'
    },
    'all': {
      seq: ['first', 'second', 'third'],
      description: 'All three tasks'
    },
    'all-and-self': {
      fn: lastTask,
      seq: ['first', 'second', 'third'],
      description: 'All three tasks'
    }
  };

  return tasks;

  function firstTask(done) {
    done();
  }

  function secondTask(done) {
    done();
  }

  function thirdTask(done) {
    done();
  }

  function lastTask(done) {
    done();
  }
};
