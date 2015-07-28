### Ordering of tasks in help context

Task modules are loadable in alphabetical order, however I have only tested this
on a Mac. If you experience different behaviour please create an issue.

Alphabetical ordering is not always the best solution, that's why it's possible
to do a manual prioritization of tasks by adding a `priority` option.

The priority for the first task is `-10`, for every subsequently added task the
priority will decrease with `10` unless a `priority` option is set.

If a `help` task is added using `taskInfo`, it will have a priority of `0`, which
makes it show on top of the task list.
If you'd like to have your task show up on top give it a `priority` anything bigger
than `0`.

<%= js.tasks.info %>

(Why `10`? It will cut you some slack if you want to move tasks around.)
