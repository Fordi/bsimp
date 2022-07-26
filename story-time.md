# Where this came from

A while back, I had to refactor a _bunch_ of business logic, and the complexity of the task came down to "These are hard to reason about because the conditions are unnecessarily complicated".

So, my first instinct was to look for an eslint or prettier plugin that could simplify boolean expressions, and assert that they be in simplest form.

That doesn't exist.

My next instinct was to write one, leveraging a node library that does something like [this](https://www.boolean-algebra.com/) or [this](https://www.dcode.fr/boolean-expressions-calculator).  Those are both closed source, though, so :sad_face:.

There are a couple of "equivalent" NPM libraries, however, they don't really work well, and they operate on strings.  What I needed was something that could operate on arbitrary symbols.

That didn't exist ... until now.

I give you `bsimp` - a library that simplifies boolean expressions using a _very_ simple AST, by iteratively applying boolean algebra rules.

It also contains a string parser and serializer - mostly to make testing and development easier.

And, yes, the eslint / prettier plugins are next on my task list.