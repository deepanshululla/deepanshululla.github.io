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

## Implementation

```cpp
#include <queue>
#include <mutex>
#include <condition_variable>

template <typename T>
class ThreadSafeQueue {
private:
    std::queue<T> queue_;
    std::mutex mutex_;
    std::condition_variable cond_;

public:
    void push(T item) {
        std::lock_guard<std::mutex> lock(mutex_);
        queue_.push(std::move(item));
        cond_.notify_one();
    }

    T pop() {
        std::unique_lock<std::mutex> lock(mutex_);
        cond_.wait(lock, [this] { return !queue_.empty(); });
        T item = std::move(queue_.front());
        queue_.pop();
        return item;
    }

    bool try_pop(T& item) {
        std::lock_guard<std::mutex> lock(mutex_);
        if (queue_.empty()) {
            return false;
        }
        item = std::move(queue_.front());
        queue_.pop();
        return true;
    }

    bool empty() const {
        std::lock_guard<std::mutex> lock(mutex_);
        return queue_.empty();
    }

    size_t size() const {
        std::lock_guard<std::mutex> lock(mutex_);
        return queue_.size();
    }
};
```

## Push and Pop Operations

Both push and pop operations acquire the mutex before modifying the queue. The pop operation additionally waits on the condition variable if the queue is empty. The `try_pop` variant returns immediately with a boolean indicating whether an item was available, which is useful when you do not want the consumer to block.

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

## Usage Example

```cpp
#include <iostream>
#include <thread>
#include <vector>

int main() {
    ThreadSafeQueue<int> queue;

    // Producer threads
    std::vector<std::thread> producers;
    for (int i = 0; i < 3; ++i) {
        producers.emplace_back([&queue, i] {
            for (int j = 0; j < 5; ++j) {
                int value = i * 10 + j;
                queue.push(value);
                std::cout << "Producer " << i << " pushed " << value << "\n";
            }
        });
    }

    // Consumer threads
    std::vector<std::thread> consumers;
    for (int i = 0; i < 2; ++i) {
        consumers.emplace_back([&queue, i] {
            for (int j = 0; j < 7; ++j) {
                int value = queue.pop();
                std::cout << "Consumer " << i << " popped " << value << "\n";
            }
        });
    }

    for (auto& t : producers) t.join();
    for (auto& t : consumers) t.join();

    // Drain remaining items
    int item;
    while (queue.try_pop(item)) {
        std::cout << "Remaining: " << item << "\n";
    }

    return 0;
}
```
