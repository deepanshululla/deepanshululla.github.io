# Mixed Precision Training: bfloat16, FP8, and When to Use What

**Published:** February 17, 2026

Training large language models is fundamentally a problem of resource management. Every parameter, gradient, activation, and optimizer state lives in GPU memory as a floating point number, and the choice of floating point format has a direct, measurable impact on how much memory you need, how fast your model trains, and whether training remains numerically stable. This post walks through the major floating point formats used in deep learning today, explains why some formats are dangerous, and provides practical guidance on when to use what. The material draws heavily from CS336 Lecture 2 notes on PyTorch and resource accounting.

## Why Precision Matters in Deep Learning

Everything in deep learning is stored as floating point numbers: model parameters, gradients, activations, and optimizer states (such as the first and second moment estimates in Adam). The data type you choose for these values determines two things: how many bytes each value occupies in memory, and how fast the hardware can process arithmetic on those values.

The default data type in PyTorch is `float32`, which uses 4 bytes per value. That sounds small until you consider the scale of modern models. A 70 billion parameter model requires 70 billion values just for the weights. At 4 bytes each, that is 280 GB of memory solely for the model parameters -- before you account for gradients, optimizer states, or activations. An Adam optimizer, for instance, stores two additional float32 values per parameter (the running mean and variance of gradients), tripling the parameter-related memory to 840 GB.

Reducing the precision from 4 bytes to 2 bytes per value cuts memory usage in half. Going to 1 byte cuts it to a quarter. But not all formats are created equal. The wrong choice can cause training to silently diverge due to numerical issues. Understanding the trade-offs is essential.

## Floating Point Formats Explained

A floating point number is represented by three components: a sign bit, exponent bits (which determine the range of representable values), and mantissa bits (which determine the precision within that range). More exponent bits mean you can represent very large and very small numbers. More mantissa bits mean you can distinguish between numbers that are close together.

### float32 (FP32)

The standard format: 1 sign bit + 8 exponent bits + 23 mantissa bits = 32 bits = 4 bytes.

Float32 offers excellent range (up to approximately 3.4 x 10^38) and high precision. It is the safe default and the format used for master copies of weights and optimizer states. The downside is cost: it is the most expensive format in both memory and compute.

### float16 (FP16)

Half precision: 1 sign bit + 5 exponent bits + 10 mantissa bits = 16 bits = 2 bytes.

Float16 halves the memory footprint compared to float32 and enables faster computation on hardware with Tensor Cores. However, it has a critical limitation: with only 5 exponent bits, its dynamic range is severely restricted. The maximum representable value is only 65,504, and very small values underflow to zero.

```python
import torch

# float16 underflow: small values become zero
x = torch.tensor([1e-8], dtype=torch.float16)
assert x == 0  # Underflow! This value is lost.
```

This underflow problem is not theoretical. During training, gradient values and loss terms can be extremely small. When they underflow to zero in float16, the model loses gradient information, which leads to training instability or outright divergence.

### bfloat16 (BF16)

Brain floating point: 1 sign bit + 8 exponent bits + 7 mantissa bits = 16 bits = 2 bytes.

Developed by Google Brain in 2018, bfloat16 makes a different trade-off than float16. It keeps the same 8 exponent bits as float32, preserving the full dynamic range, but reduces the mantissa to only 7 bits. This means bfloat16 has less precision than float16 (7 vs 10 mantissa bits), but it can represent the same range of magnitudes as float32.

```python
import torch

# bfloat16 preserves small values
x = torch.tensor([1e-8], dtype=torch.bfloat16)
assert x != 0  # No underflow! The value is preserved.
```

For deep learning, range matters far more than precision. Gradient values can span many orders of magnitude, but the exact precision of each gradient matters less. This insight is why bfloat16 has become the de facto standard for modern training.

### FP8

FP8 formats were standardized in 2022 specifically for machine learning workloads. At just 1 byte per value, FP8 offers the most aggressive memory savings. There are two variants, each optimized for different parts of training:

- **E4M3**: 1 sign bit + 4 exponent bits + 3 mantissa bits. Representable range is [-448, 448]. This variant provides better precision (more mantissa bits) and is typically used for the forward pass, where activation values tend to fall within a narrower range.

- **E5M2**: 1 sign bit + 5 exponent bits + 2 mantissa bits. Representable range is [-57344, 57344]. This variant provides better dynamic range (more exponent bits) and is typically used for the backward pass, where gradients can have larger magnitude variation.

### Comprehensive Comparison

| Format | Bits | Bytes | Exponent | Mantissa | Range | Use Case |
|--------|------|-------|----------|----------|-------|----------|
| float32 | 32 | 4 | 8 | 23 | +/-3.4e38 | Default, master weights |
| float16 | 16 | 2 | 5 | 10 | +/-65504 | Legacy mixed precision |
| bfloat16 | 16 | 2 | 8 | 7 | +/-3.4e38 | Modern training default |
| FP8 E4M3 | 8 | 1 | 4 | 3 | +/-448 | Forward pass |
| FP8 E5M2 | 8 | 1 | 5 | 2 | +/-57344 | Backward pass |

