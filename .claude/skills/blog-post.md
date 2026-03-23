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

Rules:
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
- Write in a professional, practical tone aimed at software engineers
- Include mermaid diagrams where they help visualize concepts (the site supports mermaid v10 with custom pink/blue theme)
- Supported code highlighting languages: python, javascript, bash, json, sql, yaml, cpp, java

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
