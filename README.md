# gulp-cjs-tasks

*Create gulp tasks using commonjs conventions*

## Why?

- Large gulp files are a pain
- Ability to create self documenting tasks
- Commonjs is fine pattern for creating tasks
- Built-in sequences, rather than deps

## Usage

Initialize a new project:

```bash
$ npm init
```

Install this library:

```bash
$ npm install --save-dev gulp-cjs-tasks
```

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


### Help tasks

Create `./lib/tasks/help.js`:

```js

module.exports = function(gulp) {
    var helpUtils = require('gulp-cjs-tasks/help')(gulp);

    var tasks = {
        help: {
            fn: help,
            help: 'Show help'
        }
    };

    return tasks;

    function help() {
        helpUtils.show();
    }
}

```
