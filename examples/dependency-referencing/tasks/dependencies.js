module.exports = function (gulp) {

  var tasks = {
    'second': {
      dep: [firstTask, 'otherTask', function () {
        console.log('anonymous task');
      }],
      fn: lastTask,
      description: 'My second task'
    },
    'otherTask': {
      fn: otherTask
    }
  };

  return tasks;

  function firstTask(done) {
    console.log('firstTask');
    done();
  }

  function lastTask(done) {
    console.log('lastTask');
    done();
  }

  function otherTask(done) {
    console.log('other task');
    done();
  }
};
