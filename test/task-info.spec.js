var assert = require("assert");
var taskInfo = require('../task-info/');
var expect = require('expect.js');

describe('taskInfo', function() {
    describe('#when called', function() {
        it(
            'should return an object',
            function() {
                expect(taskInfo({}))
                    .to.be.an('object');
            });
        it(
            'should return an object containing getTasks and cliHelp functions',
            function() {
                var info = taskInfo({});
                console.log(info);
                expect(info.getTasks)
                    .to.be.a('function');
                expect(info.cliHelp)
                    .to.be.a('function');
            });
    });
    describe('.taskInfo(gulp)', function() {
        it(
            'should return an object',
            function() {
                var _gulp = {
                    tasks: {}
                };

                var info = taskInfo(_gulp);
                expect(info.getTasks())
                    .to.be.an('object');
            });

    });

})
