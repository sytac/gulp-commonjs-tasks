module.exports = function (gulp, defaults) {
  var tasks = {
    'external': {
      fn: function () {
        console.log('External defaults', defaults);
      },
      description: 'Displays external defaults'
    }
  };

  return tasks;
};
