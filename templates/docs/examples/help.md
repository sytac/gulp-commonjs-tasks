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
