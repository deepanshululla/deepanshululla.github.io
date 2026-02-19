# Prefill vs Decode: Understanding the Two Phases of LLM Inference

**Published:** February 17, 2026

![Data center infrastructure powering LLM inference](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop&q=80)

Large language models have become foundational to modern AI applications, but serving them efficiently at scale remains one of the hardest engineering challenges in the field. Whether you are building a chatbot, a code assistant, or a summarization pipeline, understanding how LLM inference actually works under the hood is critical for making good system design decisions. This post breaks down the two core phases of LLM inference -- prefill and decode -- and explores the key concepts that determine inference performance: KV caching, GPU memory allocation, batching strategies, and attention variants.

## What is LLM Inference?

LLM inference is the process of generating text from a trained language model given an input prompt. Unlike training, which processes entire datasets in bulk to learn parameters, inference is inherently **autoregressive**: the model generates one token at a time, where each new token depends on all previously generated tokens.

The high-level inference pipeline looks like this:

1. **Tokenization**: Convert the input text into a sequence of token IDs.
2. **Embedding**: Map each token ID to a dense vector representation.
3. **Transformer forward pass**: Pass the embeddings through the model's layers (self-attention + feed-forward networks) to produce output representations.
4. **Logits computation**: Project the final hidden states into a vocabulary-sized vector of logits.
5. **Sampling**: Select the next token from the logit distribution (greedy, top-k, top-p, temperature scaling, etc.).
6. **Repeat**: Append the new token to the sequence and run another forward pass to generate the next token.

This loop continues until the model emits an end-of-sequence token or a maximum length is reached.

```python
# Simplified autoregressive generation loop
def generate(model, input_ids, max_new_tokens):
    for _ in range(max_new_tokens):
        logits = model.forward(input_ids)        # Forward pass
        next_token = sample(logits[:, -1, :])     # Sample from last position
        input_ids = concat(input_ids, next_token) # Append to sequence
        if next_token == EOS_TOKEN:
            break
    return input_ids
```

The critical insight is that not all steps in this loop are equal. The very first forward pass over the input prompt behaves fundamentally differently from every subsequent forward pass that generates a single new token. These two regimes are the **prefill phase** and the **decode phase**.

## The Two Phases: Prefill and Decode

### Prefill Phase

The prefill phase processes the entire input prompt in a single forward pass. Since all prompt tokens are known upfront, they can be processed **in parallel** through the transformer layers. This means the attention computation involves multiplying large matrices together -- it is a **matrix-matrix multiplication** (GEMM) operation.

Key characteristics of prefill:

- All input tokens are processed simultaneously.
- The computation is **compute-bound**: the GPU's arithmetic units are the bottleneck, not memory bandwidth.
- This phase is similar to a training forward pass in terms of computational pattern.
- The primary output is the **KV cache** -- the key and value tensors from each attention layer, which will be reused during decoding.
- The model also produces logits for the first generated token.

### Decode Phase

The decode phase generates output tokens one at a time. At each step, only the single new token is processed through the transformer, but it must attend to all previous tokens (both from the prompt and previously generated output) via the KV cache. This means the attention computation is a **matrix-vector multiplication** -- the new token's query vector is multiplied against the cached key matrix.

Key characteristics of decode:

- Tokens are generated sequentially, one per forward pass.
- The computation is **memory-bound**: the bottleneck is loading the model weights and KV cache from GPU memory (HBM) into the compute units, not the arithmetic itself.
- Each step does relatively little compute but requires reading a large amount of data.
- This phase has no direct analogue in training -- it is unique to inference.

### Comparison Table

| Aspect | Prefill | Decode |
|---|---|---|
| Input | Entire prompt (all tokens known) | Single new token |
| Parallelism | All tokens processed at once | One token at a time |
| Bottleneck | Compute-bound (FLOPS-limited) | Memory-bound (bandwidth-limited) |
| Core operation | Matrix-matrix multiply (GEMM) | Matrix-vector multiply (GEMV) |
| Analogy | Similar to training forward pass | Unique to inference |
| Output | KV cache + first token logits | Next token logits |
| Arithmetic intensity | High | Low |

Understanding this distinction is essential because it means that optimizing prefill and optimizing decode require fundamentally different strategies. Prefill benefits from more compute (faster GPUs, better kernels), while decode benefits from higher memory bandwidth and smaller memory footprints.

## KV Caching

The KV cache is arguably the single most important optimization in LLM inference. To understand why it exists, consider what happens without it.

### Without KV Cache

