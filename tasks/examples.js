'use strict';
var symlink = require('gulp-symlink');

module.exports = function (gulp) {
  var examples = {
    prepare: {
      fn: prepareTask,
      description: 'Prepares examples for usage'
    }
  };

  return examples;

  function prepareTask() {
    return gulp.src('./')
      .pipe(symlink('./node_modules/gulp-commonjs-tasks', {
        force: true
      }));
  }
};
