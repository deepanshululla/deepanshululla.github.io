# Blog Post Learnings

A running log of lessons learned writing posts for deepanshululla.com. **Read this before writing
a new post**, and **append to it** whenever a post surfaces a new gotcha or a stated preference.
Each entry: what happened, why, and the rule to apply next time.

---

## Special characters: the renderer is `marked` 4.x — mind what it treats as markup

**What happened.** A batch of posts rendered with random text struck through. Cause: the tilde `~`
used as an "approximately" marker. `marked` (the library `BlogPost.js` uses) treats a single
`~text~` as strikethrough (GitHub itself requires `~~`, but marked is looser), so any line
containing two `~` struck the text between them — e.g. `~170 us | ~13.8 KB` rendered as struck.

**Rule.** Do **not** use a bare `~` for "approximately." Use `≈` (U+2248), or the words
"about"/"roughly." Reserve `~~` for intentional strikethrough only. More generally, before using
any of these in prose, remember they are markdown/`marked` syntax: `~` `*` `_` `` ` `` `|` (inside
tables) `#` `>`. When you mean them literally, escape (`\*`) or pick a non-syntax glyph.

**Second trap (don't repeat).** Fixing the above with a shell one-liner corrupted the files into
mojibake (`â‰ˆ`). Cause: `perl -CSD -pe 's/~/≈/g'` — the `≈` literal in the *program text* was not
UTF-8-decoded, so each byte got re-encoded. **For any find/replace involving non-ASCII characters,
use Python 3** (UTF-8 native), not perl/sed one-liners:

```python
import glob
for f in glob.glob('public/blogs/hpp-*.md'):
    data = open(f, encoding='utf-8').read().replace('~', '≈')
    open(f, 'w', encoding='utf-8').write(data)
```

After any bulk edit, verify: `grep -l "â" public/blogs/*.md` should print nothing, and re-sync the
edited files to `blogs/`.

---

## Humility: write from "my machine," not "the book is wrong"

**Stated preference (June 2026): keep the tone humble across all posts.** Concretely:

- Frame measurements as *mine on this machine*, not universal fact. "≈15x on my Apple M1 Max,"
  not "is 15x slower." Add "yours will differ" where a number is hardware-dependent.
- When a result disagrees with a source (book, paper, docs), **do not say the source is wrong.**
  Say the number drifted, credit the source's mechanism/reasoning, and attribute the difference to
  the stack moving (hardware, library version, defaults). Prefer titles like "Results That Came
  Out Differently for Me" over "Where the Book Is Wrong."
- Use hedged, first-person framing for claims: "I found," "this seems," "can be a trap" (not
  "is a trap"), "the order I tend to reach for."
- Be willing to be self-critical: if your own first explanation didn't survive testing, say so
  (see the CoW example below). That candor reads as more trustworthy, not less.
- Soften imperatives. "It's usually worth profiling the vehicle" reads better than "Profile the
  vehicle." Avoid sweeping pronouncements ("the one everyone forgets" → "the one I find easiest to
  forget").
- Humility is not hedging everything into mush — keep the measured numbers and the clear takeaway.
  Be confident about *what you measured*, humble about *how far it generalizes*.

---

## Measured-honesty: report refutations, don't smooth them over

**What happened.** A post attributed a narrowed pandas result to Copy-on-Write. An isolation
benchmark (forcing the pre-CoW copies back) showed CoW was *not* the cause. Rather than quietly
drop it, the post was rewritten to report the refutation — the narrowing is real, the CoW
attribution was wrong, here's the chart proving it.

**Rule.** If a benchmark contradicts the framing (yours or a source's), that surprise is the most
interesting part — report it with the evidence. A correct general mechanism is not automatically
the cause of a specific measured change; only isolating it tells the two apart. Don't ship a
plausible-but-unverified causal story.

---

## Mechanics that bit us (quick checklist)

- **Both dirs must stay byte-identical.** After editing a post, copy `public/blogs/<f>.md` →
  `blogs/<f>.md` (or vice-versa) and `diff -q` them. Same for `blog-posts.json`.
- **Images live only in `public/blogs/images/`** (not duplicated in `blogs/`). Reference with
  absolute paths `/blogs/images/...`. SVGs render fine as `<img>` via `![]()`.
- **Date format** in the post body is `Month Day, Year` (per CLAUDE.md), even though older JSON
  entries use ISO `YYYY-MM-DD`. The JSON `date` field stays `YYYY-MM-DD`.
- **Dev server / port.** `npm start` is CRA; if port 3000 is taken (e.g. by another local site),
  start with `PORT=3001 BROWSER=none npm start`. Markdown/JSON in `public/` is served statically,
  so edits show on refresh with no rebuild.
- **Nothing is live until `./deploy.sh`** — and that is a destructive force-push. Only run it on
  explicit user approval.