At each decoding step, the model needs to compute attention over the entire sequence so far. Without caching, this means recomputing the key (K) and value (V) projections for every previous token at every step. If the sequence has length `n`, each decode step performs O(n) work for the attention computation alone, and across `n` decode steps, the total work is O(n^2).

### With KV Cache

With the KV cache, the key and value tensors computed during previous steps are stored in GPU memory. At each new decode step, only the new token's K and V vectors are computed and appended to the cache. The attention computation then uses the full cached K and V matrices, but avoids redundant recomputation. This reduces each decode step to O(n) work for attention (reading the cache), making the total work across all steps O(n^2) in reads but saving all the redundant projection computations.

```python
# Decode step with KV cache (pseudocode)
def decode_step(model, new_token, kv_cache):
    # Only compute Q, K, V for the single new token
    q, k, v = model.qkv_projection(new_token)  # Shape: [1, d]

    # Append new K, V to the cache
    kv_cache.keys = concat(kv_cache.keys, k)    # Shape: [seq_len, d]
    kv_cache.values = concat(kv_cache.values, v) # Shape: [seq_len, d]

    # Attend over the full cached sequence
    attn_weights = softmax(q @ kv_cache.keys.T / sqrt(d))  # [1, seq_len]
    output = attn_weights @ kv_cache.values                  # [1, d]

    return output, kv_cache
```

### Memory Cost of the KV Cache

The KV cache grows linearly with sequence length and consumes significant GPU memory. For a single sequence, the KV cache size is:

```
KV cache memory = 2 x num_layers x seq_len x hidden_dim x bytes_per_param
```

The factor of 2 accounts for both keys and values. For a batch of requests, multiply by the batch size. This memory cost is often the primary constraint on how many requests can be served concurrently and how long sequences can be.

## GPU Memory Breakdown During Inference

During inference, GPU memory is consumed by three main components:

### 1. Model Weights

The static memory footprint of the model parameters. For a 7B parameter model:

- FP16: 7B x 2 bytes = 14 GB
- INT8: 7B x 1 byte = 7 GB
- INT4: 7B x 0.5 bytes = 3.5 GB

### 2. KV Cache

Grows with sequence length and batch size. For a 7B model (e.g., Llama 2 7B with 32 layers, 4096 hidden dim, FP16):

```
Per token per layer: 2 x 4096 x 2 bytes = 16 KB
Per token (all layers): 32 x 16 KB = 512 KB
For 2048 tokens: 2048 x 512 KB = 1 GB
For batch of 16 at 2048 tokens: 16 GB
```

At this point the KV cache alone exceeds the model weight memory.

### 3. Activations

Temporary tensors created during the forward pass. During inference (especially decode), activations are relatively small since only one token is processed at a time.

### Napkin Math for a 7B Model on a Single A100 (80GB)

| Component | Memory |
|---|---|
| Model weights (FP16) | ~14 GB |
| KV cache (batch=16, seq=2048, FP16) | ~16 GB |
| Activations and overhead | ~2 GB |
| **Total** | **~32 GB** |

This leaves roughly 48 GB of headroom on an 80 GB A100, but if you increase the batch size or sequence length, the KV cache will quickly consume all available memory. This is why KV cache memory management (e.g., PagedAttention in vLLM) is such an active area of research.

## Inference Metrics

Different applications care about different aspects of inference performance. The prefill and decode phases map directly to the metrics that matter most.

### Time to First Token (TTFT)

TTFT measures the latency from when a request arrives to when the first output token is produced. This is primarily determined by the **prefill phase** -- the time it takes to process the entire input prompt. For interactive applications like chatbots, TTFT directly impacts perceived responsiveness.

### Time Per Output Token (TPOT)

TPOT measures the average time between consecutive output tokens during generation. This is determined by the **decode phase** -- how fast each individual decode step runs. For streaming applications, TPOT determines how smooth the text generation feels to the user.

### Throughput

Throughput measures the total number of tokens generated per second across all concurrent requests. This is the metric that determines cost-efficiency at scale. High throughput requires efficiently utilizing the GPU across both prefill and decode phases, often through batching.

### How the Phases Affect Each Metric

| Metric | Primary Phase | What Determines It |
|---|---|---|
| TTFT | Prefill | Prompt length, compute speed, queue wait time |
| TPOT | Decode | KV cache size, memory bandwidth, batch size |
| Throughput | Both | Batching efficiency, GPU utilization across both phases |

