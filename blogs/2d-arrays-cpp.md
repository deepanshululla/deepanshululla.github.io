# Implementing 2d Arrays in CPP

**Published:** 2021-12-24

![C++ programming and data structures](https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&h=400&fit=crop&q=80)

C++ hasn't yet caught up with implementing 2D arrays like other languages yet. So there is no inbuilt 2D array in C++.But lose no hope, with some template programming to the rescue we can create our own multidimensional data structure.

Here is a basic design of how a 2d Array will work

```mermaid
graph TD
    subgraph 2D Array Memory Layout
        A[Array2D Object on Stack] -->|owns pointer| R[Row Pointers on Heap]
        R -->|row 0| D0[Data Block Row 0]
        R -->|row 1| D1[Data Block Row 1]
        R -->|row 2| D2[Data Block Row 2]
    end
    subgraph Access Pattern
        ACC["arr[i][j]"] --> P1["row_ptrs[i]"] --> P2["row_data[j]"] --> VAL[Value]
    end
```

We can extend this further to similarly create an n-dimensional Array by using variadic templates.