### tasks/help.js

You can automatically create a help task by `task-info`. See the `gulpfile.js` in the root of this project. The part that does the dirty work is this:

```js

var taskInfo = require('gulp-cjs-tasks/task-info');

taskInfo(gulp)
  .addHelpTask();

```

The `taskInfo` module factory will take the `gulp` object as an argument, and will
return an object.

```js
{
  addHelpTask: addHelpTask,
  cliHelp: cliHelp,
  getTasks: getTasks
}
```

Function | Description
---------- | -------------
addHelpTask | The start date is after end date.
cliHelp | The start date is before the current date.
getTasks | The start date is before the current date.


#### addHelpTask

#### cliHelp

#### getTasks


<%= js.tasks.help %>
