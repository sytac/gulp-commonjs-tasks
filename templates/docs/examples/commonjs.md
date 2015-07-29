#### Gulp tasks as CommonJS modules
Here's an example of your regular average gulpfile with some arbitrary tasks, a help task and a default task.

<%= examples.straightGulp.gulpfile %>

Let's try create the same with a CommonJS module.

Create a `gulpfile.js` file and add the following:

<%= examples.commonjs.gulpfile %>

Now let's create a module in `./tasks` and call it `simple.js`

<%= examples.commonjs.tasks.simple %>

The CommonJS module above returns a function which takes in the `gulp` object as an argument. This argument is needed to access gulp tasks in other task files. It is not mandatory, but if you'd like to use `gulp.src()` for instance, you need it.

```bash
[gulp-commonjs-tasks-examples] cd examples/straight-gulp
[straight-gulp] gulp
[07:08:10] Using gulpfile ~/temp/gulp-commonjs-tasks-examples/examples/straight-gulp/gulpfile.js
[07:08:10] Starting 'help'...
first-task My first task
second-task My second task
[07:08:10] Finished 'help' after 156 μs
[07:08:10] Starting 'default'...
[07:08:10] Finished 'default' after 7.22 μs
```

```bash
[gulp-commonjs-tasks-examples] cd examples/commonjs
[commonjs] gulp
[07:06:08] Using gulpfile ~/gulp-commonjs-tasks-examples/examples/commonjs/gulpfile.js
[07:06:08] Starting 'help'...
help Usage
  gulp task [ option ... ]
Tasks
  help          : Show help
    -a, --all   : Also show tasks without descriptions
  first-task    : My first task
  second-task   : My second task
[07:06:08] Finished 'help' after 1.87 ms
[07:06:08] Starting 'default'...
[07:06:08] Finished 'default' after 17 μs
```
