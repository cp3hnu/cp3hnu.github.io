---
pageClass: blog-page
title: Playwright 端到端测试
tags:
  - web
  - test
  - playwright
date: 2026-06-09
author: cp3hnu
location: ChangSha
summary: Playwright 是一个面向现代 Web 应用的端到端测试框架。它集成了测试运行器、断言、隔离、并行化和丰富的工具。
---

# Playwright 端到端测试

Playwright 是一个面向现代 Web 应用的端到端测试框架。它集成了测试运行器、断言、隔离、并行化和丰富的工具。Playwright 支持 Windows、Linux 和 macOS 上的 Chromium、WebKit 和 Firefox 内核浏览器，支持本地测试和持续集成 (CI) 测试。

## 安装

```sh
$ cd project-dir
$ npm init playwright@latest
```

它会询问四个问题：

- Do you want to use TypeScript or JavaScript?
  TypeScript 还是 JavaScript，默认值：`TypeScript`

- Where to put your end-to-end tests?
  测试文件夹名称，默认值： `tests` ，如果 `tests` 已存在，则默认值为 `e2e`

- Add a GitHub Actions workflow? 

  是否添加 GitHub Actions 工作流？默认值： `是` 

- Install Playwright browsers (can be done manually via 'npx playwright install')? 
  是否安装 Playwright 浏览器，默认值： `是` 

如果同意安装 Playwright browsers，则 Playwright 开始下载并安装浏览器（Firefox、WebKit、Chromium），文件存放在 `~/Library/Caches/ms-playwright` 目录下

然后在目录根目录下创建：

```
playwright.config.ts
tests/
  example.spec.ts
```

- `playwright.config.ts`  是 Playwright 的配置文件，配置目标浏览器、超时、重试次数、项目、报告器等。
- `tests/example.spec.ts` 是一个最小的测试样例。

如果同意添加 GitHub Actions 工作流，还会在根目录下创建 `.github` 文件夹，里面是 GitHub Actions 工作流相关的配置。

## 更新

更新 Playwright 并下载新的浏览器及其依赖项

```sh
$ npm install -D @playwright/test@latest
$ npx playwright install --with-deps
```

## CLI 命令

```sh
# Runs the end-to-end tests.
$ npx playwright test

# Starts the interactive UI mode.
$ npx playwright test --ui

# Runs the tests only on Desktop Chrome.
$ npx playwright test --project=chromium

# Runs the tests in a specific file.
$ npx playwright test example

# Runs the tests in debug mode.
$ npx playwright test --debug
 
# Auto generate tests with Codegen.
$ npx playwright codegen

# Open HTML Test Reports
$ npx playwright show-report

# We suggest that you begin by typing:
$ npx playwright test
```

## 测试

Playwright 测试与 [Jest](https://jestjs.io/)、[Vitest](https://vitest.dev/)、[Testing Library](https://testing-library.com/) 一样，执行动作，判断结果与预期是否相符。

但是 Playwright 的优点是会自动等待[可操作性](https://playwright.dev/docs/actionability)检查通过后再执行每个操作。我们无需手动添加等待或处理竞态条件。

Playwright 断言旨在描述最终会实现的预期，从而消除不稳定的超时和竞态条件检查。

下面是 Playwright 生成的测试样例代码

```ts
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
```

从这份测试样例代码我们可以看到，主要由两部分组成：[Actions](https://playwright.dev/docs/input) 和 [Assertions](https://playwright.dev/docs/test-assertions)。[Actions](https://playwright.dev/docs/input) 模拟用户点击动作，而 [Assertions](https://playwright.dev/docs/test-assertions) 表达用户期望的结果。

写好测试文件之后，运行 `npx playwright test` 进行测试

```sh
$ npx playwright test
```

还可以启动 UI 界面，进行交互式测试

```sh
$ npx playwright test --ui
```

### Codegen

写 Playwright 测试文件是比较麻烦的，难点在于怎么找到交互的元素。因此 Playwright 提供了 Codegen 功能，录制测试。

什么叫录制测试，就是打开浏览器，记录你的交互操作，自动为您生成测试代码。

```sh
$ npx playwright codegen your.domain.com
```





### Test Agents

如果觉得 Codegen 还不够智能，可以使用 Playwright 新推出的智能体 Test Agents：**planner**、**generator**、**healer**。

- **planner**：探索应用程序，生成了一个 Markdown 测试计划
- **generator**：将 Markdown 计划转换为 Playwright 测试文件
- **healer**：执行测试套件并自动修复失败的测试

#### 安装

Playwright Test Agents 目前提供 3 个 AI Agents 快速安装

```sh
# vscode
$ npx playwright init-agents --loop=vscode

# claude code
$ npx playwright init-agents --loop=claude

# opencode
$ npx playwright init-agents --loop=opencode
```

通过分析它的安装过程，其实也很容易移植到别的 AI Agent，比如下面的命令

```sh
$ npx playwright init-agents --loop=vscode
```

其实是在当前目录下，添加了这些文件

```
Writing file: .github/chatmodes/🎭 generator.chatmode.md
Writing file: .github/chatmodes/🎭 healer.chatmode.md
Writing file: .github/chatmodes/ 🎭 planner.chatmode.md
Writing file: .vscode/mcp.json
Writing file: tests/seed.spec.ts
```

它一共做了下面三件事情：

1. 安装了三个 SubAgent，分别对应 **planner**、**generator**、**healer**
2. 添加 `playwright-test` MCP 服务

```json
{
  "servers": {
    "playwright-test": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "playwright",
        "run-test-mcp-server"
      ]
    }
  },
  "inputs": []
}
```

3. 创建了一个 `tests/seed.spec.ts` 文件，这个文件用于 **planner**，生成测试计划

```ts
import { test, expect } from '@playwright/test';

test.describe('Test group', () => {
  test('seed', async ({ page }) => {
    // generate code here.
  });
});
```

所以很容易移植到别的 AI Agent，比如 Cursor

1. 将 3 个 SubAgents 移动到 `.cursor/agents` 目录下
2. 添加  `playwright-test` MCP 服务到  `.cursor/mcp.json`

然后就可以在 Cursor 里使用 Playwright Test Agents 了

#### 使用

使用 Playwright Test Agents  非常简单

1. 首先使用 **planner** 生成测试计划





2. 



## References

- [Playwright](https://playwright.dev/)
-  [Jest](https://jestjs.io/)
- [Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/) 

