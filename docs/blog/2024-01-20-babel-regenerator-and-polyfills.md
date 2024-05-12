---
pageClass: blog-page
title: Babel Regenerator and Polyfills
tags:
  - web
  - babel
date: 2024-01-20
author: cp3hnu
location: ChangSha
summary: 在写上一篇升级 Babel 7 过程中，发现 @babel/plugin-transform-runtime 插件除了添加 helper 函数之外，还可以转换生成器函数和添加 polyfills。但是 @babel/plugin-transform-regenerator 插件也可以转换生成器函数，那这两者之间有什么区别呢？同时 @babel/preset-env 通过 core-js 也能添加 polyfills，那他们之间又有什么区别呢？这篇文章我们来探讨一下。
---

# Babel Regenerator and Polyfills

在写上一篇文章 [升级 Babel 7](./2023-12-23-upgrade-babel-7/) 的过程中，发现 [`@babel/plugin-transform-runtime`](https://babeljs.io/docs/babel-plugin-transform-runtime) 插件除了添加 helper 函数之外，还可以转换生成器函数和添加 polyfills。但是 [`@babel/plugin-transform-regenerator`](https://babeljs.io/docs/babel-plugin-transform-regenerator) 插件也可以转换生成器函数，那这两者有什么区别呢？同时 [`@babel/preset-env`](https://babeljs.io/docs/babel-preset-env) 通过 [`core-js`](https://github.com/zloirock/core-js) 也能添加 polyfills，那他们之间又有什么区别呢？这篇文章我们来探讨一下。

> 下面的讨论是基于 Babel 7.23+

## Regenerator

首先我们来看看 Regenerator.

### `@babel/plugin-transform-runtime`

[`@babel/plugin-transform-runtime`](https://babeljs.io/docs/babel-plugin-transform-runtime#regenerator-aliasing) 文档上说，设置 `{ "regenerator": true }` 将使用 [regenerator runtime](https://github.com/facebook/regenerator/tree/main/packages/runtime) 转换生成器函数，而不污染全局作用域。
比如要转换的代码为

```js
// script.js
function* foo() {}
```

当 `regenerator` 为 `false`，转换后的代码为

```json
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

当 `regenerator` 为 `true`，转换后的代码为

> helper: true

```js
"use strict";
var _regenerator = require("@babel/runtime/regenerator");
var _regenerator2 = _interopRequireDefault(_regenerator);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
var _marked = [foo].map(_regenerator2.default.mark);
function foo() {
  return _regenerator2.default.wrap(
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

但是我发现当没有配置 [`@babel/preset-env`](https://babeljs.io/docs/babel-preset-env)  或者说没有配置 [`@babel/plugin-transform-regenerator`](https://babeljs.io/docs/babel-plugin-transform-regenerator) 时，根本无法转换生成器函数，下面是我的配置

```js
// .browserslistrc
not ie <= 8
```

```js
// babel.config.json
{
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "helpers": true,
        "regenerator": true,
        "version": "^7.23.8"
      }
    ]
  ]
}
```

或者

```js
// babel.config.json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "exclude": ["@babel/plugin-transform-regenerator"],
        "useBuiltIns": "usage",
        "corejs": "^3.35.0"
      }
    ]
  ],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "helpers": true,
        "regenerator": true,
        "version": "^7.23.8"
      }
    ]
  ]
}
```

使用 CLI 也无法转换

```sh
$ npx babel --plugins @babel/plugin-transform-runtime script.js
```

使用 Babel 提供的在线工具 [Try it out](https://babeljs.io/repl#?browsers=ie%209&build=&builtIns=false&corejs=3.21&spec=false&loose=false&code_lz=GYVwdgxgLglg9mAVAAmHOAKAlMg3gKGWQE8YBTAGwBNkBGAbnwF8g&debug=false&forceAllTransforms=false&modules=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=&prettier=false&targets=&version=7.23.10&externalPlugins=%40babel%2Fplugin-transform-runtime%407.23.9&assumptions=%7B%7D) 也是一样的。

### `@babel/plugin-transform-regenerator`

但是当我使用 [`@babel/plugin-transform-regenerator`](https://babeljs.io/docs/babel-plugin-transform-regenerator) 时，能使用 [regenerator runtime](https://github.com/facebook/regenerator/tree/main/packages/runtime) 转换了生成器函数，并且也没有污染全局作用域。

配置文件为

```json
{
  "plugins": [["@babel/plugin-transform-regenerator"]]
}
```

转换后的代码为

```js
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function () { 
  /* 这里省略了函数实现 */ 
}
var _marked = /*#__PURE__*/_regeneratorRuntime().mark(foo);

function foo() {
  return _regeneratorRuntime().wrap(function foo$(_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
      case "end":
        return _context.stop();
    }
  }, _marked);
}
```

当和 [`@babel/plugin-transform-runtime`](https://babeljs.io/docs/babel-plugin-transform-runtime) 一起使用时

```json
{
  "plugins": [
    "@babel/plugin-transform-regenerator",
    [
      "@babel/plugin-transform-runtime",
      {
        "helpers": true,
        "regenerator": false,
        "version": "^7.23.8"
      }
    ]
  ]
}
```

转换后的代码为

```js
import _regeneratorRuntime from "@babel/runtime/helpers/regeneratorRuntime";
var _marked = /*#__PURE__*/_regeneratorRuntime().mark(foo);
function foo() {
  return _regeneratorRuntime().wrap(function foo$(_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
      case "end":
        return _context.stop();
    }
  }, _marked);
}
```

### 结论

所以结论就是 Babel 文档错误或者没有更新，[`@babel/plugin-transform-runtime`](https://babeljs.io/docs/babel-plugin-transform-runtime) 插件无法转换生成器函数，而是 [`@babel/plugin-transform-regenerator`](https://babeljs.io/docs/babel-plugin-transform-regenerator) 插件可以转换生成器函数，可以搭配 [`@babel/plugin-transform-runtime`](https://babeljs.io/docs/babel-plugin-transform-runtime) 添加 helper 函数。

[`@babel/plugin-transform-runtime`](https://babeljs.io/docs/babel-plugin-transform-runtime) 插件的 `regenerator` 选项没有任何作用，详情请参考我提的 [issues-16260](https://github.com/babel/babel/issues/16260).

## Polyfills

现在我们来讨论 Polyfills

### `@babel/preset-env`

我们都知道 Babel 7 通过 [`@babel/preset-env`](https://babeljs.io/docs/babel-preset-env) 和 [`core-js`](https://github.com/zloirock/core-js) 添加 polyfills，以 `{ "useBuiltIns": "usage" }` 为例

配置文件

```js
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": "^3.35.0"
      }
    ]
  ]
}

```

要转换的代码

```js
// script.js
const a = new Set();
```

转换后的代码

```js
"use strict";

require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.set.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
var a = new Set();
```

这里有几个注意点：

1. `Set` 添加在全局作用域里
2. 正如 [issues-16149](https://github.com/babel/babel/issues/16149#issuecomment-1838489381) 里说的，当使用 `{ "useBuiltIns": "usage" }` 和 [`@babel/plugin-transform-runtime`](https://babeljs.io/docs/babel-plugin-transform-runtime)（`{ "helpers": true }`）时，[@babel/runtime](https://babeljs.io/docs/babel-runtime) 里面的 helper 函数没有被 polyfill，可能在旧的浏览器里出现问题。
3. 解决办法可以是使用 `{ "useBuiltIns": "entry" }` 、将 `@babel/runtime` 映射为 `@babel/runtime-corejs3` 或者转义 `@babel/runtime`。

### `@babel/plugin-transform-runtime`

[`@babel/plugin-transform-runtime`](https://babeljs.io/docs/babel-plugin-transform-runtime) 通过 `core-js` 选项也能添加 polyfills

首先使用 `@babel/runtime-corejs3` 替换 [@babel/runtime](https://babeljs.io/docs/babel-runtime)

```sh
$ npm install --save @babel/runtime-corejs3
```

配置文件

```js
{
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "helpers": true,
        "regenerator": true,
        "corejs": 3,
        "version": "^7.23.8"
      }
    ]
  ]
}
```

转换后的代码

```js
import _Set from "@babel/runtime-corejs3/core-js-stable/set";
const a = new _Set();
```

从 `@babel/runtime-corejs3` 引入 `_Set`，没有污染全局作用域

### 结论

综上所述目前有三种方式使用 polyfills

- 使用 [`@babel/preset-env`](https://babeljs.io/docs/babel-preset-env)，带有选项 `{ "useBuiltIns": "entry" }`
- 使用 [`@babel/preset-env`](https://babeljs.io/docs/babel-preset-env)，带有选项 `{ "useBuiltIns": "usage" }`
- 使用 [`@babel/plugin-transform-runtime`](https://babeljs.io/docs/babel-plugin-transform-runtime)，带有选项 `{ "corejs": 3 }`

前两者使用全局作用，多用于应用中。最后一项不使用全局作用域，多用于 library。

目前 Babel polyfills 的方案有下面的问题

- [`@babel/preset-env`](https://babeljs.io/docs/babel-preset-env) 没有办法不污染全局作用域
- 只能使用 [`core-js`](https://github.com/zloirock/core-js) 来提供 polyfills，虽然 [`core-js`](https://github.com/zloirock/core-js) 是一个很好的 polyfills，但它可能并不能满足所有用户的需求

所以 Babel 正打算推出全新的解决方案 [`babel-polyfills`](https://github.com/babel/babel-polyfills)，注意这不是原来的 `babel-polyfill` 或 `@babel/polyfill`

[`babel-polyfills`](https://github.com/babel/babel-polyfills) 提供三种接入 polyfill 的方式：`usage-pure`、 `usage-global`、`entry-global` 和多个 polyfill 库，比如 [`babel-plugin-polyfill-corejs3`](https://github.com/babel/babel-polyfills/blob/main/packages/babel-plugin-polyfill-corejs3)，甚至能自定义 polyfills。现在可以这样来使用 polyfills

```js
{
  "targets": { "firefox": 42 },
  "presets": ["@babel/preset-env"],
  "plugins": [
    ["polyfill-corejs3", {
      "method": "usage-global"
    }]
  ]
}
```

这个方案还没有最终确定，可能会有所改变

## References

- [`@babel/plugin-transform-runtime`](https://babeljs.io/docs/babel-plugin-transform-runtime) 
- [`@babel/plugin-transform-regenerator`](https://babeljs.io/docs/babel-plugin-transform-regenerator)
- [`@babel/preset-env`](https://babeljs.io/docs/babel-preset-env) 
- [`core-js`](https://github.com/zloirock/core-js)
- [`@babel/runtime`](https://babeljs.io/docs/babel-runtime)
- [`babel-polyfills`](https://github.com/babel/babel-polyfills/)
- [`babel-plugin-polyfill-corejs3`](https://github.com/babel/babel-polyfills/tree/main/packages/babel-plugin-polyfill-corejs3)
- [issues-16149](https://github.com/babel/babel/issues/16149)
- [issues-16260](https://github.com/babel/babel/issues/16260)

