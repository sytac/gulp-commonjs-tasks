var assert = require("assert");
var taskInfo = require('../task-info/');
var expect = require('expect.js');

describe('taskInfo', function() {
	describe('#return object', function() {
		it('should return an object containing getTasks and cliInfo', function() {
			assert.equal(true, taskInfo({})
				.getTasks);
		});
	});

	describe('#indexOf()', function() {
		it('should return -1 when the value is not present',
			function() {
				assert.equal(-1, [1, 2, 3].indexOf(5));
				assert.equal(-1, [1, 2, 3].indexOf(0));
			})
	})
})