The key pattern in this table: as you move from float32 down to FP8, you trade precision and range for memory efficiency and compute speed. The art of mixed precision training is knowing where each format is safe to use.

## Why float16 Can Be Dangerous

The underflow problem with float16 deserves deeper examination because it is subtle and can cause silent failures.

With only 5 exponent bits, the smallest positive normal number representable in float16 is approximately 6.1 x 10^-5. Any value smaller than this underflows to zero. In deep learning, this is problematic in several ways:

1. **Gradient values** for parameters deep in a network can be very small, especially in models with many layers. When these gradients underflow to zero, the corresponding parameters stop updating entirely.

2. **Loss values** can become very small during training, particularly when using techniques like label smoothing or when the model is performing well. An underflowed loss produces zero gradients for the entire backward pass.

3. **Learning rate scaling** compounds the problem. If you use a small learning rate (say 1e-5) multiplied by an already-small gradient, the product can easily fall below float16's representable range.

To work around these issues, float16 mixed precision training requires a technique called **loss scaling**: artificially multiplying the loss by a large constant before the backward pass, then dividing the gradients by the same constant afterward. This shifts values into float16's representable range. While effective, it adds complexity and another hyperparameter to tune.

Bfloat16 sidesteps this entire problem. Because it shares float32's exponent range, the smallest representable values in bfloat16 are the same as in float32. No loss scaling is needed, and there is no risk of gradient underflow. This is why bfloat16 has largely replaced float16 for training.

## Why bfloat16 is the Sweet Spot

Bfloat16 has emerged as the default precision for modern deep learning training for several reinforcing reasons:

**Same dynamic range as float32.** With 8 exponent bits, bfloat16 can represent values across the same range of magnitudes as float32. This eliminates the underflow problem that plagues float16 and removes the need for loss scaling.

**Half the memory of float32.** At 2 bytes per value instead of 4, switching from float32 to bfloat16 for activations and intermediate computations cuts their memory footprint in half. For large models where activation memory is a bottleneck, this is a significant win.

**Hardware optimization.** Tensor Cores on modern NVIDIA GPUs (A100, H100) are specifically optimized for bfloat16 arithmetic. The A100 delivers 312 TFLOP/s in bfloat16 compared to 19.5 TFLOP/s in float32 -- a 16x difference in peak throughput. The H100 pushes bfloat16 throughput even higher to nearly 2 PFLOP/s.

**Reduced precision rarely matters.** The reduction from 23 mantissa bits (float32) to 7 mantissa bits (bfloat16) means bfloat16 can only distinguish about 1 in 128 values, compared to 1 in 8 million for float32. In practice, this reduced precision has negligible impact on training quality. Neural network training is inherently noisy due to stochastic gradient descent with mini-batches, and this noise far exceeds the rounding errors introduced by bfloat16.

## Mixed Precision Training Strategy

The term "mixed precision" is key: you do not use a single format everywhere. Instead, you use lower precision where you can afford it and higher precision where numerical accuracy is critical. This approach, first formalized by Micikevicius et al. in their 2017 paper "Mixed Precision Training," has become the standard practice.

### What Goes Where

- **Forward pass activations**: bfloat16 (or FP8 on H100s). These are computed once and consumed once, so reduced precision is acceptable. This is where the bulk of memory savings comes from.
- **Model parameters (master copy)**: float32. The optimizer updates are accumulated into this copy. Keeping it in float32 prevents small updates from being rounded away over thousands of steps.
- **Model parameters (compute copy)**: bfloat16. A lower-precision copy of the weights is used for the actual forward and backward passes. This copy is derived from the float32 master copy.
- **Gradients**: bfloat16 or float32, depending on the specific operation. Gradient accumulation should be done in float32.
- **Optimizer states**: float32. Adam's moment estimates need full precision to track gradient statistics accurately.

### PyTorch Implementation

PyTorch provides built-in support for mixed precision training through `torch.cuda.amp`:

```python
import torch
import torch.nn as nn

model = MyModel().cuda()
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-4)
criterion = nn.CrossEntropyLoss()

# Training loop with bfloat16 mixed precision
for input, target in dataloader:
    input, target = input.cuda(), target.cuda()
    optimizer.zero_grad()

    # Autocast handles precision for each operation
    with torch.cuda.amp.autocast(dtype=torch.bfloat16):
        output = model(input)
        loss = criterion(output, target)

    # Backward pass and optimizer step
    loss.backward()
    optimizer.step()
```

Note that when using bfloat16, you typically do not need a `GradScaler` (which is required for float16 to handle loss scaling). The autocast context manager automatically selects the appropriate precision for each operation -- matrix multiplications run in bfloat16 for speed, while reductions and normalization layers use float32 for numerical stability.

For float16, the full pattern with gradient scaling looks like this:

```python
scaler = torch.cuda.amp.GradScaler()

for input, target in dataloader:
    optimizer.zero_grad()

    with torch.cuda.amp.autocast(dtype=torch.float16):
        output = model(input)
        loss = criterion(output, target)

    # Scale loss to prevent gradient underflow
    scaler.scale(loss).backward()
    scaler.step(optimizer)
    scaler.update()
```

