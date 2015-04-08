# gulp-cjs-tasks

*Create gulp tasks using commonjs conventions*


## Usage

Create your `gulpfile.js`

```js

// gulpfile.js
var gulp = require('gulp')
    taskLoader = require('gulp-cjs-tasks/task-loader');

var taskNames = taskLoader(__dirname + '/lib/tasks', gulp);

console.log('Added tasks', taskNames);


```

And create a task module in `./lib/tasks/foo.js`

```js

// ./lib/tasks/foo.js
module.exports = function (gulp){
	return fooTask;
};

function fooTask(done){
	console.log('Foo!');
	done();
}

```

Open a shell and fire your fine new `foo` task:

```bash
$ gulp foo
```



Would be roughly equivalent to

```js

gulp.task('foo', function(done){
	console.log('Foo!');
	done();
});
```