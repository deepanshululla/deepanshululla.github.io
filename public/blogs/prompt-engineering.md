# AI Engineering: Prompt Engineering

**Published:** August 3, 2025

![Crafting effective AI prompts](https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop&q=80)

Prompt engineering is the craft of designing instructions to guide AI models toward desired outputs. It is the simplest and most common adaptation technique -- no model weights are changed, yet it can dramatically improve performance. This post covers the principles, techniques, and practical patterns for effective prompt engineering, drawing from the DeepLearning.AI course by Andrew Ng and Isa Fulford, and Chip Huyen's *AI Engineering*.

## Two Types of LLMs

Before diving into prompting techniques, it is important to understand the distinction between the two types of LLMs you might interact with:

**Base LLMs** are trained to predict the next token based on training data. If you give a base LLM the prompt "What is the capital of France?", it might respond with "What is the largest city in France? What is the population of France?" -- because in its training data, a list of questions often follows a question.

**Instruction-tuned LLMs** are base models that have been further trained (via supervised finetuning and RLHF) to follow instructions. These are the models most people interact with today (ChatGPT, Claude, Llama-chat). Given the same prompt, an instruction-tuned model would answer "The capital of France is Paris."

All of the techniques in this post are designed for instruction-tuned LLMs.

## Core Principles

The DeepLearning.AI course distills prompt engineering into two foundational principles:

### Principle 1: Write Clear and Specific Instructions

Clear does not mean short. A longer, more detailed prompt often produces better results than a brief one, because it gives the model more information about what you want.

**Tactic 1: Use delimiters to mark distinct sections.** Delimiters like triple backticks, triple quotes, XML tags, or dashes clearly separate the instruction from the input data. This also helps prevent **prompt injection** -- if user-provided text contains instructions, delimiters prevent the model from treating them as part of your prompt.

```python
prompt = f"""Summarize the text delimited by triple backticks.
```{user_provided_text}```"""
```

**Tactic 2: Ask for structured output.** Requesting JSON, HTML, or markdown tables makes responses easier to parse programmatically and forces the model to organize its thinking.

```
Generate a list of three fictional book titles with their authors and genres.
Return as a JSON array with keys: title, author, genre.
```

**Tactic 3: Check whether conditions are satisfied.** Ask the model to verify preconditions before generating output. This prevents the model from making assumptions or hallucinating when the input does not match expectations.

```
If the text below contains a sequence of instructions, rewrite them as numbered steps.
If the text does not contain instructions, write "No steps provided."
```

**Tactic 4: Few-shot prompting.** Provide examples of successful task completion before asking the model to perform the task. This is one of the most effective techniques for controlling output format and style.

```
Classify the sentiment:
"Great product!" → Positive
"Terrible quality" → Negative
"It was okay" → Neutral
"Amazing experience!" → ?
```

### Principle 2: Give the Model Time to Think

When a task requires reasoning, explicitly ask the model to work through the problem step by step rather than jumping to an answer.

**Tactic 1: Specify the steps required to complete a task.**

```
Perform the following steps:
1. Summarize the text in one sentence.
2. Translate the summary into French.
3. List the key names mentioned in the French summary.
4. Output a JSON object with keys: summary, translation, names.
```

**Tactic 2: Instruct the model to work out its own solution before evaluating.** This is a powerful pattern for tasks like grading or code review. If you ask the model to directly evaluate a student's answer, it may be biased by seeing the answer first. Instead, ask it to solve the problem independently, then compare.

```
First, work out your own solution to the math problem.
Then compare your solution with the student's solution.
Determine whether the student's solution is correct.
Do not decide if the student is correct until you have solved it yourself.
```

## Prompt Engineering Techniques

### Zero-Shot Prompting

Asking the model to perform a task with no examples. Works best for tasks the model already handles well from its training.

```
Classify the sentiment of this review as Positive, Negative, or Neutral:
"The product exceeded my expectations!"
```

### Few-Shot Prompting

Providing examples to guide the model's behavior. The number of examples (1-5) depends on task complexity. Few-shot is especially effective for:

