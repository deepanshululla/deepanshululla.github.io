# Natural Language to SQL with TinyLlama: Four Approaches Compared

**Published:** March 23, 2026

Can a 1.1 billion parameter language model reliably convert natural language questions into SQL queries? I built a natural language to SQL system for a baseball player database using TinyLlama and tested four fundamentally different approaches, from template matching to agentic reasoning. The results reveal hard-won lessons about prompt engineering, evaluation design, and what small models can and cannot do.

## The Problem

The task was straightforward: build a REST API that accepts natural language questions about baseball players ("How many players were born in the USA?", "Who is the tallest player?") and returns answers from a SQLite database containing 19,000+ player records. The constraint was that the LLM had to be TinyLlama, a 1.1B parameter model running locally via Ollama, with roughly 2K tokens of usable context.

This constraint forced careful thinking about prompt design. Every token in the system prompt is a token the model cannot use for reasoning.

## Approach 1: Template Matching (V1)

The most conservative approach. Instead of asking the LLM to write SQL, I defined 21 SQL query templates covering common questions (count by country, tallest players, players by birth year, etc.) and asked the LLM to do two simpler tasks:

1. **Match** the user's question to the best template
2. **Extract** parameter values from the question

### The Prompts

The matching prompt presents a catalog of templates with IDs, descriptions, and examples, then asks the LLM to return JSON with a template_id and confidence level:

```
You are a query-matching assistant. Given a user question about baseball
players, pick the best matching query template from the list below.

Templates:
- id: "count_by_country", description: "...", params: ["country"],
  example: "..."
- id: "tallest_players", description: "...", params: ["limit"],
  example: "..."
... (21 templates total)

Respond with JSON:
{"template_id": "<id>", "confidence": "high"|"medium"|"low"|"none"}
```

The extraction prompt handles parameter formatting rules: "L" for left-handed, 2-letter state codes, LIKE patterns for years:

```
You are a parameter extraction assistant. Given a user question and
parameter names, extract the parameter values from the question.

Rules:
- For "limit" params, default to 10 if not specified.
- For hand params (bats/throws), use coded values: "L"=left, "R"=right,
  "B"=both/switch.
- For US states, use 2-letter codes (e.g. California -> "CA").
```

### Why It Struggled

The problem was not the template catalog or the extraction logic. The problem was that TinyLlama cannot reliably produce valid JSON. Across initial evaluations, it achieved a **0/5 SQL hit rate**, falling back to generic chat responses for every question. The two-LLM-call design compounded the issue: if either call produces malformed output, the entire pipeline fails.

After warming up the model container (eliminating cold-start latency), V1 improved to **2-4/5** depending on the run, but remained non-deterministic.

## Approach 2: Direct Schema-to-SQL (V2)

Instead of the two-step template matching, V2 sends the full database schema directly to the LLM in a single call and asks it to write SQL.

### The Prompt

The system prompt includes all 24 table columns with type annotations, 3 sample rows for context, and chain-of-thought instructions:

```
You are a SQL assistant. You have access to a SQLite database
with one table:

TABLE: players
  playerId TEXT
  nameFirst TEXT
  nameLast TEXT
  birthYear REAL
  birthCountry TEXT -- full name, e.g. "USA", "Canada", "Japan"
  birthState TEXT -- 2-letter US state code, e.g. "CA", "NY", "TX"
  height REAL -- inches (nullable)
  weight REAL -- pounds (nullable)
  deathYear REAL -- nullable, NULL means still alive
  ... (24 columns total)

Sample rows:
[{"playerId": "aaronha01", "nameFirst": "Hank", ...}, ...]

Think step-by-step before writing SQL:
1. What columns and table are needed?
2. Are any columns nullable? If filtering/aggregating, add IS NOT NULL.
3. Does the query need parameters? Use ? placeholders.
4. Does the query need aggregation? Always alias with AS.
5. Should results be ordered or limited?
```

### The Problem: Context Budget

V2 consumed roughly 600 tokens on the system prompt alone. For a model with a 2K context window, that leaves very little room for the user's question and the model's reasoning. Initial evaluations showed **1/5 SQL hit rate**. The model could handle the simplest query ("Who is the tallest player?") but failed on anything requiring more reasoning.

## Approach 3: Slim Schema-to-SQL (V2b)

V2b was born from a hypothesis: what if the full schema was hurting more than helping?

### Key Changes from V2

