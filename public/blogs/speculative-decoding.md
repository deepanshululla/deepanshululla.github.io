# Speculative Decoding: Making LLM Inference Faster

**Published:** February 17, 2026

![Accelerating LLM inference with parallel verification](https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop&q=80)

Large language models have become remarkably capable, but their inference speed remains a persistent bottleneck in production systems. Generating a single response from a 70-billion parameter model can take several seconds, and much of that time is spent waiting on memory bandwidth rather than computation. Speculative decoding is an elegant technique that can deliver 2-3x speedups in token generation without changing the output distribution at all. In this post, we will break down how it works, why it preserves exactness, and what to consider when deploying it in practice.

## The Decode Bottleneck

To understand speculative decoding, we first need to understand why autoregressive generation is slow.

LLM inference has two distinct phases:

1. **Prefill phase**: The model processes the entire input prompt in parallel. All tokens are processed simultaneously through matrix-matrix multiplications, which are compute-bound and make efficient use of GPU throughput.

2. **Decode phase**: The model generates output tokens one at a time. Each new token requires a full forward pass through the model, but since we are only processing a single token, this involves matrix-vector multiplications rather than matrix-matrix multiplications.

The decode phase is the bottleneck. Here is why: matrix-vector operations are memory-bound. For each token we generate, the GPU must read the entire set of model weights from high-bandwidth memory (HBM). For a 70B parameter model in FP16, that means reading roughly 140 GB of weights per token. The actual arithmetic -- multiplying and adding -- finishes quickly, but waiting for data to arrive from memory dominates the wall-clock time.

This creates a painful situation: the GPU's compute units are severely underutilized during decoding. We are paying the full cost of reading all model weights from memory just to produce a single token. The arithmetic intensity (FLOPs per byte of memory accessed) is extremely low.

```
Prefill (parallel):   [tok1, tok2, tok3, ..., tokN] --> processed together (compute-bound)
Decode  (sequential): tok1 --> tok2 --> tok3 --> ...  (memory-bound, GPU underutilized)
```

The fundamental problem: we cannot generate token `t+1` until we have generated token `t`, because each token depends on the previous one. This sequential dependency seems inescapable.

## The Key Insight Behind Speculative Decoding

Speculative decoding is built on a simple but powerful asymmetry:

**Verifying K candidate tokens is almost as cheap as generating 1 token.**

Why? Because verification looks like prefill. If someone hands you K candidate tokens, the target model can score all of them in a single forward pass using parallel matrix-matrix operations. This is compute-bound and makes efficient use of the GPU.

Contrast this with the naive approach of generating those same K tokens one by one, which would require K separate memory-bound forward passes.

The strategy then becomes: use a small, fast model to "guess" the next several tokens, then use the large model to verify all guesses at once. If the guesses are mostly right, we have effectively generated multiple tokens for the cost of approximately one large-model forward pass.

```
Naive decoding (K tokens):
  K forward passes x full model weight reads = K * (memory cost)

Speculative decoding (K tokens):
  1 draft pass (cheap) + 1 verification pass (parallel) ~ 1 * (memory cost) + small overhead
```

## How Speculative Decoding Works

The algorithm involves two models:
- A **draft model** (small and fast, e.g., 68M-1B parameters)
- A **target model** (the large model we actually want outputs from, e.g., 70B parameters)

### Step 1: Draft Generation

The draft model generates K candidate tokens autoregressively. Because the draft model is small, each forward pass is fast. Even though this is still sequential, the total time is much less than running K passes through the target model.

```
Draft model generates: [d1, d2, d3, d4, d5]  (K=5 candidates)
```

### Step 2: Parallel Verification

The target model processes the original context plus all K draft tokens in a single forward pass. This is essentially a prefill operation: all positions are processed in parallel through matrix-matrix multiplications. The target model produces probability distributions over the vocabulary at each of the K positions.

```
Target model scores all K positions in parallel:
  Position 1: P_target(· | context)
  Position 2: P_target(· | context, d1)
  Position 3: P_target(· | context, d1, d2)
  Position 4: P_target(· | context, d1, d2, d3)
  Position 5: P_target(· | context, d1, d2, d3, d4)
```

### Step 3: Accept or Reject

We compare the target model's distribution with the draft model's distribution at each position, moving left to right. We accept tokens as long as they pass a rejection sampling criterion. At the first rejection, we resample from an adjusted distribution and discard all subsequent draft tokens.

