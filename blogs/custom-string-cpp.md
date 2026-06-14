# Custom String implementation in C++

**Published:** 2021-08-11

![C++ memory management](https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&h=400&fit=crop&q=80)

A C++ string class can be implemented in more than one way. I used char*(or rather T*) as a base for implementation. The reason for templatization was to mimic the way standard library does things.

It supports all the construction, copy and assignment operations as well as outputting to stdout and concatenation.

```mermaid
graph TD
    subgraph String Object Lifecycle
        A[Constructor] -->|allocate buffer| B[Valid String Object]
        B --> C{Operation?}
        C -->|Copy Constructor| D[Deep copy: new buffer allocated]
        C -->|Move Constructor| E[Shallow transfer: pointer stolen]
        C -->|Copy Assignment| F[Free old buffer then deep copy]
        C -->|Move Assignment| G[Free old buffer then steal pointer]
        C -->|Concatenation| H[Allocate larger buffer and merge]
        D --> B
        E --> B
        F --> B
        G --> B
        H --> B
        B -->|End of scope| I[Destructor: free buffer]
    end
```