# gulp-cjs-tasks

*Create gulp tasks using commonjs conventions*

## Why?

- Large gulp files are a pain
- Ability to create self documenting tasks
- Commonjs is a fine pattern for creating tasks
- Built-in sequences, rather than deps

## Installation

Create a new `npm` based project first. If you already have that, you can skip this step.

```bash
$ npm init
```

Install `gulp` and `gulp-cjs-tasks` dependencies.

```bash
$ npm install --save-dev gulp
$ npm install --save-dev gulp-cjs-tasks
```

Create a `gulpfile.js` file and add the following

```js
var gulp = require('gulp');
var taskLoader = require('gulp-cjs-tasks/task-loader');

taskLoader(__dirname + '/tasks', gulp);
```

Create a `./tasks` directory, this is where you tasks will go. If you'd like your tasks
in a different directory, make sure you path reference in the gulpfile accordingly.

```bash
$ mkdir tasks
```

## Examples
For examples, take a look at [the example repository](https://github.com/sytac/gulp-csj-tasks-example)

## Commonjs conventions as tasks

### Simple

Let's take a simple gulp task that does nothing but console.log something. Consider
something like this:

```js
gulp.task('foo', function(done){
    console.log('foo!');
    done();
});
```

If we dissect the above then we can conclude the following:

- we have a task name, in our case `foo`
- we have a function that will be executed once `gulp foo` is called
- we also have a callback function `done` that is called when the task is done


In this example the name of the task is derived from the filename: `foo.js`, where
the basename is `foo`, so our task name will be `foo`.

```js
// ./tasks/foo.js
module.exports = function() {
	return function(done) {
		console.log('foo!');
		done();
	};
};

```

Since you might have the need to group tasks in single file, you can also export
an object, in which each key is a task name, and each value is a task function.


```js
module.exports = {
    bar: function(done) {
        console.log('bar!');
        done();
    }
};

```

If you'd like to pass the `gulp` object for each task module, you can export a function
rather than an object:

```js
module.exports = function(gulp) {
    return {
        copy: function() {
            return gulp.src('./README.md')
                .pipe(gulp.dest('./README-copy.md'));
        }
    }
};


```

Or make it more nice and neat by hosting the task function:

```js

module.exports = function(gulp) {
    return {
        nicer: nicer
    };

    function nicer() {
        return gulp.src('./foo')
            .pipe(gulp.dest('./bar'));
    }
};



```

Let's add a task with a dependent task.

```js
gulp.task('first', function(done){
    console.log('first!');
    done();
});
gulp.task('second', ['first'], function(done){
    console.log('second!');
    done();
});

```

We can achieve this by specifying a task object containing a task function rather
than just a task function.

```js
module.exports = {
	first: first,
	second: {
		fn: second,
		dep: ['first']
	}
};

function first(done) {
	console.log('first!');
	done();
}

function second(done) {
	console.log('second!');
	done();
}

```

## Usage

This library consists of the following modules:

- `task-loader` - A gulp task loader which loads all tasks from a given path
- `help` - Utility for creating help on the CLI and help documentation

### `task-loader`

```js
var gulp = require('gulp');

var taskLoader = require('gulp-cjs-tasks/task-loader');

taskLoader(__dirname + '/tasks', gulp);
```

### `help`

```js
var helpUtils = require('gulp-cjs-tasks/help')(gulp);

// Shows help on the console
helpUtils.show();
```

```bash
Usage
  gulp task [ option ... ]

Tasks
  help                              : Show help
  one                               : Task one
  two                               : Task two
  three                             : Task three
  four                              : Task four
  one-then-two                      : Tasks one then two
  one-and-two-then-three            : Tasks one and two then three
  one-and-two                       : Tasks one and two
  one-and-two-then-three-and-four   : Tasks one and two then three and four
```
