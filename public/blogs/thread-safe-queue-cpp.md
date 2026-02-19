# Thread-safe queue implementation in C++

**Published:** 2021-09-06

![Concurrent programming in C++](https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&h=400&fit=crop&q=80)

Below is an implementation of thread-safe queue using synchronization primitives.

## Producer-Consumer Pattern

A thread-safe queue is the backbone of the producer-consumer pattern. Multiple producer threads enqueue items while multiple consumer threads dequeue them, all coordinated through synchronization primitives.

```mermaid
graph LR
    P1["Producer 1"] --> Q["Thread-Safe\nQueue"]
    P2["Producer 2"] --> Q
    P3["Producer N"] --> Q
    Q --> C1["Consumer 1"]
    Q --> C2["Consumer 2"]
    Q --> C3["Consumer N"]
```

## Mutex and Condition Variable Flow

The queue uses a mutex to protect shared state and a condition variable to signal consumers when data is available. This avoids busy-waiting and ensures correct synchronization.

```mermaid
sequenceDiagram
    participant Producer
    participant Mutex
    participant Queue
    participant CondVar
    participant Consumer

    Consumer->>Mutex: Lock
    Consumer->>Queue: Check if empty
    Note over Consumer,Queue: Queue is empty
    Consumer->>CondVar: Wait and release lock
    Producer->>Mutex: Lock
    Producer->>Queue: Push item
    Producer->>CondVar: Notify one
    Producer->>Mutex: Unlock
    CondVar->>Consumer: Wake up and reacquire lock
    Consumer->>Queue: Pop item
    Consumer->>Mutex: Unlock
```

## Push and Pop Operations

Both push and pop operations acquire the mutex before modifying the queue. The pop operation additionally waits on the condition variable if the queue is empty.

```mermaid
flowchart TD
    subgraph Push Operation
        A1["Acquire mutex lock"] --> A2["Push item to\ninternal queue"]
        A2 --> A3["Notify one\nwaiting thread"]
        A3 --> A4["Release lock"]
    end

    subgraph Pop Operation
        B1["Acquire mutex lock"] --> B2{"Queue\nempty?"}
        B2 -- Yes --> B3["Wait on\ncondition variable"]
        B3 --> B2
        B2 -- No --> B4["Pop front item\nfrom queue"]
        B4 --> B5["Release lock"]
        B5 --> B6["Return item"]
    end
```