### Pseudocode

```python
def speculative_decode(draft_model, target_model, context, K):
    # Step 1: Generate K candidates from the draft model
    draft_tokens = []
    draft_probs = []
    for i in range(K):
        p_draft = draft_model.predict(context + draft_tokens)
        token = sample(p_draft)
        draft_tokens.append(token)
        draft_probs.append(p_draft)

    # Step 2: Score all candidates with the target model in one pass
    # This processes all K positions in parallel
    target_probs = target_model.score(context + draft_tokens)
    # target_probs[i] = P_target(· | context, draft_tokens[:i])

    # Step 3: Accept or reject using rejection sampling
    accepted = []
    for i in range(K):
        token = draft_tokens[i]
        p_draft_i = draft_probs[i][token]
        p_target_i = target_probs[i][token]

        # Accept with probability min(1, p_target / p_draft)
        if random.uniform(0, 1) < min(1.0, p_target_i / p_draft_i):
            accepted.append(token)
        else:
            # Reject: resample from adjusted distribution
            adjusted_dist = normalize(max(0, p_target[i] - p_draft[i]))
            resampled_token = sample(adjusted_dist)
            accepted.append(resampled_token)
            break  # Discard remaining draft tokens

    # If all K tokens accepted, sample one bonus token from target
    if len(accepted) == K:
        bonus = sample(target_probs[K])
        accepted.append(bonus)

    return accepted
```

### Step-by-Step Example

Let us walk through a concrete example. Suppose the context is "The capital of France is" and K=3.

```
Step 1: Draft model generates candidates
  d1 = "Paris"     (draft prob: 0.85)
  d2 = ","         (draft prob: 0.70)
  d3 = "which"     (draft prob: 0.40)

Step 2: Target model scores all 3 positions in ONE forward pass
  Position 1: P_target("Paris" | context)       = 0.92
  Position 2: P_target(","     | context, Paris) = 0.75
  Position 3: P_target("which" | context, Paris,) = 0.15

Step 3: Accept/Reject (left to right)
  Token "Paris":  p_target(0.92) >= p_draft(0.85) --> ACCEPT (always accept)
  Token ",":      p_target(0.75) >= p_draft(0.70) --> ACCEPT (always accept)
  Token "which":  p_target(0.15) < p_draft(0.40)
                  Accept with prob 0.15/0.40 = 0.375
                  Suppose we roll 0.60 > 0.375 --> REJECT
                  Resample from adjusted distribution at position 3

Result: 2 tokens accepted + 1 resampled = 3 tokens from one target forward pass
  (vs. 3 separate target forward passes in naive decoding)
```

## Why It Is Exact (Rejection Sampling)

The most remarkable property of speculative decoding is that it produces the **exact same distribution** as running the target model alone. This is not an approximation. The output is mathematically identical in distribution.

Interestingly, speculative decoding was independently invented by two Google teams at the same time: Leviathan et al. ("Fast Inference from Transformers via Speculative Decoding") and Chen et al. ("Accelerating Large Language Model Decoding with Speculative Sampling"), both published in 2023. The technique draws directly from the Metropolis-Hastings algorithm in Markov Chain Monte Carlo (MCMC) methods -- if the accept/reject mechanism looks familiar to anyone with a statistics background, that is where it comes from.

This is achieved through a modified rejection sampling scheme. At each position, given the draft token `x` with draft probability `q(x)` and target probability `p(x)`:

1. **If `p(x) >= q(x)`**: Always accept. The target model is at least as likely to generate this token as the draft model, so accepting it does not introduce bias.

2. **If `p(x) < q(x)`**: Accept with probability `p(x) / q(x)`. This downweights tokens that the draft model overestimates relative to the target.

3. **On rejection**: Sample from the residual distribution:

```
p_adjusted(x) = max(0, p(x) - q(x)) / Z
where Z = sum_x max(0, p(x) - q(x))
```

This residual distribution captures exactly the probability mass that the draft model "missed" -- tokens the target favors more than the draft. By sampling from this adjusted distribution on rejection, we ensure the overall probability of generating any token `x` at that position equals `p(x)`.

### Proof Sketch

The total probability of outputting token `x` at a given position is:

