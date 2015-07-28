module.exports = function (gulp) {

  var tasks = {
    'first': {
      fn: firstTask,
      description: 'My first task'
    },
    'all': {
      fn: lastTask,
      seq: ['first', secondTask, function(done){
        done();
      }],
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

  function lastTask(done) {
    done();
  }

};