A key tension in inference serving is that prefill and decode have conflicting resource requirements. Prefill wants to maximize compute utilization, while decode wants to maximize memory bandwidth utilization. Running them together in the same batch can cause interference -- a phenomenon sometimes called **prefill-decode interference** or **iteration-level scheduling** challenges.

## Batching Strategies

Batching multiple requests together is essential for achieving high throughput, but the autoregressive nature of LLM generation makes batching non-trivial.

### Static Batching

In static batching, the server collects a fixed batch of requests and processes them together from start to finish. All requests in the batch must wait for the longest request to complete before any results are returned and new requests can be admitted.

Problems with static batching:

- **Padding waste**: Shorter sequences are padded to match the longest sequence in the batch, wasting computation.
- **Stalling**: Finished requests occupy GPU resources while waiting for other requests in the batch to complete.
- **Underutilization**: The GPU may sit idle between batches while waiting for enough requests to fill the next batch.

### Continuous (Dynamic) Batching

Continuous batching, also called dynamic batching or iteration-level batching, solves these problems by managing the batch at the granularity of individual decode steps rather than entire requests.

Key ideas:

- As soon as a request finishes generating (hits EOS or max length), its slot is immediately freed.
- New incoming requests can be inserted into the batch at the next iteration.
- No padding is needed -- each request maintains its own position in the sequence.
- The batch size adapts dynamically based on available GPU memory and incoming request rate.

This is the approach used by vLLM, TensorRT-LLM, and other modern serving frameworks.

### Comparison Table

| Aspect | Static Batching | Continuous Batching |
|---|---|---|
| Batch composition | Fixed for entire generation | Changes every iteration |
| New request admission | After entire batch completes | After any single request completes |
| Padding overhead | High (pad to longest sequence) | None |
| GPU utilization | Lower (idle slots) | Higher (slots always filled) |
| Implementation complexity | Simple | More complex (memory management) |
| Used by | Naive implementations | vLLM, TensorRT-LLM, TGI |

### Why Continuous Batching Matters

Consider a scenario where you have 8 requests in a batch. With static batching, if 7 requests finish in 50 tokens but one request generates 500 tokens, all 8 slots are occupied for the entire 500-step duration. With continuous batching, the 7 finished slots are reclaimed and filled with new requests almost immediately, dramatically improving throughput.

## Attention Variants and Their Impact on Inference

The attention mechanism is central to transformer models, and the specific variant used has a major impact on inference efficiency, primarily through its effect on KV cache size.

### Multi-Head Attention (MHA)

The original transformer attention mechanism. Each attention head has its own separate query (Q), key (K), and value (V) projection matrices. For a model with `h` heads and head dimension `d_h`:

- KV cache per token per layer: `2 x h x d_h` parameters
- This is the full hidden dimension `d_model` for both K and V

MHA provides maximum expressiveness but results in the largest KV cache.

### Multi-Query Attention (MQA)

Proposed by Noam Shazeer in 2019, MQA uses a single shared key and value head across all query heads. Each query head still has its own projection, but all heads share one K projection and one V projection.

- KV cache per token per layer: `2 x 1 x d_h` parameters
- This is a reduction factor of `h` compared to MHA

MQA dramatically reduces KV cache size and decode-phase memory bandwidth requirements, but can sometimes hurt model quality.

### Grouped-Query Attention (GQA)

GQA is a compromise between MHA and MQA. Instead of each head having its own KV (MHA) or all heads sharing one KV (MQA), query heads are divided into `g` groups, and each group shares one set of K and V heads.

- KV cache per token per layer: `2 x g x d_h` parameters
- When `g = h`, GQA reduces to MHA
- When `g = 1`, GQA reduces to MQA

GQA has been adopted by many recent models, including Llama 2 70B and Llama 3, as it preserves most of the quality of MHA while significantly reducing the KV cache footprint.

### KV Cache Size Comparison

For a model with `h = 32` heads, `d_h = 128`, `L = 32` layers, at sequence length 2048 in FP16:

| Attention Type | KV Heads | Cache per Token per Layer | Cache (2048 tokens, all layers) |
|---|---|---|---|
| MHA (h=32) | 32 | 2 x 32 x 128 x 2B = 16 KB | 32 x 16 KB x 2048 = 1 GB |
| GQA (g=8) | 8 | 2 x 8 x 128 x 2B = 4 KB | 32 x 4 KB x 2048 = 256 MB |
| MQA (g=1) | 1 | 2 x 1 x 128 x 2B = 0.5 KB | 32 x 0.5 KB x 2048 = 32 MB |

