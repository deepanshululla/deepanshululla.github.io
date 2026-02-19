# AI Engineering Book by Chip Huyen: Chapter 1 High level insights

**Published:** 2025-06-22

![AI engineering foundations](https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop&q=80)

## Chapter 1 Summary: Introduction to Building AI Applications with Foundation Models
### 1. The Scaling Up of AI Models

- Foundation models like ChatGPT and Gemini are highly powerful but require enormous compute resources and vast amounts of data.
- Only a few organizations have the capability to train these models, leading to the “model as a service” approach, where others can access AI via APIs.

### 2. Rise of AI Engineering

- Foundation models have roots in decades of language modeling research, from the 1950s onward.
- Today’s LLMs evolved through advances such as self-supervised learning and scaling up data and compute.

### 3. Language Models and Tokenization

- Language models predict the likelihood of words/tokens in context and can operate over multiple languages.
- Text is broken into “tokens” (pieces of words, words, or characters), making models efficient and capable of understanding new words by decomposition.
- The vocabulary size and tokenization method are determined by model developers (e.g., GPT-4’s vocabulary is 100,256 tokens).

#### Why Tokens?

- Tokens balance meaningful representation, efficient model size, and the ability to handle unknown/new words.

### 4. Types of Language Models

- **Masked Language Models** (e.g., BERT): Predict missing tokens using context from both sides. Good for non-generative tasks and understanding context.
- **Autoregressive Language Models**: Predict the next token using only previous tokens; core to generative AI applications like text generation.

### 5. Self-Supervision

- LLMs use self-supervised learning, where models learn to predict parts of their own input data, vastly reducing the need for manual labeling.
- This allows training at massive scale compared to traditional supervised approaches.
- The number of model parameters determines what is considered "large"; this threshold has increased over time as models have grown.

### 6. From LLMs to Foundation and Multimodal Models

- Foundation models can work with multiple data modalities (text, image, video, etc.).
- Multimodal models use self-supervision across modalities, such as pairing images and text (e.g., CLIP model).
- These models mark a shift from task-specific to general-purpose AI, capable of many tasks out of the box and adaptable via prompt engineering, retrieval-augmented generation (RAG), or fine-tuning.

### 7. From Foundation Models to AI Engineering

- AI engineering is the discipline of building applications on top of foundation models.
- “Model as a service” enables rapid development, democratizes access, and accelerates AI adoption.
- Coding, image/video production, writing, education, conversational bots, information aggregation, data organization, and workflow automation are prominent use cases.
- Enterprises often adopt lower-risk internal use cases first; exposure of occupations to AI varies widely.

### 8. Planning AI Applications

- Evaluating the business need and impact of AI is crucial: existential risk, productivity gains, or keeping pace with innovation.
- Define success metrics early (automation rates, labor savings, response times).
- Initial progress is often rapid, but perfecting applications to production quality is much more difficult and time-consuming.

### 9. Maintenance

- AI products require ongoing maintenance due to the fast pace of model and infrastructure evolution.
- Regulatory changes (GDPR, export controls) and market shifts (cost, IP) can introduce new risks and costs.

### 10. The AI Engineering Stack

- 
**Three layers:**

**Application Development**: Prompts, context, evaluation, and user interface.
- **Model Development**: Training, fine-tuning, dataset engineering, and inference optimization.
- **Infrastructure**: Serving models, managing compute/data, monitoring.

- Growth has been fastest in application development, with infrastructure needs remaining stable.

### 11. AI Engineering vs. ML Engineering

- Traditional ML engineering focused on training proprietary models; AI engineering emphasizes model adaptation and evaluation using externally-provided models.
- AI engineering must handle larger models, higher compute, and open-ended outputs, making efficient inference and robust evaluation more critical.

#### Model Adaptation

- **Prompt-based adaptation:** Uses instructions and context without changing model weights.
- **Fine-tuning:** Updates model weights for higher performance but requires more expertise and data.

#### Model Development Responsibilities

- Modeling/training, dataset engineering, and inference optimization are all important, with increased focus on inference and data quality in foundation model era.

#### Application Development Responsibilities

- Differentiation now comes from the application layer: evaluation, prompt engineering, and user interface design are key.
- Open-ended tasks and various adaptation techniques make robust evaluation both more important and more challenging.

## References

- Huyen, C. (2025). *AI Engineering*. O'Reilly Media. Chapter 1: Introduction to Building AI Applications with Foundation Models.
- Bommasani, R., Hudson, D.A., Adeli, E., et al. (2021). "On the Opportunities and Risks of Foundation Models." [arXiv:2108.07258](https://arxiv.org/abs/2108.07258)
- Villalobos, P., Sevilla, J., Heim, L., et al. (2022). "Will we run out of data? An analysis of the limits of scaling datasets in Machine Learning." [arXiv:2211.04325](https://arxiv.org/abs/2211.04325)
- Eloundou, T., Manning, S., Mishkin, P., and Rock, D. (2023). "GPTs are GPTs: An Early Look at the Labor Market Impact Potential of Large Language Models." [arXiv:2303.10130](https://arxiv.org/abs/2303.10130)
- Radford, A., Kim, J.W., Hallacy, C., et al. (2021). "Learning Transferable Visual Models From Natural Language Supervision (CLIP)." [arXiv:2103.00020](https://arxiv.org/abs/2103.00020)
- Devlin, J., Chang, M.W., Lee, K., and Toutanova, K. (2018). "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding." [arXiv:1810.04805](https://arxiv.org/abs/1810.04805)
- Hendrycks, D., Burns, C., Basart, S., et al. (2020). "Measuring Massive Multitask Language Understanding (MMLU)." [arXiv:2009.03300](https://arxiv.org/abs/2009.03300)
- Park, J.S., O'Brien, J.C., Cai, C.J., et al. (2023). "Generative Agents: Interactive Simulacra of Human Behavior." [arXiv:2304.03442](https://arxiv.org/abs/2304.03442)
- Ding, N., Chen, Y., Xu, B., et al. (2023). "Enhancing Chat Language Models by Scaling High-quality Instructional Conversations (UltraChat)." [arXiv:2305.14233](https://arxiv.org/abs/2305.14233)