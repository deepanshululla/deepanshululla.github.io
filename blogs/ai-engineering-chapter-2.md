# AI Engineering by Chip Huyen: Chapter 2 Notes and Summary

**Published:** June 22, 2025

## Chapter 2: Understanding Foundation Models
### Overview

- Foundation model design choices (training data, architecture/size, post-training) are increasingly opaque.
- The training process splits into **pre-training** (makes model capable) and **post-training** (aligns model to human preferences).
- **Sampling** (how outputs are chosen from all possibilities) is a crucial, often-underestimated factor impacting model behavior and performance.

---

### Training Data

- **Data Coverage:** A model can only do tasks present in its training data. E.g., no Vietnamese data → no Vietnamese translation.
- **Data Acquisition Challenges:** Gathering sufficient, quality training data is hard and expensive. Developers often use what’s available.
- **Common Crawl** is a frequent source; Google’s **C4** is a cleaned subset.
- 
**Data Volume vs. Quality:** More data does not always yield better models. High-quality, focused data can outperform sheer quantity.

*Example:* A small, high-quality coding dataset produced a model that beat larger models on coding benchmarks.

#### Multilingual Models

- **English Dominance:** General models perform best in English; less so in under-represented languages (e.g., Telugu, Marathi, Punjabi).
- **Translation Limitations:** Translating queries to/from English can cause information loss and is not always effective—requires some base understanding and can lose cultural/structural language features.
- **Behavioral Issues:** Models may behave differently in different languages (e.g., more likely to produce misinformation in Chinese).
- **Tokenization Efficiency:** Some languages (e.g., Burmese, Hindi) require many more tokens to express the same meaning as English, increasing cost and latency.

#### Domain-Specific Models

- **Coverage Limits:** General-purpose models (e.g., Gemini, GPTs) span many domains thanks to broad training data, but lack depth for highly specialized tasks.
- **Analysis Gaps:** There are few studies on vision model domain coverage due to the challenge of categorizing images.
- **Benchmarking:** CLIP and Open CLIP show performance variation across domains like birds, cars, flowers.
- 
**Specialized Needs:** For tasks like drug discovery and cancer screening, domain-specific data is needed, often not publicly available.

**Training Domain-Specific Models:** These require curated datasets. Examples include:

- 
DeepMind’s AlphaFold (proteins)

- 
NVIDIA’s BioNeMo (biomolecular data)

- 
Google’s Med-PaLM2 (medical data)

---

### Modeling
#### Model Architecture

- **Transformer Dominance:** Transformers (based on attention) are now the leading architecture for language models, replacing earlier sequence models (RNN-based seq2seq).
- 
**Attention Mechanism:** Allows focusing on relevant parts of input, enabling parallel input processing (faster), but outputs are still generated sequentially.

**QKV (Query, Key, Value):** The core of attention; allows the model to weigh different parts of input.
- **Multi-Headed Attention:** Multiple “heads” let the model attend to various token groups simultaneously.

- **Transformer Block:** Contains attention and MLP (multi-layer perceptron) modules. The architecture is also wrapped with embedding and output layers.
- **Context Length Limitation:** Model’s ability to consider context depends on positional embedding and memory.

#### Other Architectures

- **Alternatives to Transformers:** Past and emerging models (e.g., seq2seq, GANs, RWKV, SSMs, Mamba, Jamba) aim to overcome transformers’ limitations (esp. with long sequences).
- **State Space Models:** Show promise for handling long contexts more efficiently (linear vs. quadratic scaling).

#### Model Size

- 
**Scale Correlates with Performance:** More parameters generally improve learning capacity—though new generations are more efficient at the same size.

- 
**Storage & Compute:** Parameters and dataset tokens influence hardware and training requirements; sparsity can reduce effective resource needs.

- 
**FLOPs (Floating Point Operations):** Used to measure compute requirements; not to be confused with FLOP/s (rate).

- 
**Costs & Scaling Laws:** Compute, time, and money required for training scales quickly with model size. The **Chinchilla scaling law** suggests optimal ratios between model size and dataset size for given compute budgets.

*Example Cost Calculation:* Training GPT-3-175B at 70% utilization on 256 H100 GPUs could cost over \$4 million.

- 
**Production Tradeoffs:** Sometimes smaller models are favored for usability, despite marginal performance loss.

#### Scaling Extrapolation

- **Hyperparameter Transfer:** Due to high costs, hyperparameters are often transferred from small to large models.
- **Emergent Abilities:** Some capabilities only emerge at scale, making extrapolation imperfect.

#### Scaling Limits

- **Data & Electricity Constraints:** As model/data size grows, training becomes bottlenecked by data and power availability. There’s a risk of exhausting public internet data for further training.

---

### Post-Training

- **Purpose:** Addresses two main pre-training issues—models aren’t optimized for conversation and may be unsafe/offensive.
- 
**Two Steps:**

**Supervised Finetuning (SFT):** Trains the model on high-quality instruction data (prompt, response pairs).
- **Preference Finetuning:** Further aligns responses with human values, often via **RLHF** (Reinforcement Learning from Human Feedback) or newer methods like DPO.

- **Resource Allocation:** Post-training is a small fraction of total compute (e.g., 2% for InstructGPT).
- **SFT Data:** High-quality demonstration data is costly and requires skilled labelers. Some companies use heuristics or synthetic data.
- 
**Preference Finetuning:** Trains a reward model (typically via comparisons/ranking) to score outputs, and further optimizes the model to maximize this score.