The difference is dramatic. Moving from MHA to GQA with 8 groups reduces KV cache by 4x, and MQA reduces it by 32x. This directly translates to the ability to serve larger batches or longer sequences within the same GPU memory budget, which in turn improves throughput during the memory-bound decode phase.

```python
# KV cache size calculation
def kv_cache_size_bytes(
    num_layers, num_kv_heads, head_dim, seq_len, batch_size, dtype_bytes=2
):
    """Calculate KV cache size in bytes.

    Args:
        num_layers: Number of transformer layers
        num_kv_heads: Number of KV heads (= num_heads for MHA,
                      = num_groups for GQA, = 1 for MQA)
        head_dim: Dimension per head
        seq_len: Sequence length
        batch_size: Number of sequences in batch
        dtype_bytes: Bytes per parameter (2 for FP16, 1 for INT8)
    """
    per_token = 2 * num_layers * num_kv_heads * head_dim * dtype_bytes
    total = per_token * seq_len * batch_size
    return total

# Example: Llama 2 7B (MHA, 32 heads) vs Llama 2 70B (GQA, 8 KV heads)
llama_7b = kv_cache_size_bytes(32, 32, 128, 2048, 1)   # ~1 GB
llama_70b = kv_cache_size_bytes(80, 8, 128, 2048, 1)    # ~640 MB (despite 10x params)
```

Notice how Llama 2 70B, despite having 10x more parameters than Llama 2 7B, can have a smaller KV cache per sequence thanks to GQA. This is a deliberate architectural decision to make the larger model more practical to serve.

### Beyond Head Reduction: MLA and CLA

GQA reduces KV cache by sharing KV heads across query heads. But this is only one of four orthogonal dimensions along which KV cache can be reduced. Two recent techniques push further:

**Multi-Head Latent Attention (MLA)**, introduced in DeepSeek V2 (2024), takes a fundamentally different approach. Instead of reducing the *number* of KV heads, MLA projects the KV representations to a much lower dimensionality. For example, DeepSeek V2 compresses from 16,000 dimensions to 512 dimensions -- a 31x reduction -- while maintaining model quality through a learned up-projection during attention. This is orthogonal to GQA: you could combine both techniques.

**Cross-Layer Attention (CLA)**, proposed by Brandon et al. (2024), shares KV cache *across layers* rather than across heads within a layer. Instead of each layer maintaining its own KV cache, adjacent layers share the same cached keys and values. Character AI deployed a production hybrid using 1 global attention layer per 6 local layers, achieving 2-6x KV cache reduction with minimal quality impact.

### The KV Cache Reduction Taxonomy

These techniques reveal four orthogonal dimensions for reducing KV cache, each with different characteristics:

| Dimension | Technique | Reduction | What It Does |
|---|---|---|---|
| KV heads (K) | GQA/MQA | 5-8x | Shares KV across query head groups |
| KV dimension (H) | MLA | 10-30x | Projects KV to lower dimensionality |
| Layers (L) | CLA | 2-6x | Shares KV across transformer layers |
| Sequence length (S) | Sliding window attention | Constant cache | Attends only to recent tokens |

These are composable for multiplicative savings. A model using GQA + CLA + sliding window attention could reduce KV cache by 50-100x compared to standard MHA, fundamentally changing the economics of serving long-context models.

## PagedAttention and Memory Management

One of the most impactful practical innovations in LLM serving is **PagedAttention**, introduced in vLLM by Kwon et al. (2023). The problem it solves is deceptively simple: how do you efficiently allocate GPU memory for KV caches of varying and unpredictable lengths?

### The Problem: Memory Fragmentation

Without PagedAttention, serving systems must pre-allocate contiguous memory for each request's KV cache based on the maximum possible sequence length. If a request might generate up to 2048 tokens, the system reserves KV cache memory for all 2048 tokens upfront, even if the request ends after 50 tokens. Studies show this leads to **55-70% memory waste** in typical serving workloads.

### The Solution: Virtual Memory for KV Cache

PagedAttention borrows the operating system's virtual memory concept. Instead of contiguous pre-allocation, it divides KV cache into fixed-size **blocks** (analogous to memory pages). A **block table** (analogous to a page table) maps logical token positions to physical memory blocks. Blocks are allocated on demand as new tokens are generated.

This eliminates fragmentation, reduces memory waste to under 5%, and enables approximately **4x more concurrent requests** within the same GPU memory budget. It also enables **copy-on-write** for scenarios like beam search, where multiple candidate sequences share a common prefix -- the shared portion's KV cache is stored once and referenced by all candidates.