The additional complexity of `GradScaler` is one more reason to prefer bfloat16 when your hardware supports it.

## Model FLOPs Utilization (MFU)

Once you have chosen a precision format, the next question is: how efficiently are you actually using the hardware? Model FLOPs Utilization (MFU) is the standard metric for this:

```
MFU = (Actual FLOP/s achieved) / (Peak FLOP/s of the hardware)
```

A good MFU is 0.5 or above, meaning you are utilizing at least half of the hardware's theoretical peak throughput. In practice, MFU is limited by memory bandwidth, communication overhead (in distributed training), and pipeline bubbles.

Bfloat16 directly improves MFU because the peak FLOP/s of modern GPUs is dramatically higher for bfloat16 operations compared to float32. You are not just saving memory -- you are also making the arithmetic faster.

### Napkin Math: Training a 70B Model

Here is a back-of-the-envelope calculation for training a 70 billion parameter model on 15 trillion tokens using 1024 H100 GPUs:

```python
# Total compute required (Kaplan scaling approximation)
params = 70e9
tokens = 15e12
total_flops = 6 * params * tokens  # ~6.3e24 FLOPs

# H100 peak bfloat16 throughput (with sparsity)
h100_peak_flops = 1979e12  # ~1979 TFLOP/s
# Effective throughput (roughly half peak for dense ops)
h100_effective_flops = h100_peak_flops / 2  # ~990 TFLOP/s

# Assume MFU of 0.5 with 1024 GPUs
mfu = 0.5
num_gpus = 1024
aggregate_flops = h100_effective_flops * mfu * num_gpus  # ~507 PFLOP/s

# Time to train
seconds = total_flops / aggregate_flops
days = seconds / 86400  # ~about 14-15 days
print(f"Estimated training time: {days:.1f} days")
```

This estimate gives roughly 14 to 15 days of continuous training. Using float32 instead of bfloat16 would dramatically reduce the effective FLOP/s (since float32 Tensor Core throughput is much lower), potentially extending training time by an order of magnitude.

## Practical Recommendations

Based on the trade-offs discussed above, here are concrete recommendations for different scenarios:

### For Training

- **Use bfloat16 mixed precision as the default** on A100 and H100 GPUs. It provides the best balance of speed, memory efficiency, and numerical stability.
- **Never use pure float16 for training** without gradient scaling. The underflow risk makes it unreliable. Even with gradient scaling, prefer bfloat16 if your hardware supports it.
- **Always keep a float32 master copy of weights** for optimizer updates. Small gradient updates that would be rounded away in lower precision accumulate correctly in float32.
- **FP8 is viable on H100s** using the NVIDIA Transformer Engine library. It provides an additional 2x memory and compute advantage over bfloat16 but requires careful per-tensor scaling. Consider it for large-scale training runs where the engineering investment is justified.
- **Gradient accumulation should use float32** to prevent rounding errors from compounding over accumulation steps.

### For Inference

- Inference is more tolerant of reduced precision because there are no gradient updates to accumulate.
- **bfloat16 or float16** both work well for inference and cut memory in half.
- **INT8 quantization** (8-bit integer) can further reduce memory with minimal quality loss for most models.
- **INT4 quantization** enables running very large models on consumer GPUs, though some quality degradation is expected. Techniques like GPTQ and AWQ make this practical.

### Hardware Considerations

| GPU | float32 TFLOP/s | bfloat16 TFLOP/s | FP8 TFLOP/s | Recommended Format |
|-----|-----------------|-------------------|-------------|-------------------|
| V100 | 15.7 | N/A | N/A | float16 + GradScaler |
| A100 | 19.5 | 312 | N/A | bfloat16 |
| H100 | 67 | 990 | 1979 | bfloat16 or FP8 |

On older GPUs like the V100 that lack bfloat16 Tensor Core support, float16 with gradient scaling remains the best option. On A100 and newer, bfloat16 is strictly preferable.

## Conclusion

Mixed precision training is not optional for modern large-scale deep learning -- it is a necessity. The key takeaways are:

1. **bfloat16 is the modern default.** It preserves float32's dynamic range while halving memory usage and dramatically increasing compute throughput on modern GPUs. No loss scaling needed.

2. **float16 is legacy.** Its limited dynamic range causes underflow problems that require the added complexity of gradient scaling. Use it only on hardware that does not support bfloat16.

3. **FP8 is the frontier.** Available on H100 GPUs, it offers another 2x improvement over bfloat16. The two variants (E4M3 for forward, E5M2 for backward) are designed to match the numerical requirements of each training phase.

4. **Mixed means mixed.** Use lower precision for compute-heavy operations (matrix multiplications, activations) and higher precision for numerically sensitive operations (weight updates, gradient accumulation, normalization).

5. **Always keep float32 master weights.** Regardless of what precision you use for computation, the optimizer should update a float32 copy of the weights. This ensures small updates are not lost to rounding.

The choice of floating point format is one of the most impactful decisions in training infrastructure. Getting it right saves memory, reduces training time, and avoids subtle numerical bugs. Getting it wrong can waste GPU-hours on a run that was never going to converge.
