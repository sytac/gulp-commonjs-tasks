module.exports = function (gulp, defaults, moreDefaults) {
  var tasks = {
    'multiple': {
      fn: function () {
        console.log('second argument', defaults);
        console.log('third argument', moreDefaults);
      }
    }
  };

  return tasks;
};