PagedAttention is the core innovation behind vLLM and has been adopted by TensorRT-LLM, TGI, and most modern serving frameworks.

## Advanced Serving Techniques

### Chunked Prefill

For requests with very long input prompts, the prefill phase can block the GPU for an extended period, preventing any decode steps from running. **Chunked prefill** splits the prompt into smaller pieces and processes them across multiple iterations, interleaving with ongoing decode steps for other requests. This keeps TPOT low for existing requests while processing new long-context requests.

### Prefill-Decode Disaggregation

Since prefill is compute-bound and decode is memory-bound, some serving systems run them on **separate GPU pools**. Prefill GPUs are optimized for maximum compute throughput, while decode GPUs are optimized for memory bandwidth and capacity. Common ratios are 2:1 (prefill:decode GPUs) when inputs are long, or 1:2 when outputs are long.

### Prompt Caching

When many requests share the same system prompt or common prefix (e.g., a RAG system with a standard instruction template), **prompt caching** stores the computed KV cache for the shared prefix and reuses it across requests. Anthropic reports up to 90% cost savings and 75% latency reduction on cached prefixes. This is especially valuable for agentic workloads where the same tools and instructions are sent with every request.

## Conclusion

The prefill-decode distinction is the foundation for understanding LLM inference performance. Here are the key takeaways:

- **Prefill is compute-bound; decode is memory-bound.** These two phases stress different parts of the GPU, and optimizing one does not automatically optimize the other.
- **The KV cache is the central data structure of inference.** It eliminates redundant computation during decode but introduces a significant and growing memory cost. Managing KV cache memory efficiently is one of the most important problems in inference serving.
- **TTFT and TPOT map to prefill and decode respectively.** When diagnosing latency issues, identify which phase is the bottleneck before applying optimizations.
- **Continuous batching is essential for throughput.** Static batching leaves GPU resources stranded; continuous batching keeps the GPU busy by dynamically managing request lifecycles.
- **Attention variants (MHA, GQA, MQA) directly control KV cache size.** This architectural choice, made at training time, has profound implications for inference efficiency. GQA has emerged as the practical sweet spot, but newer techniques like MLA and CLA push further.
- **PagedAttention eliminates memory waste.** By applying virtual memory concepts to KV cache management, it enables 4x more concurrent requests within the same memory budget.
- **Inference cost dominates training cost at scale.** OpenAI generates over 100 billion words per day; the annualized inference cost (approximately $475M) dwarfs the one-time training cost (approximately $100M) by 4-5x. Every percentage point of inference efficiency matters.

Understanding these fundamentals will help you make better decisions when choosing serving frameworks, selecting model architectures, provisioning hardware, and debugging performance bottlenecks in production LLM deployments.

## References

- Kwon, W., Li, Z., Zhuang, S., Sheng, Y., et al. (2023). "Efficient Memory Management for Large Language Model Serving with PagedAttention." [arXiv:2309.06180](https://arxiv.org/abs/2309.06180)
- Ainslie, J., Lee-Thorp, J., de Jong, M., Zemlyanskiy, Y., et al. (2023). "GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints." [arXiv:2305.13245](https://arxiv.org/abs/2305.13245)
- Shazeer, N. (2019). "Fast Transformer Decoding: One Write-Head is All You Need." [arXiv:1911.02150](https://arxiv.org/abs/1911.02150)
- DeepSeek AI. (2024). "DeepSeek-V2: A Strong, Economical, and Efficient Mixture-of-Experts Language Model." [arXiv:2405.04434](https://arxiv.org/abs/2405.04434)
- Brandon, W., Mishra, M., Nrusimha, A., Panda, R., and Reich, J. (2024). "Reducing Transformer Key-Value Cache Size with Cross-Layer Attention." [arXiv:2405.12981](https://arxiv.org/abs/2405.12981)
- Gu, A. and Dao, T. (2023). "Mamba: Linear-Time Sequence Modeling with Selective State Spaces." [arXiv:2312.00752](https://arxiv.org/abs/2312.00752)
- Williams, S., Waterman, A., and Patterson, D. (2009). "Roofline: An Insightful Visual Performance Model for Multicore Architectures." *Communications of the ACM*.
- Huyen, C. (2025). *AI Engineering*. O'Reilly Media. Chapter 9: Inference Optimization.
- CS336: Language Modeling from Scratch, Stanford University. Lecture 10: Inference.
