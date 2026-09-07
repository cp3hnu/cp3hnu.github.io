# Assistant UI Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete `docs/blog/2026-09-02-assistant-ui.md` as a verified Chinese overview and integration guide for Assistant UI.

**Architecture:** Keep the article in the existing Markdown file and follow the structure of the CopilotKit article: positioning, architecture, request flow, manual integration, CLI, core APIs, runtime, tools, persistence, and references. Use Next.js, Vercel AI SDK v7, and OpenAI as the single end-to-end integration path.

**Tech Stack:** Markdown, Mermaid, VuePress 1, Assistant UI 0.15.x, Next.js, Vercel AI SDK v7, OpenAI.

## Global Constraints

- Preserve the existing route, date, author, tags, and `blog-page` frontmatter.
- Open by mentioning the previous article, 《CopilotKit - The frontend stack for Agent》.
- Match the Chinese narrative, heading hierarchy, tables, Mermaid diagrams, and code style of `docs/blog/2026-08-22-copilotkit.md`.
- Do not add “我的应用” or product comparison sections.
- Use Next.js + Vercel AI SDK v7 + OpenAI for the manual integration.
- Verify package names, commands, hooks, runtime APIs, and examples against the current Assistant UI documentation.
- Do not modify or unstage `docs/blog/2026-07-11-shadcn.md` or `docs/blog/assets/shadcn-ui.png`.

---

### Task 1: Verify the current Assistant UI surface

**Files:**
- Read: `docs/blog/2026-08-22-copilotkit.md`
- Read: `docs/blog/2026-09-02-assistant-ui.md`
- Read: `docs/superpowers/specs/2026-09-07-assistant-ui-blog-design.md`

**Interfaces:**
- Consumes: `https://www.assistant-ui.com/llms.txt` and the linked official documentation pages.
- Produces: A verified set of facts, package names, commands, APIs, and examples for Task 2.

- [ ] **Step 1: Verify positioning and architecture**

Confirm the responsibilities and current names of UI primitives, the aui client and hooks, Runtime, adapters, and backends from the official Architecture and Runtime Architecture pages.

- [ ] **Step 2: Verify the AI SDK v7 integration**

Confirm the current dependency names and version floors, API route implementation, `AssistantChatTransport`, `useChatRuntime`, `AssistantRuntimeProvider`, and generated `Thread` component from the AI SDK v7 documentation.

- [ ] **Step 3: Verify CLI commands**

Confirm the current syntax for creating a project and adding or updating registry components from the CLI documentation. Exclude the target file’s local-only `--debug-source-root` command.

- [ ] **Step 4: Verify primitives, hooks, tools, and persistence**

Confirm the public names and responsibilities of `ThreadPrimitive`, `MessagePrimitive`, `ComposerPrimitive`, `ThreadListPrimitive`, `useAui`, `useAuiState`, toolkits, Tool UI, Assistant Cloud, and custom persistence adapters.

### Task 2: Write the Assistant UI article

**Files:**
- Modify: `docs/blog/2026-09-02-assistant-ui.md`

**Interfaces:**
- Consumes: Verified facts from Task 1.
- Produces: A complete Assistant UI overview and integration guide with no application showcase or comparison section.

- [ ] **Step 1: Rewrite the frontmatter and introduction**

Update the title casing and summary. Begin with a link to the CopilotKit article, explain the shift from Agent application integration to composable chat UI, then summarize Assistant UI’s core capabilities in a compact table.

- [ ] **Step 2: Explain architecture and request flow**

Add one Mermaid flowchart for the four-layer architecture and one Mermaid sequence diagram for the AI SDK v7 message flow. Explain each layer and summarize the request path in plain Chinese.

- [ ] **Step 3: Write the manual AI SDK v7 integration**

Document prerequisites, dependency installation, `.env.local`, `app/api/chat/route.ts`, the client runtime provider, the generated `Thread` component, and startup. Keep imports and package names consistent with the current official example.

- [ ] **Step 4: Document the CLI**

Explain when to use `npx assistant-ui@latest create` and how registry component commands fit into an existing project. Include only commands confirmed in Task 1.

- [ ] **Step 5: Document primitives and hooks**

Add overview tables for core primitives and hooks, then explain `ThreadPrimitive`, `MessagePrimitive`, `ComposerPrimitive`, `useAui`, and `useAuiState` with short, current examples where they improve understanding.

- [ ] **Step 6: Document Runtime choices**

Explain the Runtime boundary and summarize AI SDK, LangGraph, AG-UI, External Store, and Local Runtime in a selection table. Keep AI SDK v7 as the main path and treat the others as brief alternatives.

- [ ] **Step 7: Document tools, Generative UI, and persistence**

Explain tool definition, execution, status rendering, and custom Tool UI with one compact verified example. Close the technical body with ThreadList, Assistant Cloud, and custom persistence adapter boundaries.

- [ ] **Step 8: Add references**

Link to the official Assistant UI architecture, installation, CLI, AI SDK v7, primitives, runtime selection, tools, Tool UI, cloud persistence, custom persistence, and GitHub pages.

### Task 3: Review and validate

**Files:**
- Verify: `docs/blog/2026-09-02-assistant-ui.md`

**Interfaces:**
- Consumes: The completed article from Task 2.
- Produces: A publishable VuePress Markdown page with verified technical claims and no unrelated changes.

- [ ] **Step 1: Review the full article**

Read the page from frontmatter through references. Remove placeholders, repeated explanations, unsupported claims, promotional wording, raw temporary links, and any accidental comparison or “我的应用” content.

- [ ] **Step 2: Check required and forbidden content**

Run:

```sh
rg -n "CopilotKit - The frontend stack for Agent|## 架构|## 手动集成|## Assistant UI CLI|## Primitives|## Runtime|## Tools|## References" docs/blog/2026-09-02-assistant-ui.md
rg -n "## 我的应用|VS|--debug-source-root|github.com/assistant-ui/assistant-ui/issues/4434" docs/blog/2026-09-02-assistant-ui.md
```

Expected: The first command finds every required topic; the second command returns no matches.

- [ ] **Step 3: Check the diff**

Run:

```sh
git diff --check -- docs/blog/2026-09-02-assistant-ui.md
git diff -- docs/blog/2026-09-02-assistant-ui.md
```

Expected: No whitespace errors; only the intended Assistant UI article changes are present.

- [ ] **Step 4: Build the site**

Run:

```sh
npm run build
```

Expected: VuePress completes with exit code 0.
