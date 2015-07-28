module.exports = function (gulp, $) {
  var tasks = {
    'create-readme': {
      fn: function () {
        return gulp.src('./templates/README.md')
          .pipe($.template({
            foo: 'foo!',
            bar: 'bar!'
          }))
          .pipe(gulp.dest('./'));
      },
      description: 'Create readme file'
    }
  };

  return tasks;
};
