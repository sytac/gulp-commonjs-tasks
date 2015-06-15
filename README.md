[![Build Status](https://travis-ci.org/sytac/gulp-cjs-tasks.svg)](https://travis-ci.org/sytac/gulp-cjs-tasks)

[ ![Codeship Status for sytac/gulp-cjs-tasks](https://codeship.com/projects/67d81b70-c65a-0132-5355-3297e6cd1d5c/status?branch=master)](https://codeship.com/projects/74623)



# gulp-cjs-tasks

*Create gulp tasks using commonjs conventions*

## Why?

Because large gulpf files are a pain, are hard to test and commonjs is a fine 
pattern for creating tasks.

### Extras

- Built in [run-sequence](https://www.npmjs.com/package/run-sequence) for more fine grained control over sequences.
- Anonymous dependencies, no need to create a gulp task for every dependent or sequenced task.
- Self documenting tasks on the command line.
- Inheritence of optional task params.
- Availability of task graph for your own needs.


## Installation

Install `gulp` and `gulp-cjs-tasks` dependencies.

```bash
$ npm install --save-dev gulp
$ npm install --save-dev gulp-cjs-tasks
```

## Usage

Create a new `npm` based project first. If you already have that, you can skip this step.

```bash
$ mkdir project
$ cd project
$ npm init
```

Create a `gulpfile.js` file and add the following:

```js
var gulp = require('gulp');
var taskLoader = require('gulp-cjs-tasks/task-loader');

taskLoader(__dirname + '/tasks', gulp);
```

Create a `./tasks` directory, this is where you tasks will go. If you'd like your tasks
in a different directory, make sure you set path reference in the gulpfile accordingly.

```bash
$ mkdir tasks
```

## Examples

For examples, take a look at [the example repository](https://github.com/sytac/gulp-cjs-tasks-examples)

## Usage
This library consists of the following modules:

- `task-loader` - A gulp task loader which loads all tasks from a given path
- `task-info` - Utility for creating help on the CLI and help documentation

## task-loader

I'm assuming you know what a gulp task looks like, if not take a look [here](https://github.com/gulpjs/gulp/blob/v3.8.11/docs/API.md#gulptaskname-deps-fn) first.

For brevity I will have all tasks take in a callback throughout the examples. Returning promises and streams will work fine as well.

### Complete specification

Consider the following task loader:

```js
taskLoader(__dirname + '/tasks', gulp, anArgument, anotherArgument);

```

The only mandatory argument here is the first argument, which is expected to be `gulp` object. All following arguments are optional and are passed along to the task modules.

A conceptual full fledged task module would look like this:


```js

// A reference to your gulp object
// make sure you pass it along from your gulpfile
module.exports = function (gulp, anArgument, anotherArgument){

	var tasks = {

		// the task name
		'first-task' : {

			// the task function
			fn : firstTask,

			// task dependencies
			dep : ['dep-1', 'dep-2'],

			// task sequence using run-sequence
			seq : ['dep-3', ['dep-4', 'dep-5']],

			// wether it is the default task
			isDefault : true,

			// help description
			description : 'My fine task',

			// help options
			options : {
				'--option1' : 'An optional argument'
			},

			// priority in help overview
			priority : 100
		}
	};

	return tasks;

	function firstTask (done) {
		done();
	}
};
```

This Commonjs module returns a function which takes in the `gulp` object as an argument. This argument is needed to access gulp tasks in other task files. It is not mandatory, but if you'd like to use `gulp.src()` for instance, you need it.

After calling the returned function it will return an object which should consists of keys for task names and values for task definitions.

### Short hand specification
In this case the task name will be derived from the filename.
If this file would be called `foo.js` the task name will
be `foo`.

#### Exporting an object

```js
// tasks/exporting-an-object.js
module.exports = {
	'exported-as-object' : function (done) {
		console.log('exporting-an-object');
		done();
	}
};
```

#### Exporting a function which returns a function

Exporting a function wich returns a function will result in a task named after the base name of the file without the file extension. In this case `exporting-a-function`.

```js
// tasks/exporting-a-function.js
module.exports = function(gulp) {
  return function(done) {
    console.log('exporting-a-function');
    done();
  };
};
```

#### Exporting a function which returns an object.

The regular flavor, since you have access to the shared gulp object and all other arguments passed to the task loader.

```js
// tasks/generic.js
module.exports = function(gulp) {

  return {
    'generic': {
      fn: regularTask
    }
  };

  function regularTask(done) {
    console.log('generic');
    done();
  }
};
```

### The task object

Task objects come in key value pairs. The values can be organized like so:

```js
{
	// function value
	'foo' : function(){},
	// object value
	'bar' : {
		fn : function(){}
	}
}
```


#### Exporting

```js
module.exports = function (gulp) {
	return {
		'foo' : function (done) {
			done();
		}
	};
}
```
## task-info

```js
var taskInfo = require('gulp-cjs-tasks/task-info')(gulp);

// Shows help on the console
taskInfo();
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
