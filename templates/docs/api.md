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
  taskTree: [ Function: returns all tasks ],
  cliHelp: [ Function: returns formatted help string ]
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
  cliHelp: [ Function: returns formatted help string ],
  taskTree: [ Function: returns all tasks ]
}
```

##### cliHelp(options)

```js
{
  a: [ boolean: wether or not to display tasks without descriptions ],
  all: [ boolean: wether or not to display tasks without descriptions ]
}
```

##### taskTree()

Returns flattened tree of all tasks.
