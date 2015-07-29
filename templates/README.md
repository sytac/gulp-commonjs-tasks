[ ![Codeship Status for sytac/gulp-commonjs-tasks](https://codeship.com/projects/7296a1a0-1788-0133-a70a-6a93520ab972/status?branch=master)](https://codeship.com/projects/93633)

# gulp-commonjs-tasks
_Gulp tasks as CommonJS modules_

## Why?
Because large gulpfiles are a pain, CommonJS modules are fine for managing gulp tasks.

### Features
- Gulp tasks as CommonJS modules.
- Pass as many arguments as you need to your modules.
- Built-in [run-sequence](https://www.npmjs.com/package/run-sequence) for more fine grained control over sequences.
- Anonymous dependencies and sequences, no need to create a gulp task for every dependend or sequenced task.
- Inheritance of optional task params.
- Self documenting tasks on the command line.
- Plays well with [gulp-load-plugins](https://www.npmjs.com/package/gulp-load-plugins).

### Installation
Install `gulp` and `gulp-commonjs-tasks` dependencies.

```bash
$ npm install --save-dev gulp gulp-commonjs-tasks
```

### Running the examples

In order to use a reference to this library we need to link it into `node_modules`.

```bash
$ gulp prepare
```

### Usage

[commonjs](docs/examples/commonjs.md)
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

#### Argument passing
Passing arguments to each gulp task module is easy.

##### Passing multiple arguments
In our gulp file we'll pass on `defaults` and `moreDefaults`.

<%= examples.passingMultipleArguments.gulpfile %>

In the task module `defaults` and `moreDefaults` are picked up.

<%= examples.passingMultipleArguments.tasks.multiple %>

##### Passing a gulp plugin loader
The example above is not of much use in the real world, but passing on something like [gulp-load-plugins](https://www.npmjs.com/package/gulp-load-plugins) does make sense.

We pass on `gulp-load-plugins` as `$`.

<%= examples.gulpLoadPlugins.gulpfile %>

And we use it in a task to use `gulp-template`.

<%= examples.gulpLoadPlugins.tasks.readme %>

```bash
[gulp-load-plugins] gulp create-readme
[11:39:38] Using gulpfile ~/temp/gulp-commonjs-tasks-examples/examples/gulp-load-plugins/gulpfile.js
[11:39:38] Starting 'create-readme'...
[11:39:38] Finished 'create-readme' after 71 ms
[gulp-load-plugins] cat README.md
# My read me

Foo : foo!
Bar : bar!
```

##### Loading external defaults
Our gulp file

<%= examples.externalDefaults.gulpfile %>

A bit of json containing the defaults

<%= examples.externalDefaults.defaults %>

Our task module

<%= examples.externalDefaults.tasks.external %>

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


#### Sequences

I don't know about you but if you want to have some control of when tasks will be executed you'll end up using something like `run-sequence` to avoid the mess of chaining tasks together.


##### Introducing run-sequence

Using [run-sequence](https://www.npmjs.com/package/run-sequence) we can run tasks in sequence rather than all at once before running a task.

Here we have three tasks which are run in order by the `all` task. A `fn` property is not needed, but if you add it, it will executed when the sequence is done.

<%= examples.sequences.tasks.sequence %>

##### Referencing sequences

We are not bound to handing task names in the `seq` array. We can also use function names or anonymous functions.

<%= examples.sequenceReferencing.tasks.sequence %>

We can also mix the type of objects a sequence array can take.

<%= examples.sequenceMixedReferencing.tasks.sequence %>

#### Help

##### Description

As you probably have noticed by now, you can add a `description` property for every task. It can be used by the help task to provide some valuable information of what the task should do.

<%= examples.description.tasks.description %>

##### Options

We can also add optional command line parameters. Handling these are your own responsibility, a simple way is using [gulp-util](https://github.com/gulpjs/gulp-util)'s `env` property.
Tasks with sequences or dependencies will inherit the optional parameters when calling the help task.

<%= examples.options.tasks.options %>

```bash
[19:35:22] Starting 'help'...
help Usage
  gulp task [ option ... ]
Tasks
  help     : Show help
    -a, --all            : Also show tasks without descriptions
  first    : Shows info about this task
    -o, --option     : Some option
  second   : Show info about the second task
    -m, --more       : Another option
  third    : Info about third task
    -o, --option     : Some option
    -m, --more       : Another option
    -e, --evenmore   : And another option
  fourth   : Info about fourth task
    -e, --evenmore   : And another option
    -o, --option     : Some option
    -m, --more       : Another option
    -f, --foo        : And another option
```

## API

```js
var cjsTasks = require('gulp-commonjs-tasks');
var taskLoader = cjsTasks.taskLoader;
var taskInfo = cjsTasks.taskInfo;
```

### taskLoader

You can also retrieve this object directly.

```js
var taskLoader = require('gulp-commonjs-tasks/task-loader');
```

#### taskLoader.load(taskDir, gulp, args...)

The return value of `taskLoader.load()` is an object which contains the following keys.

```js
{
  taskNames: [ list of task names ],
  defaultTaskNames: [ list of default task names ],
  addHelpTask: [ adds a help task ],
  taskTree: [Function: returns all tasks ],
  cliHelp: [Function: returns formatted help string ]
}
```

### taskInfo

You can also retrieve this object directly.

```js
var taskInfo = require('gulp-commonjs-tasks/task-info');
```

#### taskInfo(gulp)

```js
{
  cliHelp: [Function: returns formatted help string ],
  taskTree: [Function: returns all tasks ]
}
```

##### cliHelp(options)

```js
{
  a : [ boolean: wether or not to display tasks without descriptions ],
  all : [ boolean: wether or not to display tasks without descriptions ]
}
```

##### taskTree()

Returns flattened tree of all tasks.
