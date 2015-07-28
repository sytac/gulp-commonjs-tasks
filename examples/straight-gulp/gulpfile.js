var gulp = require('gulp');

gulp.task('first-task', function (done) {
  done();
});

gulp.task('second-task', function (done) {
  done();
});

var help = {
  'first-task': 'My first task',
  'second-task': 'My second task'
};

gulp.task('help', function () {
  Object.keys(help).map(function (taskName) {
    console.log(taskName + ' ' + help[taskName]);
  });
});

gulp.task('default', ['help']);