```
P(output = x) = q(x) * min(1, p(x)/q(x))                    [accepted from draft]
              + (1 - sum_y q(y)*min(1, p(y)/q(y))) * p_adj(x) [resampled on rejection]
```

Working through the algebra, this simplifies to `p(x)` for all `x`. The key insight is that the rejection probability and the adjusted distribution are carefully constructed so that the two terms sum to exactly the target distribution.

This means you can deploy speculative decoding as a drop-in replacement with zero quality degradation. The only difference is speed.

## Practical Considerations

### Choosing the Draft Model

The draft model selection is critical for performance. Common approaches:

- **Same model family, smaller size**: Use Llama 1B as a draft for Llama 70B. The smaller model from the same training pipeline tends to have good alignment with the larger model's distribution.
- **Independently trained small model**: Any fast model can serve as a draft, but acceptance rates may be lower if the distributions diverge significantly.
- **Quantized version of the target**: Use a heavily quantized (e.g., 4-bit) version of the target model as the draft.

The draft model must be **significantly faster** than the target. If the draft model is too large, the time spent on draft generation eats into the speedup from parallel verification. A good rule of thumb is that the draft model should be at least 10x faster per token than the target.

In practice, common pairings include:

- **Target 70B + Draft 7-8B** (e.g., Llama 70B with Llama 8B)
- **Target 8B + Draft 1B** (e.g., Llama 8B with a 1B distilled variant)

One practical tip: **distillation helps**. Training a draft model to specifically mimic the target model's distribution (rather than using a generic small model) can significantly improve acceptance rates. DeepMind demonstrated approximately 2x speedup on Chinchilla 70B using a well-matched draft model.

### Acceptance Rate

The acceptance rate measures how often draft tokens are accepted by the target model. This is the primary driver of speedup:

- **High acceptance rate (>80%)**: Most draft tokens are accepted, yielding close to theoretical maximum speedup.
- **Low acceptance rate (<50%)**: Many rejections mean we frequently discard draft tokens and gain little benefit.
- **Acceptance rate of 0%**: We still get one token per iteration (the resampled token), so speculative decoding is never slower than generating one token per step, plus the small overhead of the draft model.

The acceptance rate depends on how well the draft model's distribution matches the target's. Tasks where the output is more predictable (code completion, factual retrieval) tend to have higher acceptance rates than creative or open-ended generation.

### Expected Speedup

The theoretical expected number of tokens generated per iteration is:

```
E[tokens per step] = (1 - alpha^(K+1)) / (1 - alpha)
```

where `alpha` is the average acceptance rate and `K` is the speculation length. In practice, typical speedups range from **2x to 3x**, depending on the task and model pairing.

### Overhead and Tradeoffs

Speculative decoding is not free. There are several sources of overhead:

- **Two models in memory**: Both the draft and target models must be loaded, increasing memory requirements. This can be especially tight on GPU memory.
- **Two KV caches**: Each model maintains its own key-value cache for attention, roughly doubling cache memory usage.
- **Draft model compute**: Although small, the draft model still consumes some compute and memory bandwidth.
- **Implementation complexity**: Managing two models, synchronizing their states, and implementing the rejection sampling logic adds engineering complexity.

### When It Works Best

Speculative decoding delivers the largest gains when:

- The draft model is well-aligned with the target (trained on similar data, from the same family)
- The generation task is relatively predictable (higher acceptance rates)
- The system is memory-bandwidth-bound (which is the common case for single-request inference)
- The target model is large enough that decode passes are expensive

It provides less benefit when:

- Batching many requests together (the decode phase becomes more compute-bound with large batches)
- The draft model is poorly calibrated for the domain
- GPU memory is too limited to host both models comfortably

## Variants and Extensions

The core idea of speculative decoding has inspired several variants that push the concept further.

### Self-Speculative Decoding

Instead of maintaining a separate draft model, self-speculative decoding uses the target model itself for drafting -- but in a cheaper way. One approach is **early exit**: use the hidden states from an intermediate layer of the target model (say, layer 8 out of 80) combined with the final language model head to produce draft tokens. This eliminates the need for a second model entirely, saving memory and simplifying deployment. The tradeoff is that early-layer predictions may be less accurate, reducing acceptance rates.

### Medusa

