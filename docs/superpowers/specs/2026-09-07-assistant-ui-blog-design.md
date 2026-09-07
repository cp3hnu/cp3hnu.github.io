# Assistant UI 博客设计

## 目标

将 `docs/blog/2026-09-02-assistant-ui.md` 扩写为一篇 Assistant UI 全景介绍，使读者理解它的定位、分层架构和核心 API，并能用 Next.js、Vercel AI SDK v7 与 OpenAI 手动接入一个可流式对话的界面。

## 文章关系

- 沿用 `docs/blog/2026-08-22-copilotkit.md` 的 frontmatter、中文叙述方式、章节层级、表格、流程图和代码示例风格。
- 开头提及上一篇《CopilotKit - The frontend stack for Agent》，从“Agent 如何接入产品”自然过渡到“如何构建精细、可组合的聊天界面”。
- 本文独立介绍 Assistant UI，不设置 CopilotKit 或其他产品的对比章节。

## 文章结构

1. 定位与核心能力：说明 Assistant UI 是由聊天原语、Runtime 和后端适配层组成的 AI 聊天界面工具集。
2. 架构：解释 UI Primitives、aui client/hooks、Runtime、Adapters/Backend 四层关系，并用 Mermaid 展示。
3. 请求过程：展示用户发送消息、Runtime 转换状态、后端流式生成、消息部件更新的完整链路。
4. 手动集成：以 Next.js + Vercel AI SDK v7 + OpenAI 为唯一主线，给出依赖、环境变量、API Route、Runtime Provider、Thread 和启动步骤。
5. Assistant UI CLI：介绍创建项目和向现有项目添加组件的常用命令。
6. Primitives 与 Hooks：先总览核心原语与状态 Hook，再讲 `ThreadPrimitive`、`MessagePrimitive`、`ComposerPrimitive`、`useAui` 和 `useAuiState` 的职责。
7. Runtime：解释 Runtime 的作用、选择方法，以及 AI SDK、LangGraph、AG-UI、External Store 和 Local Runtime 的适用场景。
8. Tools 与 Generative UI：说明工具定义、执行状态和自定义 Tool UI 的连接方式，提供一个精简且可核验的示例。
9. 会话与持久化：介绍 ThreadList、Assistant Cloud 和自定义 persistence adapter 的边界。
10. References：链接官方架构、安装、AI SDK v7、Primitives、Runtime、Tools、Cloud 和 GitHub 文档。

## 内容边界

- 暂不写“我的应用”章节，也不添加应用截图或演示链接。
- 不写产品对比、选型结论或优缺点对照。
- 不展开 React Native、Ink、Vue、语音、MCP、A2A 等支线，只在能力或 Runtime 总览中简要提及必要事实。
- 代码和包名以 Assistant UI 当前 0.15.x 文档与 AI SDK v7 集成为准。
- 删除目标文件中的临时 `--debug-source-root` 命令和 GitHub issue 裸链接，除非它们对正式文章内容有直接价值。

## 验证

- 依据 `https://www.assistant-ui.com/llms.txt` 和对应官方文档逐项核对包名、Hook、命令和示例。
- 完整重读文章，检查章节衔接、重复内容、Markdown 和 Mermaid 语法。
- 运行仓库现有的文档构建或检查命令；如果仓库没有专用检查命令，则运行可用的构建命令。
- 只修改 Assistant UI 博客及其设计/计划文档，不改动现有的 `docs/blog/2026-07-11-shadcn.md` 工作区修改。
