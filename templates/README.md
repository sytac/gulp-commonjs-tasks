[ ![Codeship Status for sytac/gulp-commonjs-tasks](https://codeship.com/projects/7296a1a0-1788-0133-a70a-6a93520ab972/status?branch=master)](https://codeship.com/projects/93633)

# gulp-commonjs-tasks
_Gulp tasks as CommonJS modules_

## Why?
Because large gulpfiles are a pain and CommonJS modules are fine for managing gulp tasks.

### Features
- Gulp tasks as CommonJS modules.
- Pass as many arguments as you need to your modules.
- Built-in [run-sequence](https://www.npmjs.com/package/run-sequence) for more fine grained control over sequences.
- Anonymous dependencies and sequences, no need to create a gulp task for every dependent or sequential task.
- Inheritance of optional task params.
- Self documenting tasks on the command line.
- Plays well with [gulp-load-plugins](https://www.npmjs.com/package/gulp-load-plugins).

### Installation
Install `gulp` and `gulp-commonjs-tasks` dependencies.

```bash
$ npm install --save-dev gulp gulp-commonjs-tasks
```

### Examples

[Detailed examples on features](docs/example-overview.md) can be found in [./docs](docs/example-overview.md). The actual examples can be found in the `./examples` directory.


## API

[API details](docs/api.md) can be found in [./docs/api/md](docs/api.md).

#### Gulp tasks as CommonJS modules

Create a `gulpfile.js` file and add the following:

<%= examples.commonjs.gulpfile %>

Now let's create a module in `./tasks` and call it `simple.js`

<%= examples.commonjs.tasks.simple %>

The CommonJS module above returns a function which takes in the `gulp` object as an argument. This argument is needed to access gulp tasks in other task files. It is not mandatory, but if you'd like to use `gulp.src()` for instance, you need it.

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

### A more elaborate example

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

For subjects like sequences, dependencies, promises, and more head over to [./docs/](docs/example-overview)!
