var assign = require('lodash/object/assign'),
    flatten = require('lodash/array/flatten'),
    lang = require('lodash/lang'),
    padRight = require('lodash/string/padRight'),
    pretty = require('js-object-pretty-print')
    .pretty,
    sortBy = require('lodash/collection/sortBy'),
    string = require('lodash/string');
var util = require('gulp-util');

var _widths;
var _parsedTasks;

module.exports = function(gulp) {
    var help = {
        parseTasks: parseTasks,
        tasks: tasks,
        show: show
    };

    return help;

    function parseTasks(gulpTasks) {
        _widths = {
            main: 0,
            sub: 0
        };
        _parsedTasks = {};

        var tasks = sortBy(Object.keys(
                gulpTasks)
            .map(function(taskName) {
                var task = _parseTask(gulpTasks[
                    taskName]);
                _parsedTasks[taskName] = task;
                return task;
            }),
            function(task) {
                var priority = task.priority ? 0 - task.priority :
                    0;
                return priority;
            });



        tasks.forEach(function(task) {
            task.inheritedOptionalHelp =
                _traverseOptionalHelp(task);
            task.fullOptionalHelp = assign({}, task
                .optionalHelp, task.inheritedOptionalHelp
            );

            var help = {};
            if (task.help) {

                help[''] = task.help[''];
                task.fullHelp = assign(help, task
                    .fullOptionalHelp
                );
            }
        });

        return tasks;
    }

    function _findTask(taskName) {
        return _parsedTasks[taskName];
    }

    function tasks() {
        return parseTasks(gulp.tasks);
    }

    function show() {
        var tasks = parseTasks(gulp.tasks);

        console.log(util.colors.bold('Usage'));
        console.log('  gulp ' + util.colors.cyan('task') + ' [ ' + util
            .colors
            .green(
                'option ...') + ' ]' + '\n');
        console.log(util.colors.bold('Tasks'));

        tasks.filter(function(task) {
                return task.help;
            })
            .forEach(function(task) {
                Object.keys(task.fullHelp)
                    .forEach(function(helpKey) {
                        var helpValue = task.fullHelp[helpKey];
                        if (helpKey === '') {
                            console.log('  ' + util.colors.cyan(
                                    padRight(task.name,
                                        _widths.main +
                                        2)) + ' : ' +
                                helpValue);
                        } else {
                            console.log('    ' + util.colors.green(
                                    padRight(helpKey,
                                        _widths.sub +
                                        2)) + ' : ' +
                                helpValue);
                        }
                    });
            });

    }
};


function _parseTask(task) {
    return lang.cloneDeep(task, function(value) {

        if (lang.isObject(value)) {
            if (lang.isString(value.help)) {
                value.help = {
                    '': value.help
                }
            }
            if (lang.isObject(value.help)) {
                value.optionalHelp = assign.apply(null, [{}]
                    .concat(Object.keys(value.help)
                        .filter(function(helpArgument) {
                            if (helpArgument === '') {
                                _widths.main = _widths.main <
                                    value.name.length ?
                                    value.name.length :
                                    _widths.main;
                            } else {
                                _widths.sub = _widths.sub <
                                    helpArgument.length ?
                                    helpArgument.length :
                                    _widths.sub;
                            }
                            return helpArgument !==
                                '';
                        })
                        .map(function(helpArgument) {
                            var helpOption = {};
                            helpOption[helpArgument] =
                                value.help[
                                    helpArgument];
                            return helpOption;
                        })));
            }
        }

        return value;
    });
}


function _traverseOptionalHelp(task) {
    var optionalHelp = {};
    var allDeps = [];
    if (task.dep && task.dep.length) {
        allDeps.push(task.dep);
    }
    if (task.seq && task.seq.length) {
        allDeps.push(task.seq);
    }
    if (allDeps.length) {
        var a = flatten(allDeps, true);

        return assign.apply(null, [optionalHelp].concat(a.filter(function(
                dep) {
                return _parsedTasks[dep] && _parsedTasks[dep].optionalHelp;
            })
            .map(function(dep) {
                var depTask = _parsedTasks[dep];

                return assign({}, depTask.optionalHelp,
                    _traverseOptionalHelp(
                        depTask));
            })));
    }

    return optionalHelp;


}