**Reward Models:** Can be trained from scratch or finetuned atop a strong base model.
- **Alternatives:** Some companies skip RL and use “best of N” (generate several outputs, pick highest-scoring).

---

### Sampling
#### Fundamentals

- **Probabilistic Output:** LLMs generate a distribution over possible next tokens. Greedy sampling (always pick max) yields dull responses.
- **Logits & Probabilities:** Neural nets output logits (unnormalized scores), which are converted to probabilities via softmax.

#### Sampling Strategies

- 
**Temperature:** Adjusts creativity—higher = more diverse, lower = more predictable.

Setting temperature to 0 picks the highest probability token deterministically.

- **Top-k Sampling:** Only considers the k most probable tokens, balancing diversity and computation.
- **Top-p (Nucleus) Sampling:** Dynamically chooses a set of tokens whose cumulative probability reaches p, adapting to the context.
- **Stopping Condition:** Output length can be managed via fixed token count or stop tokens, impacting latency and cost.

---

### Test-Time Compute

- **Best-of-N:** Generate multiple outputs per query and select the best (by probability, logprob, or reward model/verifier).
- **Logprob Scoring:** Log probabilities are summed (or averaged for fairness to length) to select the best candidate.
- **Verifier/Reward Model:** Use a secondary model to judge and pick the best output; can yield performance boosts similar to much larger models.
- **Heuristics:** Choose outputs by application-specific rules (e.g., shortest, valid SQL, most common answer).
- **Practical Impact:** Robustness benefits more from sampling multiple outputs when the model is less stable. Sampling can increase answer quality, reduce errors, and overcome latency by selecting the first valid response.

---

### Structured Outputs

- 
**Use Cases:**

Tasks needing structured outputs (e.g., text-to-SQL, API calls).
- Outputs for downstream machine consumption (e.g., JSON, YAML).

- 
**Techniques:**

**Prompting:** Instructing the model to follow a format.
- **Validation/Post-processing:** Use secondary checks or scripts to fix/validate outputs.
- **Constrained Sampling:** Filters logits to only allow format-compliant tokens; requires format grammar.
- **Finetuning:** Most reliable—train model on data with desired structure.

- **Frameworks:** Tools like guidance, outlines, instructor, and llama.cpp help generate and validate structured outputs. OpenAI’s JSON mode is an API-level solution.
- **Cost vs. Reliability:** Additional validation steps increase cost/latency, but boost format reliability.

---

### The Probabilistic Nature of AI

- 
**Probabilistic Outputs:** AI models sample outputs from probability distributions, making their responses inherently random and creative.

**Excitement:** This enables exploration and creativity—models can “think outside the box” and be valuable creative partners.

- 
**Challenge:** Anything with non-zero probability—even if incorrect or unusual—can be generated, making engineering for reliability and safety a core concern.

#### Inconsistency

- 
**Manifestations:**

**Same input, different outputs:** Repeating a prompt can yield different responses.

- 
**Slightly different input, drastically different outputs:** Minor prompt changes (like capitalization) can trigger widely varying outputs.

- 
**Impact:** Inconsistency can erode user trust and create a jarring experience.

- 
**Mitigation:** Techniques include caching answers, fixing sampling variables (temperature, top-k/p), and setting a random seed. *However, even with these, 100% consistency is not guaranteed*—differences in hardware can also matter.

#### Hallucination

- 
**Definition:** A model generates outputs not grounded in reality or the training data—essentially, making things up.

- 
**Origins:** While randomness can play a part, hallucination is deeper. Anything possible—even if not factual—can be output.

- 
**Types:**

*Snowballing hallucination*: A model justifies an initial error with further made-up details.

- 
*Knowledge mismatch*: When training responses use knowledge the model lacks, it may be forced to hallucinate to mimic responses.

- 
**Mitigation:** Includes differentiating user-provided vs. model-generated tokens (RL), adding factual/counterfactual training signals (supervised learning), and prompting the model to answer truthfully or abstain if uncertain.

- 
**RLHF Impact:** RLHF may help or worsen hallucinations; empirical results are mixed.

---

## Key Takeaways (by Section)

- **Training Data:** The quality, diversity, and representativeness of data crucially shape model abilities and biases.
- **Modeling:** Architecture, size, and training approaches (and their tradeoffs) drive what a model can and cannot do.
- **Scaling Laws:** Compute, data, and architecture must be balanced for optimal model development; costs and practicalities set real-world limits.
- **Post-Training:** Alignment to human values is layered atop base model training via SFT and preference techniques (e.g., RLHF).
- **Sampling:** Output diversity and creativity are controlled by sampling strategies (temperature, top-k, top-p).
- **Test-Time Compute:** Generating and scoring multiple outputs can dramatically improve quality—sometimes as much as scaling the model.
- **Structured Outputs:** Reliable format adherence requires a mix of prompting, validation, constrained sampling, and finetuning.
- 
**Probabilistic Nature:** All outputs are ultimately the result of probabilistic sampling from distributions shaped by the above choices.

Inconsistency: Results from probabilistic sampling; can be mitigated but not eliminated.

- 
Hallucination: Can occur due to the probabilistic, aggregate nature of training; is complex to address and subject of ongoing research.