| Dimension | V2 (Full) | V2b (Slim) |
|-----------|-----------|------------|
| Columns listed | All 24 | 12 most-queried |
| Sample rows | 3 rows included | None |
| Few-shot examples | 3 | 5 (with chain-of-thought) |
| Prompt size | ~600 tokens | ~250 tokens |

The insight was that **few-shot examples teach small models more effectively than schema descriptions**. A model with 1.1B parameters learns patterns by imitation, not by reasoning about column metadata.

### The Prompt

```
You are a SQL assistant. You have a SQLite table:

TABLE: players
  playerId TEXT
  nameFirst TEXT
  nameLast TEXT
  birthYear REAL
  birthCountry TEXT -- full name, e.g. "USA", "Canada"
  birthState TEXT -- 2-letter US code, e.g. "CA", "NY"
  birthCity TEXT
  height REAL -- inches (nullable)
  weight REAL -- pounds (nullable)
  bats TEXT -- "L"=left, "R"=right, "B"=both
  throws TEXT -- "L"=left, "R"=right
  debut TEXT

Given a question about baseball players, return a JSON object
with a SQL query. No explanation, no markdown fencing, just raw JSON.

Think step-by-step before writing SQL:
1. What columns and table are needed?
2. Are any columns nullable? Add IS NOT NULL.
3. Does the query need parameters? Use ? placeholders.
4. Does the query need aggregation? Always alias with AS.
5. Should results be ordered or limited?

Examples:

Q: How many players were born in USA?
Thinking: COUNT on players, filter by birthCountry. Use ?
  placeholder. Alias count.
A: {"sql": "SELECT COUNT(*) AS count FROM players
  WHERE birthCountry = ?", "params": ["USA"]}

Q: Who is the tallest player?
Thinking: Need names and height. height is nullable, filter
  IS NOT NULL. Order DESC, limit 1.
A: {"sql": "SELECT nameFirst, nameLast, height FROM players
  WHERE height IS NOT NULL ORDER BY height DESC LIMIT 1",
  "params": []}

Q: What is the capital of France?
Thinking: Not about players. Return null.
A: {"sql": null}
```

### Results

**5/5 SQL hit rate.** The only approach to answer all evaluation prompts with valid SQL. Every query completed in under 7 seconds. This was the breakthrough.

## Approach 4: Agentic ReAct (V3)

V3 took a fundamentally different approach. Instead of generating SQL, the LLM operates as an agent that calls predefined tools in a reasoning loop.

### Architecture

The pipeline has three stages:

1. **Classify** the question: single-step tool dispatch or multi-step ReAct loop
2. **Execute** by calling one of five tools: `search_player`, `get_player`, `count_player`, `aggregate_player`, `list_player`
3. **Reason** over observations and decide next steps (up to 3 iterations)

Each tool maps to safe, parameterized SQL with column and value whitelists, eliminating the need for runtime SQL validation.

### The Prompts

The ReAct system prompt uses a line-based tool-calling format:

```
You are a baseball database assistant. Use tools to answer questions.

Tools:
- search_player: find players by name
- get_player: get details for a player ID
- count_player: count players with filters or group_by
- aggregate_player: compute avg/max/min height/weight
- list_player: list players with filters, order_by, limit

To call a tool, write on its own line:
TOOL: tool_name
ARG: key=value
ARG: key=value

When done, write your answer WITHOUT a TOOL line.
```

A separate classification prompt handles hybrid routing, mapping questions directly to tools for single-step queries:

```
Pick the right tool for a baseball player question.
Respond with ONLY JSON.

Q: How many players were born in USA?
{"tool": "count_player", "args": {"filters":
  {"birthCountry": "USA"}}}

Q: Who is the tallest player?
{"tool": "list_player", "args": {"order_by":
  "height DESC", "limit": 1}}

Q: Compare average height USA vs Japan
{"tool": "aggregate_player", "args": {"stat":
  "avg_height", "group_by": "birthCountry"}}

Q: What is the capital of France?
{"tool": null, "args": {}}
```

### Iterative Optimization

V3 went through the most iteration. The initial implementation had serious problems:

**Run 3 (baseline):** 2/5 hit rate, 443 seconds total. The "Find players named Ruth" query triggered 5 consecutive identical `search_player` calls, taking 257 seconds.

Six improvements were applied:

