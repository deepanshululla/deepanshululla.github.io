---
name: blog-post
description: Create a new blog post for deepanshululla.com following all project conventions
user_invocable: true
---

# Blog Post Creation Skill

Create a new blog post for the personal website at deepanshululla.com.

## Input

The user will provide either:
- A topic/title and content direction
- Source notes (e.g., from Obsidian) to transform into a blog post
- A URL or document to summarize as a blog post

## Steps

### 1. Determine Post Metadata

Ask the user (if not provided):
- Post title
- Category (common ones: "AI/ML", "Software Engineering", "Leadership", "Data Science", "Books")
- One-sentence excerpt/description

Derive from the title:
- `id`: kebab-case slug (e.g., "mixed-precision-training")
- `filename`: same as id with `.md` extension
- `date`: today's date in YYYY-MM-DD format

### 2. Write the Markdown File

Create the file at `blogs/{filename}` following this exact format:

```
# Post Title

**Published:** Month Day, Year

Introductory paragraph summarizing the post.

## First Section

Content...

### Subsection (if needed)

Content...

## Conclusion

Key takeaways as a summary.
```

Format rules:
- Line 1: `# Title` (H1 heading)
- Line 3: `**Published:** Month Day, Year` (e.g., `**Published:** February 17, 2026`)
- Line 5+: Introductory paragraph
- Sections use `##`, subsections use `###`
- Use markdown tables (`| Col1 | Col2 |`) for comparisons
- Use fenced code blocks with language tags (```python, ```cpp, ```java, etc.)
- End with a `## Conclusion` section
- File ends with a trailing blank line
- NO emojis in blog post content
- Use `—` (em dash) not `--` for dashes
- Supported code highlighting languages: python, javascript, bash, json, sql, yaml, cpp, java

### Content Quality Guidelines

**Writing style:**
- Write in a professional, practical tone aimed at software engineers
- Lead with a hook — open with a relatable scenario, a surprising fact, or a concrete problem the reader has faced. Do not open with "In this post we will discuss..."
- Use concrete engineering examples (real systems, real scenarios) rather than abstract explanations. Show, don't tell
- Explain the "why" before the "how" — readers need motivation before mechanics
- Use analogies to connect unfamiliar concepts to things engineers already know (e.g., compare database indexing to a book's index)
- Keep paragraphs short (3-5 sentences max). Dense walls of text lose readers
- Use bold for key terms on first introduction, and inline code for technical identifiers
- End each major section with a brief takeaway or transition sentence that connects to the next section
- The conclusion should not just summarize — it should give the reader a clear next step or a new way to think about the topic

**Making content interesting:**
- Include "war stories" or real-world failure scenarios where applicable — engineers learn more from what goes wrong than what goes right
- Add comparison tables when discussing tradeoffs between approaches (e.g., microservices vs monolith, different database choices)
- Include code snippets that the reader can actually run or adapt — not toy examples but realistic patterns
- When discussing a concept, show both the naive/wrong approach and the correct approach side by side
- Ask rhetorical questions to create engagement ("What happens when the queue fills up? Most engineers assume...")
- Reference specific numbers, benchmarks, or scale where possible — "reduces latency by 40%" is more compelling than "improves performance"

### Diagrams and Visual Design

Every post should include at least 2-3 mermaid diagrams to break up text and visualize key concepts. The site supports mermaid v10 with a custom pink/blue theme.

**When to use diagrams:**
- Architecture or system design overviews (use `graph TD` or `graph LR`)
- Process flows and decision trees (use `flowchart TD`)
- Interaction sequences between components (use `sequenceDiagram`)
- Comparisons of approaches showing divergent paths and outcomes
- Mental models and frameworks with multiple interconnected concepts

**Diagram style rules:**
- Use descriptive node labels, not abbreviations (e.g., `[Load Balancer]` not `[LB]`)
- Color-code outcomes: green (`fill:#ccffcc`) for positive/correct paths, red (`fill:#ffcccc`) for negative/wrong paths, yellow (`fill:#fff3cd`) for neutral/decision points
- Keep diagrams focused — max 10-15 nodes. Split complex diagrams into multiple smaller ones
- Use subgraphs to group related components when showing system architecture
- Place diagrams after the paragraph that introduces the concept they visualize, not before

**Mermaid syntax examples that work well on this site:**

Flowchart with styled nodes:
```
graph TD
    A[Input] --> B{Decision?}
    B --> |Yes| C[Good Path]
    B --> |No| D[Bad Path]
    style C fill:#ccffcc
    style D fill:#ffcccc
```

Sequence diagram:
```
sequenceDiagram
    participant C as Client
    participant S as Server
    C->>S: Request
    S->>C: Response
```

Architecture with subgraphs:
```
graph TD
    subgraph Frontend
        A[React App] --> B[API Client]
    end
    subgraph Backend
        C[API Gateway] --> D[Service]
    end
    B --> C
```

**Other visual elements:**
- Use markdown tables for side-by-side comparisons (at least one per post when comparing approaches)
- Use blockquotes (`>`) for key insights, memorable quotes, or important warnings
- Use horizontal rules (`---`) to separate major conceptual shifts within a post

### 3. Copy to public/blogs/

Copy the identical file to `public/blogs/{filename}`. Both directories MUST stay in sync.

### 4. Update blog-posts.json

Add a new entry at the **top** of the JSON array (newest first) in `blogs/blog-posts.json`:

```json
{
  "id": "kebab-case-slug",
  "title": "Full Post Title",
  "date": "YYYY-MM-DD",
  "excerpt": "One-sentence description of the post.",
  "filename": "kebab-case-slug.md",
  "categories": ["Category"]
}
```

Then copy `blogs/blog-posts.json` to `public/blogs/blog-posts.json` to keep them in sync.

### 5. Blog Post Images (if needed)

- Store images in `public/blogs/images/` only (no duplication in `blogs/`)
- Use absolute paths in markdown: `![Alt text](/blogs/images/filename.png)`
- Optional captions: place `*Caption text*` on the line immediately after the image
- Use descriptive filenames prefixed with the post slug: `speculative-decoding-draft-verify.png`

### 6. Verify

After creating the post:
- Confirm the file exists in both `blogs/` and `public/blogs/`
- Confirm `blog-posts.json` is updated in both directories
- Remind the user to run `./deploy.sh` to publish to deepanshululla.com

## Series Posts

If creating a series of related posts (like a book chapter series):
- Add chapter numbers to titles: `# Book Name Ch. 1: Chapter Title`
- Add a `## Series Navigation` section at the end with links to all chapters
- Use hash routing format for links: `[Ch. 1: Title](/#/blog/post-slug)`
- Bold the current chapter (not a link): `**Ch. 1: Title** (you are here)`
