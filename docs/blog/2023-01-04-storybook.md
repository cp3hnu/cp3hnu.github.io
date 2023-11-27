---
pageClass: blog-page
title: Storybook
tags:
  - web
  - test
  - storybook
date: 2023-01-04
author: cp3hnu
location: ChangSha
summary: Storybook 帮助你调试组件、编写组件文档以及测试组件
---

# Storybook

现在前端开发越来越复杂，组件越来越多，成熟的项目可能包含上百个组件，而每个组件又有很多不同的变化，调试这些组件将是非常繁重的任务。

![](./assets/storybook-problem.png)

Storybook 定义每个组件的不同状态为 story。Storybook render 这些 story，并提供很多的 [addons](https://storybook.js.org/docs/react/essentials/introduction) 帮助你调试组件、撰写组件文档以及测试组件。

## 安装

在已有的工程里使用下面的命令安装 Storybook

```sh
$ npx storybook@latest init
```

Storybook 会根据你的工程依赖（比如你用的是 React 还是 Vue），提供最优的配置。

这个命令主要做四件事：

- 安装依赖包，比如 `@storybook/addon-essentials`
- 添加 script 命令，比如 `"storybook": "storybook dev 6006"`
- 创建配置文件，在 `.storybook` 目录下，有两个文件 `main.js` 和 `preview.js`
- 创建示例，在 `src/stories` 目录下

##### 升级

```sh
$ npx storybook@latest upgrade
```

运行上面的命令升级 Storybook 相关的包至最新版本，同时检查是否有机会运行自动更新配置

##### 自动更新配置

```sh
$ npx storybook@next automigrate
```

## Stories

> 本文档是在 Storybook 6.5 版本下编写，然后更新到 Storybook 7.4 

Story 是一个函数，根据不同的 props 返回组件不同的 render 状态。一个组件可以定义多个 story，表示组件的多种 render 状态。 Storybook 通过 [Component Story Format](https://storybook.js.org/docs/react/api/csf) (CSF， Storybook 7.4 使用 CSF 3.0) 定义 story。

在 story 文件里，默认导出组件描述，命名导出 story 描述（推荐使用 UpperCamelCase）。

### Args

定义 story 最简单的方式是使用 [Args](https://storybook.js.org/docs/react/writing-stories/args)。可以定义全局的、组件的、story 的 args.

```js
// src/stories/Button.stories.jsx
import React from "react";
import { Button } from "./Button";

// 默认导出组件描述 
export default {
  component: Button
};

// 命名导出 story 描述
// More on args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary = {
  args: {
    primary: true,
    label: 'Button',
  }
};

export const Secondary = {
  args: {
    label: 'Button',
  },
}

export const Large = {
  args: {
    size: 'large',
    label: 'Button',
  },
}

export const Small = {
  args: {
    size: 'small',
    label: 'Button',
  },
}
```

[Controls addon](https://storybook.js.org/docs/react/essentials/controls) 通过 Args 可以让你很方便地修改组件的参数，从而方便地调试组件不同的状态

![](./assets/storybook-story.png)

### ArgTypes

Storybook 自动从组件的代码中推断出组件参数的信息，包括参数类型、描述、默认值。

Storebook 的 addons 可以使用这些信息，比如 [Controls](https://storybook.js.org/docs/react/essentials/controls) 根据不同的参数类型，提供不同的控制组件。

同时，组件的参数信息也可以通过 [ArgTypes](https://storybook.js.org/docs/react/api/argtypes) 重写，例如

```js
// Button.stories.js|jsx|ts|tsx
export default {
  title: 'Button',
  component: Button,
  argTypes: {
    label: {
      name: 'label',
      type: {
        name: 'string',
        required: true
      },
      description: 'overwritten description',
      defaultValue: 'Button',
      table: {
        type: { 
          summary: 'something short', 
          detail: 'something really really long' 
        },
        defaultValue: {
          summary: 'something short default value', 
          detail: 'something really really long default value' 
        }
      },
      control: {
        type: 'string'
      }
    }
  }
};
```

其中 `table` 应用于 ArgsTable，详情请参考 [ArgsTable Customizing](https://storybook.js.org/docs/react/writing-docs/doc-block-argstable#customizing)。

`control` 应用于 Controls，详情请参考 [Controls Annotation](https://storybook.js.org/docs/react/essentials/controls#annotation)。

### Parameters

[Parameters](https://storybook.js.org/docs/react/writing-stories/parameters) 是一组关于 story 的静态元数据，通常用于控制组件或者 story 的特性和 addon 的行为。

和 Args 一样可以定义全局的、组件的、 story 的 parameters.

例如下面配置 story 的背景色，更多配置项请参考下面的 [Configuration](#preview.js)

```js
// Button.stories.js|ts|jsx|tsx

import { Button } from './Button';

export default {
  component: Button,
};

export const Primary = {
  parameters: {
    backgrounds: {
      values: [
        { name: 'red', value: '#f00' },
        { name: 'green', value: '#0f0' },
        { name: 'blue', value: '#00f' },
      ],
    },
  },
};
```

### Decorators

[Decorator](https://storybook.js.org/docs/react/writing-stories/decorators) 包装 story 进行额外的渲染，比如提供全局的 [Context](https://zh-hans.reactjs.org/docs/context.html).

和 Args、Parameters 一样可以定义全局的、组件的、 story 的 decorators. 优先级从高到低依次是 story、组件、全局 decorator，而且 decorators 数组中后面定义的 decorator 比前面定义的 decorator 优先级高。

```js
// .storybook/previews.js
import { ThemeContext, themes } from './theme-context';
export const decorators = [
  Story => (
    <ThemeContext.Provider value={themes.dark}>
      <Story />
    </ThemeContext.Provider>
  )
];
```

Decorators 的第二个参数是 [story context](https://storybook.js.org/docs/react/writing-stories/decorators#context-for-mocking).

### Loaders

[Loaders](https://storybook.js.org/docs/react/writing-stories/loaders) 是为 story 和 decorator 加载数据的异步函数。Story 的 loaders 在 story 渲染之前运行，加载的数据通过 story 的 render context 注入到 story 中。

和 Args、Parameters、Decorators 一样可以定义全局的、组件的、 story 的 loaders.

下面通过 remote API 加载 `currentUser`， 然后通过组件或者 story 的第二个参数 story context (`context.loaded.currentUser`) 注入到 story 中。

```js
// .storybook/preview.js
import fetch from 'node-fetch';
export const loaders = [
  async () => ({
    currentUser: await (await fetch('https://jsonplaceholder.typicode.com/users/1')).json(),
  }),
];

// Component.stories.js
export const Primary = (args, { loaded: { currentUser } }) => <Component {...args} user={currentUser} />;
```

### Naming components and hierarchy

下面是 storybook 的层级结构

<img src="./assets/storybook_naming_hierarchy.png" alt="Storybook sidebar hierarchy" />

可以通过设置 `title` 设置层级结构

```js
// Button.stories.js|jsx

import { Button } from './Button';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Design System/Atoms/Button',
  component: Button,
};
```

## Documents

Storybook 支持两种撰写文档的方法：[Autodocs](https://storybook.js.org/docs/react/writing-docs/autodocs) 和 [MDX](https://storybook.js.org/docs/react/writing-docs/mdx)。

### Autodocs

Autodocs 是开箱即用的零配置默认文档。它将 story、文本描述、组件中的 docgen 注释、参数表和代码示例聚合在一起，生成关于组件的文档

![](./assets/storybook-autodocs.png)

#### Overriding description

```js
// 修改组件描述
export default {
  title: 'Example/Button',
  component: Button,
  parameters: {
    docs:
      description: {
        component: 'This is a button',
      },
    },
  },
};

// 修改 stroy 描述
Primary.parameters = {
  docs: {
    description: {
      story: 'This is a primary button',
    }
  }
};
```

Doc 注释也能修改 story 的描述

```js
/**
 * This is a large button
 */
export const Large = {
  args: {
    size: 'large',
    label: 'Button',
  },
}
```

### MDX

Storybook 默认使用 Autodocs 文档，但是当你想要自定义文档格式或者创建更加详细的文档时，可以使用 MDX。

MDX 是一个 [标准文件格式](https://mdxjs.com/)，它结合了 Markdown 和 JSX。

可以在 MDX 中使用 [`Doc Blocks`](https://storybook.js.org/docs/react/api/doc-block-argtypes) 来快速构建文档和定义 story。

> 📢：这里官方文档有错，Canvas 里只能有一个 Story，所以需要拆成三个 Canvas 

```markdown
<!-- Checkbox.stories.mdx -->
import { Canvas, Meta, Story } from '@storybook/addon-docs';
import { Checkbox } from './Checkbox';

<Meta title="MDX/Checkbox" component={Checkbox} />
export const Template = (args) => <Checkbox {...args} />;

# Checkbox
With `MDX`, we can define a story for `Checkbox` right in the middle of our
Markdown documentation.

<!-- Stories -->
<Canvas>
  <Story 
    name="Unchecked"
    args={{ 
      label: 'Unchecked',
    }}>
    {Template.bind({})}
  </Story>
</Canvas>

<Canvas>
	<Story 
    name="Checked"
    args={{ 
      label: 'Unchecked', 
      checked: true,
    }}>
    {Template.bind({})}
  </Story>
</Canvas>

<Canvas>
	<Story 
    name="Secondary"
    args={{
      label: 'Secondary', 
      checked: true, 
      appearance: 'secondary',
    }}>
    {Template.bind({})}
  </Story>
</Canvas>
```

![](./assets/storybook-mdx.png)

#### Documentation-only MDX

- 当 MDX 文件中没有定义 `<Meta>` 时，该 MDX 文件可以作为 component、story 的文档，详情请参考 [CSF Stories with arbitrary MDX](https://github.com/storybookjs/storybook/blob/master/addons/docs/docs/recipes.md#csf-stories-with-arbitrary-mdx)

```js {7-9}
// Button.stories.mdx 
import CustomMDXDocumentation from './Custom-MDX-Documentation.mdx';
export default {
  title: 'Button',
  component: Button,
  parameters: {
    docs: {
      page: CustomMDXDocumentation
    }
  }
};
```

- 当 MDX 文件中定义了 `<Meta>`，但是没有定义 story 时，可以作为该组件的一个文档节点

```jsx
import { Meta } from '@storybook/addon-docs';
<Meta title="Button/Intro" component={Button}  />

# This is Button introduction
```

#### Embedding stories

通过 `<Story id="" />` 嵌入其它 stories

```markdown {6}
<!-- MyComponent.stories.mdx -->
import { Story } from '@storybook/addon-docs';
# Some header
And Markdown here

<Story id="some--id" />
```

#### Linking to other stories and pages

通过`[title](link)`链接到其它 stories 和 pages

```markdown
[Go to specific story canvas](?path=/story/some--id)
[Go to specific documentation page](?path=/docs/some--id)
```

#### Syntax Highlighting

Storybook 的 MDX 自带 Javascript, Markdown, CSS, HTML, Typescript, GraphQL 语言的语法高亮，但是要支持其它语言的语法高亮，需要自己进行扩展，比如使用 [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter).

```js
// .storybook/preview.js
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import scss from 'react-syntax-highlighter/dist/esm/languages/prism/scss';

// Registers and enables scss language support
SyntaxHighlighter.registerLanguage('scss', scss);
```

也可以进行 [单文件配置](https://storybook.js.org/docs/react/writing-docs/mdx#syntax-highlighting)

### Preview and build docs

在 `package.json` 文件中添加下面两个 script 来 preview 和 build 文档

```json
{
  "scripts": {
    "storybook-docs": "start-storybook --docs --no-manager-cache",
    "build-storybook-docs": "build-storybook --docs",
  }
}
```

Build 生成的文件放在 `storybook-static` 文件夹里

### Docs configuration summary

可以在 MDX 中通过 `parameters.docs` 来配置文档

```js
export default {
  parameters: {
    docs: {
      page: CustomMDXDocumentation
    }
  }
};
```

通过官方文档归纳出有以下这些配置项：


| 选项             | 说明                                                         |
| ---------------- | ------------------------------------------------------------ |
| page             | 自定义文档或文档模版（在 `preview.js` 中），可以是一个 MDX 文件或者一个返回 React 组件的函数 |
| description      | {component, story}，修改组件或者 stroy 的描述                |
| inlineStories    | 渲染 story 的方式：`true `(inline) / `false` (iframe)        |
| prepareForInline | 一个函数，将 story 的内容从给定的框架转换为 React 可以渲染的内容 |
| disable          | 禁止 story 出现在 Docs 中                                    |
| theme            | 文档主题色，详情请参考 [Theming](https://storybook.js.org/docs/react/configure/theming#theming-docs) |
| source           | 用于 Source Doc Block，详情请参考 [Source](https://storybook.js.org/docs/react/writing-docs/doc-block-source) |
| controls         | 用于 Controls Doc Block，请求请参考 [Controls](https://storybook.js.org/docs/react/api/doc-block-controls) |
| argTypes         | 用于 ArgTypes Doc Block                                      |
| canvas           | 用于 Canvas Doc Block                                        |
| toc              | 文档内容目录，详情请参考 [Configure the table of contents](https://storybook.js.org/docs/react/writing-docs/autodocs#configure-the-table-of-contents) |
| container        | 自定义文档容器组件，详情请参考 [Customize the Docs Container](https://storybook.js.org/docs/react/writing-docs/autodocs#customize-the-docs-container) |
| autodocs         | 配置自动生成文档，可选值为：`true`, `false`, `tag`，当配置`tag `时，通过在 story 中添加 `tag: ['autodocs']`为组件自动生成文档，详情请参考 [Configure](https://storybook.js.org/docs/react/writing-docs/autodocs#configure) |
| defaultName      | 重命名自动生成文档                                           |
| components       | 修改文档中的组件，详情请参考 [MDX component overrides](https://storybook.js.org/docs/react/configure/theming#mdx-component-overrides) |

## Configuration

Storybook 的配置文件在 `.storybook` 文件夹里，主要包括下面这些配置文件。

### `main.js`

`main.js` 控制 Storybook 服务器的行为，当你修改这个文件之后，必须重启服务。主要包括下面这些配置：

```js
// .storybook/main.js
module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: '@storybook/react',
  core: {
    builder: "@storybook/builder-webpack5",
    disableTelemetry: false, // https://storybook.js.org/docs/react/configure/telemetry#how-to-opt-out
    enableCrashReports: true
  },
  staticDirs: ["../public"],
  webpackFinal: async (config, { configType }) => {
    // Make whatever fine-grained changes you need
    // Return the altered config
    return config;
  },
  viteFinal: viteFinal(config) {},
  babel: async (options) => ({
    // Update your babel configuration here
    ...options,
  }),
  typescript: {},
  features: {},
  refs: {},
  env: (config) => ({...config, EXAMPLE_VAR: 'Example var' })，
  logLevel: 'debug'
};
```

通过官方文档归纳出有以下这些配置项：

| 选项         | 说明                                                         |
| ------------ | ------------------------------------------------------------ |
| stories      | 确定哪些文件为 story 文件，文件的匹配使用 [picomatch](https://github.com/micromatch/picomatch) 支持的语法，详情请参考 [Configure story loading]( https://storybook.js.org/docs/react/configure/overview#configure-story-loading) |
| addons       | 设置 Storybook 加载的 [addons](https://storybook.js.org/addons/) 列表 |
| framework    | 基于项目使用的框架来配置 Storybook。安装 Storybook 时，它是自动推断出工程使用的框架，目前 Storybook 主要支持这些 [框架](https://storybook.js.org/docs/react/api/frameworks-feature-support) |
| core         | 配置 Storybook 的内部特性，比如使用哪个构建工具，`{ builder: "@storybook/builder-webpack5" }` |
| staticDirs   | 设置 Storybook 要加载的静态文件的目录列表，详情请参考 [Images, fonts, and assets](https://storybook.js.org/docs/react/configure/images-and-assets#serving-static-files-via-storybook-configuration) |
| webpackFinal | 定制 Webpack 的配置，详情请参考 [Webpack](https://storybook.js.org/docs/react/builders/webpack) |
| viteFinal    | 定制 Vite 的配置，详情请参考 [Vite](https://storybook.js.org/docs/react/builders/vite) |
| babel        | 定制 Babel 的配置，详情请参考 [Babel](https://storybook.js.org/docs/react/configure/babel) |
| typescript   | 定制 Typescript 的配置，详情请参考 [TypeScript](https://storybook.js.org/docs/react/configure/typescript) |
| features     | 启用 Storybook 额外的一些配置，详情请参考 [Feature flags](https://storybook.js.org/docs/react/configure/overview#feature-flags) |
| refs         | 配置 [Storybook composition](https://storybook.js.org/docs/react/sharing/storybook-composition) |
| env          | 自定义 Storybook 环境变量，详情请参考 [Environment variables](https://storybook.js.org/docs/react/configure/environment-variables) |
| logLevel     | 控制日志输出，有这些选项：`silly`, `verbose`, `info` (默认), `warn`, `error`, `silent` |
| docs         | 配置 Storybook 自动生成文档，详情请参考 [Automatic documentation and Storybook](https://storybook.js.org/docs/react/writing-docs/autodocs#configure) |

### `preview.js`

`preview.js` 通过命名导出，来控制 story 怎样被渲染。可以把它当做 Storybook 的入口文件，可以添加全局样式，也可以配置全局 [Parameters](https://storybook.js.org/docs/react/writing-stories/parameters)、[Decorator](https://storybook.js.org/docs/react/writing-stories/decorators)、[Loaders](https://storybook.js.org/docs/react/writing-stories/loaders) 、[Globals](https://storybook.js.org/docs/react/essentials/toolbars-and-globals#globals)、[ArgTypes](https://storybook.js.org/docs/react/api/arg-types) 。

#### 引入 CSS 文件

```js
// .storybook/preview.js
import '../src/styles/global.css';

export default {
  parameters: {},
};
```

#### CSS 预处理

如果需要在 Webpack 中使用 Sass, Less，可以使用 [addon-styling-webpack](https://github.com/storybookjs/addon-styling-webpack) 或者修改 storybook 的 webpack 配置。

#### Parameters

[Parameters](https://storybook.js.org/docs/react/writing-stories/parameters) 是一组关于 story 的静态元数据，通常用于控制组件或者 story 的特性和 addon 的行为。下面是 [Essential addons](https://storybook.js.org/docs/react/essentials/introduction) 的一些配置:

```js
// .storybook/preview.js
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import CustomMDXDocumentation from './Custom-MDX-Documentation.mdx';

export const parameters = {
  // https://storybook.js.org/docs/react/essentials/controls
  controls: {
    expanded: true,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    },
    presetColors: [
      { color: "#ff4785", title: "Coral" },
      "rgba(0, 159, 183, 1)",
      "#fe4a49"
    ]
  },
  // https://storybook.js.org/docs/react/essentials/actions#automatically-matching-args
  actions: { argTypesRegex: "^on[A-Z].*" },
  // https://storybook.js.org/docs/react/essentials/viewport#configuration
  viewport: {
    viewports: INITIAL_VIEWPORTS
  },
  // https://storybook.js.org/docs/react/essentials/backgrounds#configuration
  backgrounds: {
    values: [
      { name: "red", value: "#f00" },
      { name: "green", value: "#0f0" },
      { name: "blue", value: "#00f" }
    ]
  },
  // https://storybook.js.org/docs/react/writing-docs/autodocs#with-mdx-documentation
  docs: {
    page: CustomMDXDocumentation
  },
  // https://storybook.js.org/docs/react/configure/story-layout
  layout: "fullscreen" // "centered", "fullscreen", "padded"(默认)
};
```

通过官方文档归纳出有以下这些配置项：

| 选项        | Addon                                                        |
| ----------- | ------------------------------------------------------------ |
| actions     | [Actions](https://storybook.js.org/addons/@storybook/addon-actions/)，[文档](https://storybook.js.org/docs/react/essentials/actions) |
| backgrounds | [Backgrounds](https://storybook.js.org/addons/@storybook/addon-backgrounds/)、[文档](https://storybook.js.org/docs/react/essentials/backgrounds) |
| controls    | [Controls](https://storybook.js.org/addons/@storybook/addon-controls/)，[文档](https://storybook.js.org/docs/react/essentials/controls) |
| docs        | [Docs](https://storybook.js.org/addons/@storybook/addon-docs/)，[文档](https://storybook.js.org/docs/react/writing-docs/autodocs#with-mdx-documentation) |
| layout      | [文档](https://storybook.js.org/docs/react/configure/story-layout) |
| viewport    | [Viewport](https://storybook.js.org/addons/@storybook/addon-viewport/)，[文档](https://storybook.js.org/docs/react/essentials/viewport) |
| msw         | [Mock Service Worker](https://storybook.js.org/addons/msw-storybook-addon)，[文档](https://storybook.js.org/docs/react/writing-stories/build-pages-with-storybook#mocking-api-services) |

#### GlobalTypes

[Globals](https://storybook.js.org/docs/react/essentials/toolbars-and-globals#globals) 是 Storybook 的全局输入，不特定于任何 story。它的一个用途是用于配置额外的 toolbar menus，例如下面创建一个 theme menu:

```js
// .storybook/preview.js
export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'circlehollow',
      // Array of plain string values or MenuItem shape (see below)
      items: ['light', 'dark'],
      // Property that specifies if the name of the item will be displayed
      showName: true,
      // Change title based on selected value
      dynamicTitle: true,
    }
  }
};
```

### `preview-head.html` & `preview-body.html` 

在 Storybook 中，story 是在特定 "preview iframe" 中呈现，如果你想要在 "preview iframe" head 或者 body 中添加额外的元素，比如样式表，可以通过 `preview-head.html` / `preview-body.html`。

```js
// font
<link rel=”preload” href=”your/font” />

//js
<script src="xxx.js"></script>

// stylesheets
<link href="xx.css" rel="stylesheet" type="text/css">
<style>
  #app {}
<style>
```

### `manager.js`

`manager.js` 控制 Storybook 的 UI，详情请参考 [Features and behavior](https://storybook.js.org/docs/react/configure/features-and-behavior)。比如我们可以修改 Storybook UI 的 theme.

首先创建 `YourTheme.js` 文件

```js
// .storybook/YourTheme.js

import { create } from '@storybook/theming';

export default create({
  base: 'light',
  brandTitle: 'My custom storybook',
  brandUrl: 'https://example.com',
  brandImage: 'https://place-hold.it/350x150',
  brandTarget: '_blank',
});
```

然后在  `manager.js` 引入这个 theme

```js
// .storybook/manager.js

import { addons } from '@storybook/addons';
import yourTheme from './YourTheme';

addons.setConfig({
  theme: yourTheme,
});
```

## Existing problems

- ArgTypes 没有 Array 数据类型，在 Controls addon 设置值时，默认给的值是 `{}`，导致 Storybook crash。关于这个我提了一个 [issue](https://github.com/storybookjs/storybook/issues/24097).
- 在 Canvas tab 不能查看 source code，关于这个我提了一个 [discussion](https://github.com/storybookjs/storybook/discussions/24170).
- 自动生成的代码还是存在很多问题

## References

- [Storybook](https://storybook.js.org/)
- [Component Story Format](https://www.componentdriven.org/)
- [JSDoc](https://jsdoc.app/)
- [MDX](https://mdxjs.com/)
- [Chromatic](https://www.chromatic.com/)
- [Storybook Docs Recipes](https://github.com/storybookjs/storybook/blob/master/addons/docs/docs/recipes.md#storybook-docs-recipes)
- [CSF Stories with arbitrary MDX](https://github.com/storybookjs/storybook/blob/master/addons/docs/docs/recipes.md#csf-stories-with-arbitrary-mdx)
- [Jest](https://jestjs.io/)
- [Test-Library](https://testing-library.com/)
- [picomatch](https://github.com/micromatch/picomatch)
- [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)