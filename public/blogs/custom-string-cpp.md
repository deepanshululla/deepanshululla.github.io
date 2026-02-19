# Custom String implementation in C++

**Published:** 2021-08-11

![C++ memory management](https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&h=400&fit=crop&q=80)

A C++ string class can be implemented in more than one way. I used char*(or rather T*) as a base for implementation. The reason for templatization was to mimic the way standard library does things.

It supports all the construction, copy and assignment operations as well as outputting to stdout and concatenation.