# CLAUDE.md

## Project Overview

Personal portfolio website for deepanshululla.com, hosted on GitHub Pages.

## Tech Stack

- **Framework:** React 16 (Create React App)
- **Routing:** react-router v3
- **Styling:** Bootstrap 3, custom CSS in `template-css/`
- **Markdown Rendering:** `marked` library for blog posts
- **Deployment:** GitHub Pages via `gh-pages` package

## Project Structure

```
src/Components/    # React components (App, Header, Footer, BlogPost, Blogs, etc.)
blogs/             # Markdown blog post source files
public/blogs/      # Blog posts served to the browser (copy of blogs/)
images/            # Site images
template-css/      # CSS stylesheets
template-js/       # JS scripts (jQuery plugins, etc.)
deploy.sh          # Build and deploy script
```

## Key Commands

- `npm start` — Run dev server (uses `--openssl-legacy-provider` flag)
- `npm run build` — Production build
- `npm run deploy` — Deploy to GitHub Pages
- `./deploy.sh` — Full clean deploy: reinstalls deps, builds, deploys to gh-pages, then force-pushes build output to master

## Blog Posts

- Blog posts are written in Markdown (`.md`) files in `blogs/` and `public/blogs/`
- Both directories must stay in sync — the `public/blogs/` copy is what the browser fetches
- Posts are rendered by `src/Components/BlogPost.js` using the `marked` library
- Blog listing is managed by `src/Components/Blogs.js`
- Blog metadata lives in `blogs/blog-posts.json` and `public/blogs/blog-posts.json` (must stay in sync)

### Blog Post Markdown Format

Every blog post `.md` file follows this structure:

```markdown
# Post Title

**Published:** Month Day, Year

Introductory paragraph summarizing the post.

## First Section

Content...

### Subsection

Content...

## Conclusion

Key takeaways as a summary.

```

- Line 1: `# Title` (H1 heading)
- Line 3: `**Published:** Month Day, Year` (e.g., `**Published:** February 17, 2026`)
- Line 5+: Introductory paragraph
- Sections use `##`, subsections use `###`
- Use markdown tables (`| Col1 | Col2 |`) for comparisons
- Use fenced code blocks with language tags for code
- End with a `## Conclusion` section
- File ends with a trailing blank line
- No emojis in blog post content
- Filenames use kebab-case (e.g., `mixed-precision-training.md`)

### blog-posts.json Entry Format

New entries go at the **top** of the JSON array (newest first). Each entry:

```json
{
  "id": "kebab-case-slug",
  "title": "Full Post Title",
  "date": "YYYY-MM-DD",
  "excerpt": "One-sentence description of the post.",
  "filename": "kebab-case-slug.md",
  "categories": ["AI/ML"]
}
```

## Deployment Notes

- The `master` branch contains **built output** (not just source). The deploy script copies `build/*` to root and force-pushes to master.
- The site is served from master root, not a `gh-pages` branch in the typical sense — `deploy.sh` handles this.
- CNAME file points to `deepanshululla.com`.

## Conventions

- Component files use PascalCase (e.g., `BlogPost.js`)
- Blog filenames use kebab-case (e.g., `exploring-vector-databases.md`)
- No TypeScript — plain JavaScript with PropTypes
