# Write python like a pro: Part 1: Know your python version

**Published:** 2019-06-15

Welcome to part 1 of writing python like a pro. This series is definitely part of the advanced python series. It assumes you already know python and are definitely comfortable with it.

However, you are a person who wants to know how you can up your python game. You want to learn coding styles for writing cleaner code or write more effective ways to optimize your python code, then this series is for you.

Part 1 is about the differences between python2 and python3. **Often amateur python programmers believe there are no differences between python2 and python3.**

Not only it is completely and absolutely incorrect.  You are going to a hell lot of nightmares when trying to port your application from python2 to python3 especially for larger projects.

Also, our opinion here for new projects is not to use or support Python2 at all. The support for it is going to end next year and it is better for your applications to stop supporting them.

But for older applications, you may want to create applications that may need to support both python2 and python3 or you may want to port your older application to python3.

This post may not cover all the differences but here are the major differences.

 

#### **Print Statement**
In python2 the print statement is used as a statement whereas in Python3 it's a function.

print "Hello Coding Brewery"
# python3

print("Hello World")
Python2 will work with and without parenthesis but python3 does need it.

 

#### Xrange vs range
In python2 xrange used to return a generator object whereas range used to return a list.

In python3 there is no xrange function and range in python3 returns a `collections.abc.Sequence`.

#### Division Function
In python2 3/2 will return the nearest integer i.e 1 whereas in python3 it will return 1.5

Python 2.7.6
3 / 2 = 1
3 // 2 = 1
3 / 2.0 = 1.5
3 // 2.0 = 1.0
Python 3.4.1
3 / 2 = 1.5
3 // 2 = 1
3 / 2.0 = 1.5
3 // 2.0 = 1.0
 

#### Strings
This is quite a significant change

Python 2 has ASCII `str()` types, separate,`unicode()` but no `byte` type.

Now, in Python 3, we finally have Unicode (UTF-8) `str`ings, and 2-byte classes: `byte` and `bytearray`

We will discuss this in detail in another post.

**No Namespace leaking in Python3**

This is another major change. Variables defined inside for loop in python2 do not get leaked out in python3 as they do in python2.

﻿﻿

Python3

As you can see by running it, the value of i doesn't change.

﻿

#### Mismatched Comparisons
In python2 there was an option to compare mismatched data types. For eg you can compare a tuple and a string, A list, and a tuple which made no sense at all

﻿

 

For python3

In python3 it raises a Type exception.

 

Hope you liked the article and please let us know in the comments if you would like to see more of these articles.