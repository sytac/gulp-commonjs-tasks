# gulp-cjs-tasks

*Create gulp tasks using commonjs conventions*


## Usage

```js

// gulpfile.js
var gulp = require('gulp')
    taskLoader = require('gulp-cjs-tasks/task-loader');

var taskNames = taskLoader(__dirname + '/lib/tasks', gulp);

console.log('Added tasks', taskNames);


```


```js

// ./lib/tasks/foo.js
module.exports = function (gulp){
	return fooTask;
};

function fooTask(done){
	done();
}

```
