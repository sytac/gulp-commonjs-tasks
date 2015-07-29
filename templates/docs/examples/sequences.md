#### Sequences

I don't know about you but if you want to have some control of when tasks will be executed you'll end up using something like `run-sequence` to avoid the mess of chaining tasks together.


##### Introducing run-sequence

Using [run-sequence](https://www.npmjs.com/package/run-sequence) we can run tasks in sequence rather than all at once before running a task.

Here we have three tasks which are run in order by the `all` task. A `fn` property is not needed, but if you add it, it will executed when the sequence is done.

<%= examples.sequences.tasks.sequence %>

##### Referencing sequences

We are not bound to handing task names in the `seq` array. We can also use function names or anonymous functions.

<%= examples.sequenceReferencing.tasks.sequence %>

We can also mix the type of objects a sequence array can take.

<%= examples.sequenceMixedReferencing.tasks.sequence %>