- Format specification (showing the exact output structure)
- Style matching (matching a particular writing voice)
- Classification (establishing category boundaries)
- Complex reasoning (demonstrating the expected reasoning process)

### Chain-of-Thought (CoT) Prompting

Encouraging step-by-step reasoning by either demonstrating it (few-shot CoT) or simply adding "Let's think step by step" (zero-shot CoT).

```
Solve this step by step:
If a train travels 60 mph for 2 hours, then 80 mph for 1 hour,
what is the average speed?

Step 1: Distance at 60 mph = 60 x 2 = 120 miles
Step 2: Distance at 80 mph = 80 x 1 = 80 miles
Step 3: Total distance = 120 + 80 = 200 miles
Step 4: Total time = 2 + 1 = 3 hours
Step 5: Average speed = 200 / 3 = 66.67 mph
```

### Self-Consistency

Generate multiple responses to the same prompt (using temperature > 0) and select the most common answer. This is especially effective for math and reasoning tasks where the model may take different correct paths to the same answer. The majority vote reduces the impact of individual reasoning errors.

### Tree-of-Thoughts

Extends chain-of-thought by exploring multiple reasoning paths in parallel, evaluating each branch, and selecting the most promising one. More expensive but more thorough for complex reasoning tasks.

## Practical LLM Capabilities

Modern instruction-tuned LLMs are remarkably versatile. Here are concrete patterns for common tasks:

### Summarization

Beyond basic summarization, you can control the output precisely:

- **Length control**: "Summarize in at most 30 words"
- **Audience focus**: "Summarize for a shipping department, focusing on delivery timelines"
- **Extract vs. summarize**: Use "extract" when you want only information relevant to a specific topic, and "summarize" when you want a general overview. Extraction is more targeted and avoids including tangential details.

### Inference and Analysis

LLMs excel at extracting structured information from unstructured text:

- **Sentiment analysis**: Classify text as positive, negative, or neutral
- **Emotion identification**: Detect specific emotions (happy, frustrated, surprised)
- **Named entity recognition**: Extract people, places, organizations, products
- **Topic extraction**: Identify the main topics discussed in a text
- **Multi-task inference**: Combine multiple extraction tasks into a single prompt for efficiency

```
Analyze the following review and return a JSON object with:
- sentiment: positive/negative/neutral
- emotions: list of detected emotions
- product_mentioned: the product name
- is_angry: true/false
```

### Transformation

Converting text between formats, languages, and styles:

- **Translation**: Between languages, including detection of the source language
- **Tone transformation**: Formal to informal, technical to layperson
- **Format conversion**: JSON to HTML, CSV to markdown table
- **Spell and grammar checking**: Proofread and correct text, optionally showing diffs

### Expansion

Generating longer content from shorter input:

- **Email generation**: Given a topic and sentiment, generate a full email response
- **Content elaboration**: Given bullet points, generate a full paragraph or article

## Understanding Temperature

Temperature is the single most important parameter for controlling LLM output diversity. It modifies the softmax probability distribution over the vocabulary before sampling.

Given logits `[z1, z2, ..., zn]` and temperature `T`, the probability of token `i` is:

```
P(token_i) = exp(z_i / T) / sum(exp(z_j / T) for all j)
```

**Temperature = 0**: The model always picks the highest-probability token (greedy decoding). Output is deterministic and repetitive. Best for factual queries and classification.

**Temperature = 1**: The default. Uses the model's learned probability distribution as-is.

**Temperature > 1**: Flattens the distribution, making less probable tokens more likely. Output is more creative and varied, but also more prone to errors.

Concrete example with logits `[1, 2]`:
- At T=1.0: probabilities are [0.27, 0.73]
- At T=0.5: probabilities are [0.12, 0.88] (more concentrated on the top choice)

For most production applications, use temperature 0 or very low (0.1-0.3). Reserve higher temperatures for creative tasks like brainstorming or story generation.

## The System Message

The system message is a powerful but often underutilized feature. It lets you frame the conversation's behavior without making the instructions visible to the user in the chat interface.

