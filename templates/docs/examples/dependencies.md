#### Dependencies
Let's take a closer look at the `gulp.task` function.

```js
gulp.task('second', ['first'], function (done){
  console.log('second');
  done();
});

gulp.task('first', function (done) {
  console.log('first');
  done();
});
```

If we run task `second`, then task `first` will be executed first.

In our module format we add a `dep` property to provide the same functionality.

<%= examples.dependencies.tasks.dependencies %>

#### Referencing dependencies

Instead of creating a task for every dependency we can also reference functions.

<%= examples.dependencyReferencing.tasks.dependencies %>
