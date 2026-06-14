# Compile-time vs run time size computation for array in C++

**Published:** 2021-08-08

![C++ compile-time computation](https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&h=400&fit=crop&q=80)

There are 2 ways in C++ to get the size of an array.  The first is using run-time computation with sizeof, but there is a better compile-time way to compute the size. The way to do it as follows:

```mermaid
graph TD
    A[Need Array Size in C++] --> B{Which approach?}
    B -->|Runtime| C[sizeof operator]
    B -->|Compile-time| D[Template deduction]
    C --> E["sizeof arr / sizeof arr[0]"]
    D --> F["template<typename T, size_t N>"]
    E --> G[Evaluated at runtime]
    F --> H[Compiler deduces N automatically]
    G --> I[Works but less safe]
    H --> J[Type-safe and compile-time constant]
    style J fill:#90EE90
    style I fill:#FFD700
```

```mermaid
graph LR
    A["char arr[10]"] -->|Pass to template| B["arraySize<char, 10>"]
    B --> C["N deduced as 10"]
    C --> D["Returns constexpr size_t = 10"]
    E["int arr[5]"] -->|Pass to template| F["arraySize<int, 5>"]
    F --> G["N deduced as 5"]
    G --> D
    style D fill:#90EE90
```

Note: char* is not the same as char[]. When you do sizeof(char *) it will give you 4 or 8 depending on the size of char in the system.