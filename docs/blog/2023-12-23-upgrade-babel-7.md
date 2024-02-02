---
pageClass: blog-page
title: 升级 Babel 7
tags:
  - web
  - babel
date: 2023-12-23
author: cp3hnu
location: ChangSha
summary: 升级 Babel 7
---

# 升级 Babel 7 

最近入职了一家新公司，发现前端项目里用的还是 Babel 6，其实 Babel 在 2018-08-28 就发布了 7.0.0 版本，距今已有 5 年多了，并且在项目中无法使用一些 JavaScript 新特性，比如 [Optional Chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)，于是决定升级一下 Babel，顺便全面学习一下 Babel.

## Babel

> 当前版本是 Babel 7.23

Babel 就是将用 ECMAScript 2015+ 语法编写的代码转换为向后兼容的 JavaScript 语法，以便在旧版本的浏览器里运行，比如箭头函数

```js
// Babel 接收到的输入是： ES2015 箭头函数
[1, 2, 3].map(n => n + 1);

// Babel 输出： ES5 语法实现的同等功能
[1, 2, 3].map(function(n) {
  return n + 1;
});
```

同时，Babel 通过 [`core-js`](https://github.com/zloirock/core-js) 以 polyfill 的方式在目标环境中添加缺失的功能。比如，如果浏览器不支持 `Promise.prototype.finally` 

```js
Promise.resolve().finally();
```

被转换为

```js
require("core-js/modules/es.promise.finally");
Promise.resolve().finally();
```

### 核心库

所有的 Babel 模块都是作为独立的 npm 包发布的，并且从 Babel 7 开始都使用 `@babel` 作用域。Babel 的核心功能包含在 [@babel/core](https://www.babeljs.cn/docs/babel-core) 模块中，这个模块包含了一些转换和解析函数。

首先安装 `@babel/core` 和 `@babel/preset-env`（`@babel/preset-env` 后面会讲到）。

```sh
$ npm install @babel/core @babel/preset-env -D
```

然后就可以使用 `transformSync` 等函数来转换代码了。

> 更多转换函数，请参考 [@babel/core](https://www.babeljs.cn/docs/babel-core)

```js
const babel = require("@babel/core");
const options = {
  presets: ["@babel/preset-env"]
};
const code = "const a = [3, 2, 1].map(n => n + 1);";
try {
  const result = babel.transformSync(code, options);
  console.log(result.code);
} catch (error) {
  console.error(error);
}

/*
  输出 ES5 代码：
  "use strict";
  var b = [3, 2, 1].map(function (n) {
    return n + 1;
  });
*/
```

#### 配置选项

转换函数的行为受配置选项（[`options`](https://babeljs.io/docs/options)）的影响，比如 [`targets`](https://babeljs.io/docs/options#targets) 选项表示项目支持的目标环境，如果没有这个选项，表示要支持最老的浏览器，比如上面的列子，将箭头函数转换成了 ES5 代码。设置 `targets` 可以减少一些不必要的转换。 `targets` 支持 [`browserslist`](https://github.com/ai/browserslist) 查询字符串，比如：

```js
{
  "targets": "> 0.25%, not dead"
}
```

这个查询字符串的含义是：目标环境是全球浏览器市场占比超过 0.25% 的浏览器，并且这些浏览器都还在活跃更新中。

> 逗号 （`,`）在  [`browserslist`](https://github.com/ai/browserslist) 表示或者，相当于 `or`，取并集，交集使用 `and`，补集使用 `not`，但是我发现  `not dead` 是个另外，虽然上面使用了 `> 0.25%, not dead`，但是作用是交集，意思是占比超过 0.25%并且还在活跃。

可以使用 `browserslist` 命令查看这个字符串包含哪些浏览器

```sh
$ npx browserslist "> 0.25%, not dead"
```

更多详情请参考 [`browserslist`](https://github.com/ai/browserslist).

完整的配置选项，请参考 [`options`](https://babeljs.io/docs/options).

除了提供 `options` 参数之外，还可以通过配置文件，比如 `babel.config.json`（后面会讲到），来配置转换函数的行为。

```json
// babel.config.json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "edge": "17",
          "firefox": "60",
          "chrome": "67",
          "safari": "11.1"
        },
      }
    ]
  ]
}
```

### 命令行工具

[@babel/cli](https://babeljs.io/docs/babel-cli) 是 Bebel 的命令行工具，从终端转换代码

```sh
$ npm install @babel/core @babel/cli @babel/plugin-transform-arrow-functions -D
```

比如要转换下面的代码

```js
// src/example.js

const a = [3, 2, 1].map(n => n + 1);
```

运行 `babel` 命令

```sh
$ npx babel src/example.js --plugins=@babel/plugin-transform-arrow-functions --out-dir lib
```

转换后的代码

```js
// lib/example.js

const b = [3, 2, 1].map(function (n) {
  return n + 1;
});
```

#### 命令行参数

**`--no-babelrc`**

忽略 Babel 配置文件 `.babelrc` 或者 `.babelrc.json`，但是无法忽略 `babel.config.json`

**`--presets`**

指定 presets，逗号分割

 **`--plugins`** 

指定 plugins，逗号分割

**`--out-dir` / `-d`**

指定转换输出的文件夹

**`--out-file` / `-o`**

指定转换输出的文件名

**`--watch` / `-w`** 

当文件改变时，自动编译

**`--ignore`**

忽略哪些文件，逗号分割，支持 glob 文件名匹配

更多配置选项，请参考 [@babel/cli](https://babeljs.io/docs/babel-cli)， 或者使用 `babel --help` 进行查看。

Babel 也提供了一个[在线转换器](https://babeljs.io/repl)，可以方便地查看转换代码。

### Plugins

Babel 是构建在插件上的，通过插件来转换代码，比如上面例子中的 `@babel/plugin-transform-arrow-functions` 转换箭头函数。Babel 提供了很多的转换函数，详情请查看 [Plugins List](https://www.babeljs.cn/docs/plugins-list)，没有这些插件 `@babel/core` 和 `@babel/cli` 都无法转换代码。我们也可以创建自己的插件，这个不在本篇文章的讨论范围之内。

#### `@babel/plugin-transform-runtime`

Babel 大部分插件都是整合到 presets 使用（下面会讲到），[`@babel/plugin-transform-runtime`](https://babeljs.io/docs/babel-plugin-transform-runtime) 是需要单独使用的插件 ，它的作用是通过注入的 helper 函数以减少代码体积。

Babel 使用一些非常小的 helper 函数来处理常见的函数，比如 `_extend`。默认情况下，这些函数源码将被添加到每个需要它的文件里。有时这种重复是不必要的，特别是当您的应用程序有很多个文件中时。通过 `@babel/plugin-transform-runtime`，所有的 helper 函数都会引用 [`@babel/runtime`](https://babeljs.io/docs/babel-runtime) 模块，以减少代码体积。

安装

```sh
$ npm install @babel/plugin-transform-runtime -D
$ npm install @babel/runtime
```

配置

```json
{
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "helpers": true,
        "regenerator": true,
        "version": "^7.23.8",
        "corejs": false,
      }
    ]
  ]
}
```

##### **`helpers`**

布尔值，默认是 `true`。确定是否引用 `@babel/runtime` 模块来代替注入 helper 函数。

我们来看一个例子：

```js
class Person {}
```

当 `helpers` 为 `false` 时

> 设置目标浏览者不支持 `class` 语法，例如 `ie: 10`

```js
"use strict";

// 有省略
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var Person = /*#__PURE__*/_createClass(function Person() {
  _classCallCheck(this, Person);
});
```

当 `helpers` 为 `true` 时

```js
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var Person = /*#__PURE__*/(0, _createClass2.default)(function Person() {
  (0, _classCallCheck2.default)(this, Person);
});
```

##### **`regenerator`**

布尔值，默认是 `true`。使用 [regenerator runtime](https://github.com/facebook/regenerator/tree/main/packages/runtime) 转换生成器函数（generator functions），而不污染全局作用域。

我们来看一个例子：

```js
function* foo() {}
```

`regenerator` 为 `true` 时，转换后的代码如下

> 当 `helpers` 为 `true` 时

```js
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _regeneratorRuntime2 = _interopRequireDefault(require("@babel/runtime/helpers/regeneratorRuntime"));
var _marked = /*#__PURE__*/(0, _regeneratorRuntime2.default)().mark(foo);
function foo() {
  return (0, _regeneratorRuntime2.default)().wrap(function foo$(_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
      case "end":
        return _context.stop();
    }
  }, _marked);
}
```

`regenerator` 为 `false` 时，官方文档说是这样的

```js
"use strict";

var _marked = [foo].map(regeneratorRuntime.mark);

function foo() {
  return regeneratorRuntime.wrap(
    function foo$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
          case "end":
            return _context.stop();
        }
      }
    },
    _marked[0],
    this
  );
}
```

但是经我测试，还是跟 `regenerator` 为 `true` 时一样。更多详情请参考 [Babel Regenerator and Polyfills](./2024-01-20-babel-regenerator-and-polyfills/).

##### **`corejs`**

有三个值，`false`、`2`、`3`，这个与 [`@babel/preset-env`](https://babeljs.io/docs/babel-preset-env) 的 `corejs` 有冲突，多用于 library。更多详情请参考 [Babel Regenerator and Polyfills](./2024-01-20-babel-regenerator-and-polyfills/).

**`version`**

指定 [`@babel/runtime`](https://babeljs.io/docs/babel-runtime) 模块的版本，默认是 `@babel/runtime@7.0.0`

#### Proposal Plugins

Javascript 标准语法或者已经完成的提案语法转换插件已经并入到 `@babel/preset-env` 预设（下面会讲到），但是没有完成的提案语法Babel 提供了单独的插件，比如 [`@babel/plugin-proposal-decorators`](https://babeljs.io/docs/babel-plugin-proposal-decorators)，更多详情请参考 [TC39 Proposals](https://babeljs.io/docs/babel-plugin-proposal-async-do-expressions)。

### Presets

有时候需要用到很多的插件，一个一个去指定非常不方便，于是 Babel 通过 presets （预设）来包含多个插件。比如前面提到的  [`@babel/preset-env`](https://babeljs.io/docs/babel-preset-env)。

#### `@babel/preset-env`

[`@babel/preset-env`](https://babeljs.io/docs/babel-preset-env) 是我们使用 Babel 必须要用到的 presets，它包含了转换 Javascript 新语法的所有插件，而且通过 [`core-js`](https://github.com/zloirock/core-js) 库添加新语法 polyfills，有了它我们就可以使用最新的 Javascript 语法了。同时它还非常智能，通过 [`browserslist`](https://github.com/browserslist/browserslist), [`compat-table`](https://github.com/kangax/compat-table) 等开源库提供的数据，再根据项目配置的 `targets`，只进行必要的代码转换和添加必要的 [`core-js`](https://github.com/zloirock/core-js) polyfills。

> `@babel/preset-env ` 只包含 stage-3 及以上的 JavaScript 提案

安装 `@babel/preset-env` 和  `core-js`，注意 `core-js` 是作为依赖而非开发依赖，因为它会被引入到源码里。

```sh
$ npm i @babel/preset-env -D
$ npm i core-js
```

一般通过配置文件来指定 `@babel/preset-env`.

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": "> 0.25%, not dead",
        "useBuiltIns": "usage",
        "corejs": "3.35.0"
      }
    ]
  ]
}
```

`@babel/preset-env` 主要有下面这些配置选项：

> 更多的配置选项，请参考 `@babel/preset-env` 的 [`options`](https://babeljs.io/docs/babel-preset-env#options).

##### `useBuiltIns`

这个选项决定 `@babel/preset-env` 怎么处理 polyfills，它有三个值 `"usage"`、 `"entry"`、`false` 可选

 **`"usage" `**：它表示以文件为单位，按需导入 polyfills，比如

```js
// example.js

const a = [3, 2, 1].toSorted();
```

Babel 转换后的文件（如果目标浏览器不支持 `toSorted` 方法）

```js
"use strict";

require("core-js/modules/es.array.sort.js");
require("core-js/modules/es.array.to-sorted.js");

const a = [3, 2, 1].toSorted();
```

一般在项目里我们使用 `"usage" ` 这个配置

 **`"entry"`**： 它表示单独导入不同的 `core-js` 入口点来替换 `import "core-js"` 和 `requier("core-js")` 语句。

一般在项目的入口文件导入 `"core-js"` 

```js
// main.js

import "core-js";
```

Babel 转换后的文件

```js
"use strict";

require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.symbol.async-iterator.js");
require("core-js/modules/es.symbol.match.js");
require("core-js/modules/es.symbol.match-all.js");
require("core-js/modules/es.symbol.replace.js");
require("core-js/modules/es.symbol.search.js");
require("core-js/modules/es.symbol.split.js");
require("core-js/modules/es.error.cause.js");
......
// 还有很多
```

**`false`**: 默认值，表示不添加 polyfills，这个基本不用。

##### `corejs`

Babel 7.4.0 使用 `core-js` 作为 polyfills，而废弃了 `@babel/polyfill` 模块。

这个选项除了指定 `core-js` 的版本外，还支持一个 `proposals` 特性，表示是否启用 `core-js` 支持的提案 polyfills，例如： `corejs: { version: "3.8", proposals: true }`，表示启用 `core-js@3.8` 支持的每一个提案 polyfills。

查看 `core-js` 支持哪些提案 polyfills，请参考  [`core-js/proposals`](https://github.com/zloirock/core-js/tree/master/packages/core-js/proposals)。

##### `targets`

确定目标浏览器或者目标环境，有两种写法：一是通过 [browserslist](https://github.com/ai/browserslist) 查询字符串

```js
{
  "targets": "> 0.25%, not dead",
}
```

也可以使用默认值

```js
{
  "targets": "defaults",
}
```

`defaults` 在 `browserslist` 表示 `> 0.5%, last 2 versions, Firefox ESR, not dead`

二是指定目标浏览器或者目标环境

```js
"targets": {
  "edge": "17",
  "firefox": "60",
  "chrome": "67",
  "safari": "11.1"
},
```

关于 Babel 确定 `targets` 有三个层面，优先级从低到高依次是：

-  [browserslist](https://github.com/ai/browserslist) 配置文件
- 顶层的 [`targets` 选项](https://babeljs.io/docs/options#targets)，比如配置文件里的 `targets` 选项
- `@babel/preset-env` 的 `targets` 选项

##### `shippedProposals`

当 `shippedProposals` 为 `true` 时，表示启用浏览器已支持的 stage-3 的提案 polyfills。

### Babel 配置

Babel 提供两种配置文件

- 项目范围的配置文件，位于项目的根目录下，它将应用于项目中的所有文件。文件名是 `babel.config.[json|js|cjs|mjs|cts]`

- 文件相关的配置文件，位于需要进行转换的文件的目录下。这种配置文件通常用于只对特定文件或目录进行转换的场景。例如，你可能有一些第三方库，你不希望这些库被 Babel 转换或修改。这样的配置文件有三种
  - `.babelrc.[json|js|cjs|mjs|cts]`
  - `.babelrc`
  - `package.json` 里的 `babel` 属性

一般在我们 Vue/React 项目里这两种配置文件都可以，主要是用来配置 presets 和 plugins

```json
{
  "presets": [...],
  "plugins": [...]
}
```

更多的配置选项请参考 [Options](https://babeljs.io/docs/options)

#### `babel.config.json` 与 `.babelrc.json` 的区别

// TODO

### `babel-loader`

在我们基于 webpack 构建的项目中，我们一般不是使用 `@babel/core` 或者 `@babel/cli` 来转换代码，而是通过 [`babel-loader`](https://github.com/babel/babel-loader) 来转换代码。

```sh
npm install babel-loader @babel/core @babel/preset-env webpack -D 
```

#### 版本兼容性

| babel-loader | supported webpack versions | supported Babel versions | supported Node.js versions |
| ------------ | -------------------------- | ------------------------ | -------------------------- |
| 8.x          | 4.x or 5.x                 | 7.x                      | >= 8.9                     |
| 9.x          | 5.x                        | ^7.12.0                  | >= 14.15.0                 |

#### 配置

```js
// webpack 配置文件
module: {
  rules: [
    {
      test: /\.(?:js|mjs|cjs)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', { targets: "defaults" }]
          ]
        }
      }
    }
  ]
}
```

建议通过 Babel 配置文件来配置 `options`。

也有一些 babel-loader 特有的选项：

##### `cacheDirectory`

设置缓存文件夹，默认 `false` 。设置后，该文件夹将用于缓存 loader 的结果。后面的 webpack 构建将试图从该缓存中读取数据，以避免 Babel 重新编译。如果设置为 `ture`（`{cacheDirectory: true}`），则 loader 将使用默认缓存文件夹（`node_modules/.cache/babel-loader`）

##### `cacheCompression`

默认 `true` 。设置后，每次 Babel 转换的输出都将使用 Gzip 进行压缩。 如果项目转换数千个文件，可以请将其设置为 `false` 。

## 升级 Babel

### Babel 7 的变化

了解了 Babel 的知识之后，现在我们来升级 Babel 7，Babel 7主要有下面几个大变化

1. 使用 `@babel` 作用域，比如 `@babel/core` 替换 `babel-core`

2. Polyfills 使用 `core-js` 替换 `babel-polyfill`、`@babel/polyfill`

3. 删除所有的 stage preset，比如 `babel-preset-stage-0`，使用具体的插件代替

   ```js
   {
     "plugins": [
       // Stage 0
       "@babel/plugin-proposal-function-bind",
   
       // Stage 1
       "@babel/plugin-proposal-export-default-from",
       "@babel/plugin-proposal-logical-assignment-operators", // 2021 已加入 preset-env
       ["@babel/plugin-proposal-optional-chaining", { "loose": false }], // 2020 已加入 preset-env
       ["@babel/plugin-proposal-pipeline-operator", { "proposal": "minimal" }], 
       ["@babel/plugin-proposal-nullish-coalescing-operator", { "loose": false }], // 2020 已加入 preset-env
       "@babel/plugin-proposal-do-expressions",
   
       // Stage 2
       ["@babel/plugin-proposal-decorators", { "legacy": true }],
       "@babel/plugin-proposal-function-sent",
       "@babel/plugin-proposal-export-namespace-from", // 2020 已加入 preset-env
       "@babel/plugin-proposal-numeric-separator", // 2021 已加入 preset-env
       "@babel/plugin-proposal-throw-expressions",
   
       // Stage 3
       "@babel/plugin-syntax-dynamic-import", // 2020 已加入 preset-env
       "@babel/plugin-syntax-import-meta", // 2020 已加入 preset-env
       ["@babel/plugin-proposal-class-properties", { "loose": true }], // 2020 已加入 preset-env
       "@babel/plugin-proposal-json-strings" // 2019 已加入 preset-env
     ]
   }
   ```

   更多详情请参考 [Stage-0 README](https://github.com/babel/babel/tree/755ec192e22c6b6e00782e4810366d0166fdbebd/packages/babel-preset-stage-0#babelpreset-stage-0)。

   其实 [Stage-0 README](https://github.com/babel/babel/tree/755ec192e22c6b6e00782e4810366d0166fdbebd/packages/babel-preset-stage-0#babelpreset-stage-0) 文档需要更新了，有一些提案已经到达了 Stage 4（Finished），所以不在需要了，更多详情请参考 [Upgrade to Babel 8](https://babeljs.io/docs/v8-migration)

   > Babel 7.22 +

   | Proposal/Syntax                                       | Transform                                              | 并入 preset-env 的时间 |
   | ----------------------------------------------------- | ------------------------------------------------------ | ---------------------- |
   | `@babel/plugin-proposal-logical-assignment-operators` | `@babel/plugin-transform-logical-assignment-operators` | 2021                   |
   | `@babel/plugin-proposal-optional-chaining`            | `@babel/plugin-transform-optional-chaining`            | 2020                   |
   | `@babel/plugin-proposal-nullish-coalescing-operator`  | `@babel/plugin-transform-nullish-coalescing-operator`  | 2020                   |
   | `@babel/plugin-proposal-export-namespace-from`        | `@babel/transform-proposal-export-namespace-from`      | 2020                   |
   | `@babel/plugin-proposal-numeric-separator`            | `@babel/plugin-transform-numeric-separator`            | 2021                   |
   | `@babel/plugin-proposal-class-properties`             | `@babel/plugin-transform-class-properties`             | 2020                   |
   | `@babel/plugin-proposal-json-strings`                 | `@babel/plugin-proposal-json-strings`                  | 2019                   |
   | `@babel/plugin-syntax-dynamic-import`                 | -                                                      | 2020                   |
   | `@babel/plugin-syntax-import-meta`                    | -                                                      | 2020                   |

   当然也加入了一些新的提案插件，详情请参考 [TC39 Proposals](https://babeljs.io/docs/babel-plugin-proposal-async-do-expressions)。

4.  删除了所有的年度 presents，比如  `babel-preset-es2015`，使用 `@babel/preset-env` 代替

5. 添加了全局配置文件 `babel.config.[json|js]`

### 升级 `package.json`、配置文件

Babel 团队开发了新的工具 [`babel-upgrade`](https://github.com/babel/babel-upgrade)，自动升级修改 `package.json` 中依赖以及 `.babellrc.js` 配置

先运行下面的命名

```sh
$ npx babel-upgrade --write --install
```

文件修改如下

`package.json`

```diff
   "devDependencies": {
+    "@babel/core": "^7.0.0",
+    "@babel/plugin-proposal-class-properties": "^7.0.0",
+    "@babel/plugin-proposal-decorators": "^7.0.0",
+    "@babel/plugin-proposal-export-namespace-from": "^7.0.0",
+    "@babel/plugin-proposal-function-sent": "^7.0.0",
+    "@babel/plugin-proposal-json-strings": "^7.0.0",
+    "@babel/plugin-proposal-numeric-separator": "^7.0.0",
+    "@babel/plugin-proposal-throw-expressions": "^7.0.0",
+    "@babel/plugin-syntax-dynamic-import": "^7.0.0",
+    "@babel/plugin-syntax-import-meta": "^7.0.0",
+    "@babel/plugin-syntax-jsx": "^7.0.0",
+    "@babel/plugin-transform-runtime": "^7.0.0",
+    "@babel/polyfill": "^7.0.0",
+    "@babel/preset-env": "^7.0.0",
-    "babel-core": "6.26.0",
-    "babel-eslint": "8.0.3",
+    "babel-eslint": "^9.0.0",
     "babel-helper-vue-jsx-merge-props": "2.0.3",
-    "babel-loader": "7.1.2",
+    "babel-loader": "^8.0.0",
     "babel-plugin-dynamic-import-node": "^1.2.0",
-    "babel-plugin-syntax-jsx": "6.18.0",
-    "babel-plugin-transform-runtime": "6.23.0",
     "babel-plugin-transform-vue-jsx": "3.5.0",
-    "babel-polyfill": "^6.26.0",
-    "babel-preset-env": "1.6.1",
-    "babel-preset-stage-2": "6.24.1",
   }
```

`.babelrc`

```diff
 {
   "presets": [
     [
-      "env",
+      "@babel/preset-env",
       {
         "modules": false,
         "targets": {
-          "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
+          "browsers": [
+            "> 1%",
+            "last 2 versions",
+            "not ie <= 8"
+          ]
         }
       }
+    ]
+  ],
+  "plugins": [
+    "transform-vue-jsx",
+    [
+      "@babel/plugin-transform-runtime",
+      {
+        "corejs": 2
+      }
+    ],
+    "@babel/plugin-syntax-dynamic-import",
+    "@babel/plugin-syntax-import-meta",
+    "@babel/plugin-proposal-class-properties",
+    "@babel/plugin-proposal-json-strings",
+    [
+      "@babel/plugin-proposal-decorators",
+      {
+        "legacy": true
+      }
     ],
-    "stage-2"
+    "@babel/plugin-proposal-function-sent",
+    "@babel/plugin-proposal-export-namespace-from",
+    "@babel/plugin-proposal-numeric-separator",
+    "@babel/plugin-proposal-throw-expressions"
   ],
-  "plugins": ["transform-vue-jsx", "transform-runtime"],
   "env": {
     "development": {
-      "plugins": ["dynamic-import-node"]
+      "plugins": [
+        "dynamic-import-node"
+      ]
     }
   }
 }
```

因为以前只使用了 `stage-2` presets，所以只安装了 [Stage-0 README](https://github.com/babel/babel/tree/755ec192e22c6b6e00782e4810366d0166fdbebd/packages/babel-preset-stage-0#babelpreset-stage-0) 里的 stage 2 和 stage 3 插件，如果想安装 stage0 和 stage1 可以自行添加

### 最后的调整

1. 删除 `@babel/polyfill`、`@babel/runtime-corejs2`（如果有），安装 `core-js`、`@babel/runtime`

   ```sh
   $ npm un @babel/polyfill @babel/runtime-corejs2
   $ npm i core-js @babel/runtime
   ```

2. `babel-upgrade` 有个错误，没有删除 `babel-eslint `，Babel 7 现在使用 [`@babel/eslint-parser`](https://www.npmjs.com/package/@babel/eslint-parser) 代替  `babel-eslint `，所以要删除  `babel-eslint `，安装  `@babel/eslint-parser`。如果 ESLint 使用了 `babel-eslint `，同步进行修改。

   ```sh
   $ npm un babel-eslint
   $ npm i @babel/eslint-parser -D
   ```

3. 删除没用的插件

   `@babel/plugin-proposal-class-properties`

   `@babel/plugin-proposal-export-namespace-from`

   `@babel/plugin-proposal-json-strings`

   `@babel/plugin-proposal-numeric-separator`

   `@babel/plugin-syntax-dynamic-import`

   `@babel/plugin-syntax-import-meta`

4. 升级 Vue2 JSX 相关插件，详情请参考 [Vue JSX](https://github.com/vuejs/jsx-vue2).

   删除 `@babel/plugin-syntax-jsx`、`babel-plugin-transform-vue-jsx`、`babel-helper-vue-jsx-merge-props`

   安装 `@vue/babel-preset-jsx`、`@vue/babel-helper-vue-jsx-merge-props`

   ```sh
   $ npm un @babel/plugin-syntax-jsx babel-plugin-transform-vue-jsx babel-helper-vue-jsx-merge-props
   $ npm i @vue/babel-preset-jsx @vue/babel-helper-vue-jsx-merge-props -D
   ```

5. 使用 `ncu` 安装列出 Babel 7 最新的版本号

   ```sh
   $ ncu -u "@babel/*"
   ```

   最终的 `package.json` 文件如下（只列出 Babel 相关的）：

   ```js
   {
     "dependencies": {
       "@babel/runtime": "^7.23.8",
       "core-js": "^3.35.0",
     },
     "devDependencies": {
       "@babel/core": "^7.23.7",
       "@babel/plugin-proposal-decorators": "^7.23.7",
       "@babel/plugin-proposal-function-sent": "^7.23.3",
       "@babel/plugin-proposal-throw-expressions": "^7.23.3",
       "@babel/plugin-transform-runtime": "^7.23.7",
       "@babel/eslint-parser": "^7.23.3",
       "@babel/preset-env": "^7.23.8",
       "@vue/babel-helper-vue-jsx-merge-props": "^1.4.0",
       "@vue/babel-preset-jsx": "^1.4.0",
       "babel-loader": "^8.3.0",
       "babel-plugin-dynamic-import-node": "^1.2.0"
     },
   }
   ```

6. 修改配置文件，最终的配置文件如下

   ```js
   {
     "presets": [
       "@vue/babel-preset-jsx",
       [
         "@babel/preset-env",
         {
           "useBuiltIns": "usage",
           "corejs": "^3.35.0",
           "targets": "> 1%, last 2 versions, not ie <= 8",
       ]
     ],
     "plugins": [
       [
         "@babel/plugin-transform-runtime",
         {
           "helpers": true,
           "regenerator": false
         }
       ],
       [
         "@babel/plugin-proposal-decorators",
         {
           "legacy": true
         }
       ],
       "@babel/plugin-proposal-function-sent",
       "@babel/plugin-proposal-throw-expressions",
     ]
   }
   ```

7. 删除 `node_modules`，重新安装

   ```sh
   $ npm i
   ```

8. 运行验证

## References

- [Babel](https://babeljs.io/docs/)
- [@babel/core](https://www.babeljs.cn/docs/babel-core)
- [@babel/cli](https://babeljs.io/docs/babel-cli)
- [@babel/preset-env](https://babeljs.io/docs/babel-preset-env)
- [Plugins List](https://www.babeljs.cn/docs/plugins-list)
-  [TC39 Proposals](https://babeljs.io/docs/babel-plugin-proposal-async-do-expressions)
- [`core-js`](https://github.com/zloirock/core-js)
- [`browserslist`](https://github.com/ai/browserslist)
- [`compat-table`](https://github.com/kangax/compat-table)
- [`core-js/proposals`](https://github.com/zloirock/core-js/tree/master/packages/core-js/proposals) 
- [`babel-loader`](https://github.com/babel/babel-loader) 
- [@babel/plugin-transform-runtime](https://babeljs.io/docs/babel-plugin-transform-runtime)
- [@babel/runtime](https://babeljs.io/docs/babel-runtime)
-  [Stage-0 README](https://github.com/babel/babel/tree/755ec192e22c6b6e00782e4810366d0166fdbebd/packages/babel-preset-stage-0#babelpreset-stage-0)
- [`babel-upgrade`](https://github.com/babel/babel-upgrade)
- [Vue JSX](https://github.com/vuejs/jsx-vue2)
- [Upgrade to Babel 8](https://babeljs.io/docs/v8-migration)

 

