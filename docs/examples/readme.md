### Document generation

These files were generated used a gulp task as well.


```js
// ./tasks/readme.js

'use strict';

var fs = require('fs'),
  globule = require('globule'),
  lang = require('lodash/lang'),
  path = require('path'),
  array = require('lodash/array'),
  string = require('lodash/string'),
  template = require('gulp-template');

var tree = require('cli-tree');

module.exports = function (gulp) {
  var tasks = {
    readme: {
      fn: readme,
      description: 'Creates readme file'
    },
    'readme-watch': {
      fn: readmeWatcher,
      dep: ['readme'],
      description: 'Creates readme on changes'
    }
  };

  return tasks;

  function readme() {
    var taskInfo = require('../task-info')(gulp);
    var taskTree = taskInfo.taskTree();

    var current,
      templateData = {
        k: taskTree,
        package: require('../package.json')
      };

    [{
      base: './',
      src: ['tasks/**/*.js', '*.js'],
      namespace: 'js',
      wrapper: function (rendered, config) {
        return ['```js', '// ' + config.file + '\n', rendered, '```'].join(
          '\n');
      }
    }, {
      base: './examples/',
      src: ['**/*.js', '**/*.json', '!**/node_modules/**/*.js'],
      namespace: 'examples',
      wrapper: function (rendered, config) {
        return ['```js', '// ' + config.file + '\n', rendered, '```'].join(
          '\n');
      }
    }].map(function (parseable) {

      var patterns, source;

      if (parseable.namespace && !templateData[parseable.namespace]) {
        templateData[parseable.namespace] = {};
        current = templateData[parseable.namespace];
      } else {
        current = templateData;
      }

      source = lang.isArray(parseable.src) ? parseable.src : [parseable
        .src
      ];

      patterns = source.map(function (src) {
        if (src.indexOf('!') === 0) {
          return '!' + parseable.base + src.substring(1);
        } else {
          return parseable.base + src;
        }
      });

      globule.find(patterns)
        .map(function (file) {
          var pathArrays = array.remove(path.relative(parseable.base,
                path.dirname(
                  file))
              .split(path.sep),
              function (pathPart) {
                if (pathPart !== '') {
                  return true;
                }
              })
            .map(string.camelCase);

          return {
            parseable: parseable,
            file: file,
            depth: pathArrays
          };
        })
        .sort(function (a, b) {
          if (a.depth.length === b.depth.length) {
            return 0;
          } else if (a.depth.length > b.depth.length) {
            return -1;
          } else {
            return 1;
          }
        })
        .map(function (config) {
          var basename, local, rendered, value;

          basename = string.camelCase(path.basename(config.file, path
            .extname(
              config.file)));

          local = current;

          config.depth
            .map(function (part) {
              if (part !== '') {
                if (!local[part]) {
                  local[part] = {};
                }
                local = local[part];
              }
            });

          value = fs.readFileSync(config.file, 'utf8');

          try {
            rendered = string.template(value)(templateData);

            if (lang.isFunction(config.parseable.wrapper)) {
              rendered = config.parseable.wrapper(rendered, config);
            }
            local[basename] = rendered;
          } catch (err) {
            // gracefully fail missing objects
            console.log('---', err, 'in', config.file);
          }

          return config;
        });
    });

    tree(templateData);

    return gulp.src(['./templates/**/*.md'], { cwd: './'})
      .pipe(template(templateData))
      .pipe(gulp.dest('./'));
  }

  function readmeWatcher() {
    // As you can see, this is a regular, run off the mill gulp.watch function call
    gulp.watch(['./tasks/*.js', './*.js', './examples/**/*.js',
      './templates/**/*.md'
    ], ['readme']);
  }
};

```
