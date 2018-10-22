# Project 2: Building Your Own Private Blockchain


## How to run this project

Usage is described as [tests](test/test.js).

```sh
docker run --rm -it $(docker build -q .)
```

## Complaints
The feedback form for this module had a rather small character limit, so I'll just leave my 2 cents here.

I've come across a lot of difficulties while developing this project.

First, the provided boilerplate _(initial)_ code was just confusing and poorly documented. For example, the function `addDataToLevelDB` does not make any sense _(exclusivelly using a read function inside a function named after a write operation???)_ and there is no explanation of why it is needed and how it works.

Second, the instructions in the rubric are also confusing and ambiguous. For example, let's take a look at the first activity:

`Configure simpleChain.js with levelDB to persist blockchain dataset using the level Node.js library.`

What does `configure` mean, exactly?
What does `blockchain dataset` mean, exactly?

Third, the choice of the LevelDB database is questionable, given the number of [crash reports](https://en.wikipedia.org/wiki/LevelDB#Bugs_and_reliability) for this software.

Overall, I've spent more time struggling with NodeJS' callbacks, promise and async/await systems than reasoning about the assignment itself _(and this is just sad)_.

While I understand that [Node]JS is a predominant language, it would be much easier and thoughtful of Udacity part if students could implement this project using a programming language of their choice, such as Python or Golang.