Medusa adds **multiple prediction heads** to the target model. Instead of a single next-token prediction head, Medusa trains additional heads that predict tokens 2, 3, ..., K positions into the future simultaneously. During inference, these heads propose multiple candidate tokens in a single forward pass without needing a separate draft model. The candidates are then verified using tree-based attention in one additional forward pass. Medusa requires fine-tuning the extra heads, but once trained, it avoids the memory overhead of a separate draft model.

### Tree-Based Speculative Decoding (SpecInfer)

Rather than generating a single sequence of K draft tokens, tree-based approaches generate a **tree of candidates**. At each position, the draft model proposes multiple alternative tokens, creating a branching structure:

```
           "Paris"
          /       \
       ","        "."
      /   \        |
  "which" "a"   "It"
```

The target model can verify all paths in the tree using a specially structured attention mask in a single forward pass. If one branch is rejected, another branch might still be accepted, increasing the expected number of accepted tokens per verification step. This approach is especially helpful when the draft model is uncertain, as it hedges across multiple possibilities.

### Staged Speculative Decoding

This approach chains multiple draft models of increasing size. For example, a tiny model (10M params) drafts candidates, a medium model (1B params) filters them, and finally the target model (70B params) does the final verification. Each stage reduces the number of candidates, making the final verification cheaper.

### Inference with Reference

A related technique that applies when the output is expected to overlap significantly with the input -- for example, code editing, RAG with long quoted passages, or document revision tasks. Instead of generating tokens from scratch, the system copies tokens directly from the input context, then verifies them against the target model. This can achieve approximately 2x speedups on workloads where the output heavily references the input, and it requires no draft model at all.

### A Note on Throughput

One important caveat: speculative decoding optimizes **latency** (time per request), not throughput. It actually increases total compute because the draft model's forward passes are additional work. In high-throughput serving scenarios where the system is already batching many requests and the GPU is well-utilized, speculative decoding may provide little benefit or even hurt overall throughput. It is most valuable when serving individual requests or small batches where latency is the priority.

## Conclusion

Speculative decoding is one of the most impactful inference optimization techniques for large language models. Its key strengths are worth summarizing:

- **It exploits a fundamental asymmetry**: verification (parallel, compute-bound) is much cheaper than generation (sequential, memory-bound). This asymmetry is inherent to the transformer architecture and autoregressive decoding.
- **It is mathematically exact**: the rejection sampling scheme guarantees that the output distribution is identical to the target model running alone. There is no quality-speed tradeoff -- you get the speed for free.
- **It is practical**: with typical speedups of 2-3x and no quality degradation, speculative decoding is one of the few optimizations that is almost always worth deploying if memory allows.
- **It composes with other techniques**: speculative decoding can be combined with quantization, KV cache optimization, continuous batching, and other inference optimizations.

The technique reflects a broader principle in systems optimization: when you identify an asymmetry between the cost of producing a result and the cost of checking it, you can often exploit that gap for significant performance gains. In the case of LLM inference, the gap between memory-bound token generation and compute-bound token verification is large enough to make speculative decoding a practical and elegant solution.

As models continue to grow in size and deployment scales increase, techniques like speculative decoding will remain essential tools in the ML engineer's toolkit for making inference fast and cost-effective.

## References

- Leviathan, Y., Kalman, M., and Matias, Y. (2023). "Fast Inference from Transformers via Speculative Decoding." [arXiv:2211.17192](https://arxiv.org/abs/2211.17192)
- Chen, C., Borgeaud, S., Irving, G., Lespiau, J.B., Sifre, L., and Jumper, J. (2023). "Accelerating Large Language Model Decoding with Speculative Sampling." [arXiv:2302.01318](https://arxiv.org/abs/2302.01318)
- Cai, T., Li, Y., Geng, Z., Peng, H., Lee, J.D., Chen, D., and Dao, T. (2024). "Medusa: Simple LLM Inference Acceleration Framework with Multiple Decoding Heads." [arXiv:2401.10774](https://arxiv.org/abs/2401.10774)
- Li, Y., Cai, T., Zhang, Y., Chen, D., and Dao, T. (2024). "EAGLE: Speculative Sampling Requires Rethinking Feature Uncertainty." [arXiv:2401.15077](https://arxiv.org/abs/2401.15077)
- Huyen, C. (2025). *AI Engineering*. O'Reilly Media. Chapter 9: Inference Optimization.
- CS336: Language Modeling from Scratch, Stanford University. Lecture 10: Inference.
