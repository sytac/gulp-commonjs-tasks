var assign = require('lodash/object/assign'),
	flatten = require('lodash/array/flatten'),
	lang = require('lodash/lang'),
	padRight = require('lodash/string/padRight'),
	sortBy = require('lodash/collection/sortBy'),
	string = require('lodash/string'),
	util = require('gulp-util');

var _widths;
var _parsedTasks;
var _tasks;

module.exports = function(gulp) {
	var help = {
		addHelpTask: addHelpTask,
		cliHelp: cliHelp,
		getTasks: getTasks
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
				return task.priority ? -task.priority : 0;
			});

		tasks.forEach(function(task) {
			task.inheritedOptionalOptions =
				_traverseOptionalOptions(task);
			task.fullOptionalOptions = assign({}, task
				.options, task.inheritedOptionalOptions
			);

			var help = {};
		});
		_tasks = tasks;
		return tasks;
	}

	function _findTask(taskName) {
		return _parsedTasks[taskName];
	}

	function getTasks() {
		return _tasks ? _tasks : parseTasks(gulp.tasks);
	}

	function cliHelp() {

		var list = [];

		var tasks = _tasks ? _tasks : parseTasks(gulp.tasks);

		list.push(util.colors.bold('Usage'));
		list.push('  gulp ' + util.colors.cyan('task') + ' [ ' + util
			.colors
			.green(
				'option ...') + ' ]' + '\n');
		list.push(util.colors.bold('Tasks'));

		tasks.filter(function(task) {
				return task.description;
			})
			.forEach(function(task) {
				list.push('  ' + task.priority + ' ' + util.colors.cyan(
						padRight(task.name,
							_widths.main +
							2)) + ' : ' +
					task.description);
				if (lang.isObject(task.fullOptionalOptions)) {
					Object.keys(task.fullOptionalOptions)
						.forEach(function(option) {

							list.push('    ' + util.colors.green(
									padRight(option,
										_widths.sub +
										2)) + ' : ' +
								task.fullOptionalOptions[
									option]
							);

						});
				}
			});
		return list.join('\n');
	}

	function addHelpTask(options) {
		options = options || {};

		gulp.task('help', function() {
			console.log(cliHelp());
		});

		gulp.tasks.help.description = 'Show help';

		gulp.tasks.help.priority = !lang.isUndefined(options.priority) ?
			options.priority : 0;
		if (lang.isUndefined(options.isDefault) || options.isDefault === true) {
			var defaultTask = gulp.tasks['default'];
			if (defaultTask) {

				defaultTask.dep.push('help');
			} else {
				gulp.task('default', ['help']);
			}
		}
	}
};


function _parseTask(task) {
	return lang.cloneDeep(task, function(value) {

		if (lang.isObject(value)) {
			if (lang.isString(value.description)) {
				_widths.main = _widths.main <
					value.name.length ?
					value.name.length :
					_widths.main;
			}
			if (lang.isObject(value.options)) {
				value.optionalOptions = assign.apply(null, [{}]
					.concat(Object.keys(value.options)
						.filter(function(option) {

							_widths.sub = _widths.sub <
								option.length ?
								option.length :
								_widths.sub;

							return option !==
								'';
						})
						.map(function(option) {
							var helpOption = {};
							helpOption[option] =
								value.options[
									option];
							return helpOption;
						})));
			}
		}

		return value;
	});
}


function _traverseOptionalOptions(task) {
	var optionalOptions = {};

	if (task.description) {

		var allDeps = [];
		if (task.dep && task.dep.length) {
			allDeps.push(task.dep);
		}
		if (task.seq && task.seq.length) {
			allDeps.push(task.seq);
		}
		if (allDeps.length) {
			var a = flatten(allDeps, true);

			return assign.apply(null, [optionalOptions].concat(a.filter(
					function(
						dep) {
						return _parsedTasks[dep] && _parsedTasks[
							dep].options;
					})
				.map(function(dep) {
					var depTask = _parsedTasks[dep];

					return assign({}, depTask.options,
						_traverseOptionalOptions(
							depTask));
				})));
		}
	}

	return optionalOptions;


}
