# LRU Caches in Python

**Published:** 2022-12-24

![Python programming and caching](https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=400&fit=crop&q=80)

The **Least Recently Used** (LRU) cache is a cache eviction algorithm that organizes elements in order of use. In LRU, as the name suggests, the element that hasn't been used for the longest time will be evicted from the cache.

## LRU Cache Data Structure

An LRU cache combines a **doubly linked list** with a **hash map** to achieve O(1) time complexity for both lookups and evictions. The hash map provides fast key-based access, while the doubly linked list maintains the usage order.

```mermaid
graph LR
    subgraph HashMap
        K1["Key A"] --> N1
        K2["Key B"] --> N2
        K3["Key C"] --> N3
    end
    subgraph Doubly Linked List
        HEAD["HEAD"] --> N3["Node C\nMost Recent"]
        N3 --> N2["Node B"]
        N2 --> N1["Node A\nLeast Recent"]
        N1 --> TAIL["TAIL"]
    end
```

## Cache Hit vs Cache Miss Flow

When a key is accessed, the cache either finds it (hit) or does not (miss). On a hit, the node is moved to the front. On a miss, a new node is inserted at the front and the least recently used node may be evicted if the cache is full.

```mermaid
flowchart TD
    A["Get key"] --> B{"Key in\nhash map?"}
    B -- "Yes: Cache Hit" --> C["Move node to\nfront of list"]
    C --> D["Return value"]
    B -- "No: Cache Miss" --> E{"Cache\nfull?"}
    E -- Yes --> F["Remove tail node\nfrom list and map"]
    F --> G["Insert new node\nat front of list"]
    E -- No --> G
    G --> H["Add key to\nhash map"]
    H --> D
```

## Eviction Process

When the cache reaches capacity and a new entry must be added, the eviction process removes the least recently used item from the tail of the doubly linked list.

```mermaid
sequenceDiagram
    participant Client
    participant HashMap
    participant LinkedList

    Client->>HashMap: put(new_key, value)
    HashMap->>HashMap: Check capacity
    Note over HashMap: Cache is full
    HashMap->>LinkedList: Get tail node
    LinkedList-->>HashMap: Return LRU node
    HashMap->>HashMap: Remove LRU key from map
    HashMap->>LinkedList: Remove tail node
    HashMap->>LinkedList: Insert new node at head
    HashMap->>HashMap: Store new key in map
    HashMap-->>Client: Done
```