1. **Slim prompt** (~250 tokens, matching V2b's strategy)
2. **Call deduplication** to prevent runaway loops
3. **Observation summarization** to compact tool results to 500 characters or less
4. **Hybrid routing** to bypass the ReAct loop for single-step queries
5. **Line-based TOOL/ARG format** instead of `ACTION: tool(args)`
6. **MAX_STEPS=3** (down from 5) to cap loop time

**Run 4 (after optimization):** 1/5 hit rate but 95 seconds total, a **4.7x speedup**. The "Ruth" query dropped from 257 to 21 seconds (12x faster). Hit rate dropped because the classifier was too strict.

**Run 5 (after fuzzy matching + prompt tuning):** 4/5 hit rate, 103 seconds. The root cause of the classifier failures was TinyLlama returning `list_player` (singular) instead of `list_players`. Adding a suffix-matching heuristic fixed it immediately.

## How Evaluations Were Structured

### Test Organization

Each approach had its own eval suite running against a live TinyLlama instance in Docker (no mocks):

| Suite | Tests | What It Measures |
|-------|-------|-----------------|
| V1 Template Matching | 18 | Template selection, parameter extraction, SQL correctness, fallback behavior |
| V2 Full Schema | 21 | SQL generation, parameter extraction, SQL correctness, SQL safety, fallback |
| V2b Slim Schema | 18 | SQL generation, parameter extraction, SQL correctness, fallback |
| V3 Agentic | 22 | Tool selection, data correctness, multi-step reasoning, edge cases, response format |
| Head-to-Head | 6 | Same 5 prompts across all 4 approaches + aggregate comparison |

### Eval Categories

**SQL/Tool hit rate:** The primary metric. Did the LLM produce a structured output (SQL query or tool call) that executed successfully? This is a binary per-query metric aggregated across a standard set of 5 prompts.

**Data correctness:** When the LLM does produce SQL or call a tool, are the results factually correct? For example, does "How many players born in USA?" return a count greater than 1,000?

**Parameter extraction:** Does the LLM correctly extract values from natural language? "California" should become "CA", "left-handed" should become "L".

**Fallback behavior:** When the LLM fails to produce structured output, does the system degrade gracefully (return a chat response) rather than crash?

**SQL safety:** Can the LLM be tricked into generating dangerous SQL? Tests include `DROP TABLE`, `DELETE FROM`, `UNION SELECT` injection, and multi-statement attacks. All approaches use defense-in-depth: prompt instructions, AST-based validation via sqlglot, automatic LIMIT enforcement, and parameterized execution.

**Edge cases:** Off-topic questions ("What is the capital of France?"), nonsense input, empty prompts, missing fields.

### The Head-to-Head Test

The most revealing evaluation sent identical prompts to all four approaches:

1. "How many players were born in USA?"
2. "Who are the 5 tallest players?"
3. "What is the average height?"
4. "Find players named Ruth"
5. "Compare average height USA vs Japan" (multi-step)

## Final Results

### Head-to-Head Comparison (Run 5, After All Optimizations)

| Prompt | V1 (Template) | V2 (Full Schema) | V2b (Slim) | V3 (Agentic) |
|--------|---------------|-------------------|------------|--------------|
| Tallest player | chat (90.0s) | chat (33.5s) | **SQL (15.7s)** | **list_players (17.9s)** |
| Count USA players | **SQL (31.2s)** | **SQL (25.8s)** | **SQL (11.2s)** | **count_players (15.8s)** |
| Average height | **SQL (20.5s)** | **SQL (28.5s)** | **SQL (12.4s)** | **aggregate_players (11.1s)** |
| Players named Ruth | **SQL (28.0s)** | chat (29.5s) | **SQL (10.6s)** | **search_player (17.5s)** |
| USA vs Japan | **SQL (27.8s)** | chat (43.5s) | **SQL (12.0s)** | agentic (41.1s) |
| **Hit rate** | **4/5** | **2/5** | **5/5** | **4/5** |
| **Total time** | 198s | 161s | **62s** | 103s |

### Summary Across All Runs

| Metric | V1 (Template) | V2 (Full Schema) | V2b (Slim) | V3 (Agentic) |
|--------|---------------|-------------------|------------|--------------|
| Best hit rate | 4/5 | 4/5 | **5/5** | 4/5 |
| Avg response time | 22.0s | 19.1s | **6.0s** | 19.0s |
| Prompt size | ~800 tok | ~600 tok | **~250 tok** | ~250 tok |
| LLM calls/request | 2 | 1 | **1** | 2 (classify+dispatch) or 1-4 (ReAct) |
| Multi-step support | No | No | No | **Yes** |
| Safety model | Template whitelist | AST validation | AST validation | Column/stat whitelists |

### Expected Results with Larger Models

| Model | V1 | V2 | V2b | V3 |
|-------|----|----|-----|-----|
| TinyLlama (1.1B) | 0-4/5 | 1-4/5 | **5/5** | 0-4/5 |
| Llama 3 (expected) | 3-5/5 | 4-5/5 | 5/5 | 3-5/5 |
| GPT-4 (expected) | 5/5 | 5/5 | 5/5 | 5/5 |

## Learnings

### 1. Few-Shot Examples Beat Schema Descriptions for Small Models

The single biggest improvement came from replacing detailed column descriptions with few-shot examples. V2 gave the model all 24 columns with annotations and 3 sample rows (~600 tokens). V2b trimmed to 12 columns, dropped sample rows entirely, and added 5 worked examples with chain-of-thought (~250 tokens). Hit rate went from 1/5 to 5/5.

Small models learn by pattern matching, not by reasoning about metadata. Show them what you want, do not describe it.

### 2. Context Window Budget Is Everything with Small Models

TinyLlama has roughly 2K usable tokens. Every token spent on the system prompt is a token the model cannot use for reasoning about the user's question. V2's 600-token prompt left almost no room. V2b's 250-token prompt left enough for the model to think, and the results were dramatic: 3x faster inference and 5x better hit rate.

When working with constrained models, treat prompt tokens as a scarce resource and optimize aggressively.

### 3. The Same Root Cause Can Look Like Different Failures

TinyLlama's inability to follow format instructions manifested differently across approaches: V1 failed to produce JSON for template selection, V2 occasionally produced JSON with SQL, V3 failed to emit `TOOL:` lines. The hypothesis that text-based formats would be easier than JSON for a small model was not confirmed. The fundamental limitation is format adherence capacity, not format complexity.

### 4. Fuzzy Matching Fixes Real Problems

V3's hit rate jumped from 1/5 to 4/5 with a single change: accepting `list_player` when the tool name is `list_players`. The classifier was working correctly the entire time; the integration layer was too strict. When working with small models, build tolerance for minor deviations (singular vs. plural, case differences, missing delimiters) into the parsing layer.

### 5. Call Deduplication Is Essential for Agent Loops

Without deduplication, the "Find players named Ruth" query triggered 5 identical `search_player` calls in a row, consuming 257 seconds. With a simple call key (tool name + sorted arguments), repeated calls are detected and the loop breaks with a forced final answer. This single optimization gave a 12x speedup on that query and a 4.7x speedup overall.

Agent loops with small models will produce runaway repetitions. Plan for it.

### 6. Hybrid Routing Combines the Best of Both Worlds

V3's strongest configuration used a classifier to route simple questions directly to a tool (bypassing the ReAct loop entirely) and reserved multi-step reasoning for genuinely complex queries like "Compare average height USA vs Japan." This gives the speed of direct dispatch for 80% of questions while retaining multi-step capability for the rest.

### 7. Warm-Up Eliminates Cold-Start Variance

Adding a warmup container to Docker Compose (a simple `ollama run tinyllama "hi"` after model pull) eliminated cold-start timeouts and improved V1's hit rate from 0/5 to 2/5. The model's first inference after loading into memory is significantly slower and less reliable. For any local LLM deployment, ensure the model is warm before serving traffic.

### 8. Non-Determinism Requires Multiple Eval Runs

TinyLlama produced different results on identical prompts across runs. V1 hit 0/5 in one run and 4/5 in another. Single eval runs are misleading for small models. The head-to-head comparison was run 5 times with progressive improvements, and conclusions were drawn from patterns across runs, not individual results.

### 9. Eval Design Should Measure What Matters

The V3 eval suite had the highest pass rate (20/22) despite having the worst tool hit rate (0/5) in initial runs. This was because V3's tests were designed to measure tool results when tools fire and track hit rates as observability metrics, while V1/V2 tests asserted directly on structured output. The lesson: separate "does the system work?" (yes, it degrades gracefully) from "does the LLM cooperate?" (no, not reliably). Both questions matter, but they should be different tests.

### 10. Defense in Depth for SQL Safety

No single layer of SQL safety is sufficient when LLM output is unpredictable. The system uses four layers: prompt instructions ("only SELECT queries"), AST-based validation via sqlglot (blocks UNION, subqueries, non-SELECT statements, multi-statement injection), automatic LIMIT enforcement (appends LIMIT 100 if missing), and parameterized execution (? placeholders prevent injection even if validation is bypassed). Each layer catches attacks the others might miss.

