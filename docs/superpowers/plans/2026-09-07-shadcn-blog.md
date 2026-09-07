# shadcn/ui Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete `docs/blog/2026-07-11-shadcn.md` as a verified beginner tutorial for shadcn/ui.

**Architecture:** Keep the article in one existing Markdown file and organize it in the reader's workflow order: understand the tool, choose a setup path, configure the theme, and manage components. Verify changing product details against the current official documentation and source before writing.

**Tech Stack:** Markdown, VuePress 1, shadcn/ui documentation and CLI.

## Global Constraints

- Preserve the existing frontmatter and published route.
- Match the concise Chinese tutorial style used by nearby blog posts.
- Verify commands, configuration keys, and option lists against current official sources.
- List every current Style, Base Color, and Theme option without mixing legacy choices into the current Create configuration.
- Do not modify unrelated working-tree changes.

---

### Task 1: Verify current shadcn/ui behavior

**Files:**
- Read: `docs/blog/2026-07-11-shadcn.md`
- Read: `docs/superpowers/specs/2026-09-07-shadcn-blog-design.md`

**Interfaces:**
- Consumes: Current official shadcn/ui documentation and source.
- Produces: A verified set of product descriptions, Create options, CLI commands, and configuration behavior for Task 2.

- [ ] **Step 1: Verify the product positioning**

Check the official Introduction documentation and confirm that shadcn/ui distributes open component source code rather than acting as a conventional installed component package.

- [ ] **Step 2: Verify Create options**

Inspect the current preset constants and Create interface. Record the complete Style, Base Color, and Theme option sets, preserving official labels and identifiers.

- [ ] **Step 3: Verify tutorial commands**

Confirm the current syntax and behavior for `shadcn create`, `shadcn init`, `shadcn add`, `shadcn diff`, and component removal. Omit any unsupported command.

- [ ] **Step 4: Verify theming**

Confirm the current `components.json` fields, CSS variable model, and dark-mode selector in the Theming documentation.

### Task 2: Write the tutorial

**Files:**
- Modify: `docs/blog/2026-07-11-shadcn.md`

**Interfaces:**
- Consumes: Verified facts from Task 1.
- Produces: The complete shadcn/ui beginner tutorial.

- [ ] **Step 1: Rewrite the introduction and summary**

Lead with a one-sentence definition, then explain the customization and ownership problem shadcn/ui solves. Update the frontmatter summary to match.

- [ ] **Step 2: Explain the primitive-library relationship**

Explain how Radix UI, Base UI, and React Aria can provide behavior and accessibility primitives while shadcn/ui provides styled source code and distribution conventions. Avoid implying that every shadcn/ui component uses all three libraries.

- [ ] **Step 3: Write the installation workflows**

Document Shadcn/Create for new projects and CLI initialization for existing projects. Include complete Markdown tables for Style, Base Color, and Theme, followed by the generated command and main project changes.

- [ ] **Step 4: Write theming and component management**

Explain semantic CSS variables, light/dark theme values, and supported commands for adding, comparing, and removing components.

- [ ] **Step 5: Add references**

Link to the official shadcn/ui Introduction, Create, CLI, Theming, `components.json`, Radix UI, Base UI, and React Aria documentation.

### Task 3: Review and validate

**Files:**
- Verify: `docs/blog/2026-07-11-shadcn.md`

**Interfaces:**
- Consumes: Completed tutorial from Task 2.
- Produces: A publishable Markdown page with no unsupported claims or VuePress build errors.

- [ ] **Step 1: Review content**

Read the full article and remove placeholders, repeated explanations, unsupported defaults, promotional wording, and inconsistent product names.

- [ ] **Step 2: Check the diff**

Run:

```sh
git diff --check -- docs/blog/2026-07-11-shadcn.md
git diff -- docs/blog/2026-07-11-shadcn.md
```

Expected: No whitespace errors; only the intended article changes are present.

- [ ] **Step 3: Build the site**

Run:

```sh
npm run build
```

Expected: VuePress completes with exit code 0.
