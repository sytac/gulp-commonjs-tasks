#### Argument passing
Passing arguments to each gulp task module is easy.

##### Passing multiple arguments
In our gulp file we'll pass on `defaults` and `moreDefaults`.

<%= examples.passingMultipleArguments.gulpfile %>

In the task module `defaults` and `moreDefaults` are picked up.

<%= examples.passingMultipleArguments.tasks.multiple %>

##### Passing a gulp plugin loader
The example above is not of much use in the real world, but passing on something like [gulp-load-plugins](https://www.npmjs.com/package/gulp-load-plugins) does make sense.

We pass on `gulp-load-plugins` as `$`.

<%= examples.gulpLoadPlugins.gulpfile %>

And we use it in a task to use `gulp-template`.

<%= examples.gulpLoadPlugins.tasks.readme %>

```bash
[gulp-load-plugins] gulp create-readme
[11:39:38] Using gulpfile ~/temp/gulp-commonjs-tasks-examples/examples/gulp-load-plugins/gulpfile.js
[11:39:38] Starting 'create-readme'...
[11:39:38] Finished 'create-readme' after 71 ms
[gulp-load-plugins] cat README.md
# My read me

Foo : foo!
Bar : bar!
```

##### Loading external defaults
Our gulp file

<%= examples.externalDefaults.gulpfile %>

A bit of json containing the defaults

<%= examples.externalDefaults.defaults %>

Our task module

<%= examples.externalDefaults.tasks.external %>
