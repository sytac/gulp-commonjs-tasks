var fs = require('fs'),
	lang = require('lodash/lang'),
	path = require('path');

module.exports = function taskLoader(taskDir, gulp, $, options) {
	var args = [];
	if (arguments.length > 0) {
		args = Array.prototype.slice.call(arguments)
			.splice(1);
	}
	// get all tasks

	var runSequence = require('run-sequence')
		.use(gulp),
		taskNames = [];

	fs.readdirSync(taskDir)
		.map(function(file) {
			var stats = fs.statSync(taskDir + path.sep + file);
			if (stats.isFile() && path.extname(file) === '.js') {
				var tasks;
				var moduleExports = 'function';
				try {
					tasks = require(taskDir + path.sep + file)
						.apply(null, args);

				} catch (err) {
					if (err && TypeError === err.constructor) {
						// try something else
						moduleExports = 'object';

					} else {
						throw err;
					}
				}

				if (moduleExports === 'object') {
					tasks = require(taskDir + path.sep + file);

				}
				// let's assume it's an object
				if (lang.isFunction(tasks)) {
					var taskFn = tasks;
					var taskName = path.basename(file, '.js');
					tasks = {};
					tasks[taskName] = {
						fn: taskFn
					};
				}

				if (lang.isObject(tasks)) {
					Object.keys(tasks)
						.map(function(taskName) {
							var task = tasks[taskName];
							var taskArgs = [taskName];
							if (lang.isFunction(task)) {
								taskArgs.push([]);
								taskArgs.push(task);
							} else if (lang.isObject(task)) {
								if (task.seq) {
									if (!task.fn) {
										task.fn = function(done) {
											runSequence.apply(
												null, task.seq
												.concat(
													done));
										}
									} else {
										var subName = 'post-' +
											taskName + '-sequence';
										var origFn = task.fn;
										gulp.task.apply(gulp, [
											subName, [],
											origFn
										]);

										task.fn = function(done) {
											runSequence.apply(
												null, task.seq
												.concat(
													subName
												)
												.concat(
													done));
										}
									}
								}
								if (lang.isArray(task.dep)) {
									taskArgs.push(task.dep);
								} else {
									taskArgs.push([]);
								}
								if (task.fn) {
									taskArgs.push(task.fn);
								}
							} else if (lang.isArray(task)) {
								taskArgs.push(task);
							}

							if (taskArgs.length > 1) {
								taskNames.push(taskArgs[0]);
								gulp.task.apply(gulp,
									taskArgs);

								var customOptions = ['usage',
									'help', 'priority', 'seq'
								];

								customOptions.map(function(
									customOption) {
									var taskOption = task[
										customOption];
									if (taskOption) {
										gulp.tasks[taskName]
											[
												customOption
											] = taskOption;
									}
								});

							}
						});
				}
			}
		});

	return taskNames;
}