```python
messages = [
    {"role": "system", "content": "You are a helpful customer service agent for Acme Corp. "
                                   "Always be polite. Never discuss competitor products. "
                                   "If you don't know the answer, say so and offer to escalate."},
    {"role": "user", "content": "Why is your product so expensive?"}
]
```

System messages are ideal for:
- Setting the agent's persona and tone
- Establishing rules and constraints
- Providing background context the user does not need to see
- Defining output format requirements

## Iterative Prompt Development

Prompt engineering is inherently iterative. The process mirrors the scientific method:

1. **Start with a clear task definition** and a simple prompt
2. **Test with representative inputs** and examine the outputs
3. **Identify failure modes**: Is the output too long? Wrong format? Missing key information? Wrong audience?
4. **Refine the prompt** to address each specific issue
5. **Repeat** until the prompt reliably produces acceptable outputs

A concrete example of iterative refinement for a product description task:

- **Issue 1 (too long)**: Add "Use at most 50 words"
- **Issue 2 (wrong focus)**: Add "The description is intended for furniture retailers, so focus on materials, construction, and dimensions"
- **Issue 3 (missing format)**: Add "Format the output as HTML with a product title in an h2 tag and a table of technical specifications"

Each iteration addresses one specific failure mode. This systematic approach is more reliable than trying to write the perfect prompt on the first attempt.

## Hallucination

LLMs do not know the boundaries of their own knowledge. When asked about something outside their training data, they will confidently generate plausible-sounding but fabricated information. This is called hallucination.

Mitigation strategies:
- Ask the model to cite specific passages from provided context (RAG)
- Instruct the model to say "I don't know" when uncertain
- Use low temperature for factual queries
- Verify important claims programmatically or with a second model

## Prompt Engineering in Production

### Version Control

Treat prompts as code. Track versions, document changes, and maintain a prompt library. When a prompt change improves one metric, verify it does not regress others.

### Measuring Effectiveness

Key metrics to track:
- **Accuracy**: Correctness of outputs on labeled test sets
- **Consistency**: Stability across runs (especially at temperature > 0)
- **Latency**: Token count directly impacts response time and cost
- **Cost**: Longer prompts cost more -- balance detail with efficiency

### Common Pitfalls

- **Overloading the prompt**: Trying to handle too many edge cases in a single prompt. Consider splitting into multiple specialized prompts with a router.
- **Ignoring the model's strengths**: Highly detailed step-by-step instructions for tasks the model already does well can actually reduce quality by constraining its reasoning.
- **Not testing adversarially**: Always test with inputs designed to break the prompt (edge cases, prompt injection attempts, ambiguous queries).

## Conclusion

Prompt engineering is both an art and a science. The key takeaways:

- **Two principles**: Write clear, specific instructions; give the model time to think
- **Few-shot prompting** is the single most effective technique for controlling output format and behavior
- **Temperature** controls the exploration-exploitation tradeoff -- use low temperature for factual tasks, higher for creative ones
- **Iterate systematically**: Identify specific failure modes and address them one at a time
- **Delimiters prevent prompt injection** and keep your instructions separate from user-provided data
- **Treat prompts as production code**: Version control, test, measure, and monitor

Mastering prompt engineering is essential for building effective AI applications. It is the lowest-cost, lowest-risk way to improve model performance, and it compounds -- better prompts make every other technique (RAG, fine-tuning, agents) work better too.

## References

- Ng, A. and Fulford, I. "ChatGPT Prompt Engineering for Developers." [DeepLearning.AI](https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/)
- Wei, J., Wang, X., Schuurmans, D., et al. (2022). "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models." [arXiv:2201.11903](https://arxiv.org/abs/2201.11903)
- Wang, X., Wei, J., Schuurmans, D., et al. (2022). "Self-Consistency Improves Chain of Thought Reasoning in Language Models." [arXiv:2203.11171](https://arxiv.org/abs/2203.11171)
- Yao, S., Yu, D., Zhao, J., et al. (2023). "Tree of Thoughts: Deliberate Problem Solving with Large Language Models." [arXiv:2305.10601](https://arxiv.org/abs/2305.10601)
- Huyen, C. (2025). *AI Engineering*. O'Reilly Media. Chapter 4: Prompt Engineering.
