For a ``while``
===============

.. index:: ! while

When we want to repeat some instructions until a certain condition is
satisfied, Python gives us a simpler way to write this using a new
keyword: ``while``. For example, suppose we want to have Reeborg keep
moving until it reaches a wall. Previously, we might have done something
like the following:

.. code-block:: python

    def move_until_wall():
        if front_is_clear():
            move()

    repeat 42:
        move_until_wall()

and hoped that 42 would have been a number of repetitions sufficient to
reach a wall. Using ``while``, we can write the following::

    while front_is_clear():
        move()

That's it! No more guessing and asking something to be performed a large
number of time just to ensure that it will be enough.

Here's a flowchart for this simple program:

.. figure:: ../../flowcharts/while.jpg
   :align: center

How to think about ``while``
----------------------------

Suppose we have the following::

    while condition():
        do_1()
        do_2()
        do_3()

You can think of this as being equivalent to::

    if condition():
        do_1()
        do_2()
        do_3()
    if condition():
        do_1()
        do_2()
        do_3()
    if condition():
        do_1()
        do_2()
        do_3()
    if condition():
        do_1()
        do_2()
        do_3()
    ....

which is to say that the block of code is repeated as long as the
condition remains ``True``. So, what happens if the condition is always
``True``? The block of code is repeated for ever and the program never
ends.

This is bad.

Instead of using this description of repeated blocks of code,
programmers describe this as a **loop**: that is, you start with the
first instruction (``do_1()``) inside the code block, continue with all
the others until you reach the last instruction (``do_3()``), then
***loop* back**, or go back, to the test just before the beginning of
the block and see if the condition is satisfied; if not, you repeat once
again the cycle. If the condition never becomes ``False``, you keep
repeating and end up with an **infinite loop**.

Conclusion: you want to make sure that the condition will become
``False`` at some point.

Back to hurdles!
----------------

.. topic:: Your turn!

    Go back to **Hurdles??1**, **Hurdles??2** and **Hurdles??3**, and write a single
    program for all three world, using ``while`` and without using ``repeat``.

.. hint::

    Your program might look like the following::

       def jump_over_hurdle():
           # suitable definition

       def run_or_jump ():
           # suitable definition

       while not at_goal():
           run_or_jump()

That's it! No more arbitrary repetitions! From now on, you should only
use ``repeat`` when you know **exactly** how many times a given
function must be repeated.

