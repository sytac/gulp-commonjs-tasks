module.exports = function (gulp) {

  var tasks = {
    'all': {
      seq: [firstTask, secondTask, thirdTask],
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
};
