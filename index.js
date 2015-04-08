'use strict';

module.exports = function(gulp) {
	if (!gulp) {
		throw new Error('Please provide gulp');
	}
	return {
		taskLoader: require('./task-loader'),
		help: require('./help')(gulp)
	};
};
