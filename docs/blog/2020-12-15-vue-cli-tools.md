---
title: Vue-CLI 搭建 Web 框架配置工具
tags: 
  - vue-cli
  - webpack
  - web
date: 2020-12-15
author: cp3hnu
location: ChangSha
summary: 前段时间用 Vue-CLI@4 搭建了一个 admin 后台管理系统，对里面用到的配置工具进行总结。
---

# Vue-CLI 搭建 Web 框架配置工具

## [css-loader](https://github.com/webpack-contrib/css-loader)

`css-loader` interprets `@import` and `url()` like `import/require()` and will resolve them.

`css-loader` 解析 css 的 `@import` 和 `url()` ，就像 js 解析 `import/require()` 一样

```javascript
url(image.png) => require('./image.png')
@import 'style.css' => require('./style.css')
```

此外还支持 [CSS Modules](https://github.com/css-modules/css-modules)

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        loader: "css-loader",
        options: {
          modules: true,
        },
      },
    ],
  },
};
```

##  [style-loader](https://github.com/webpack-contrib/style-loader)

`style-loader` Inject CSS into the DOM, 即将 vue 文件里面的样式通过 `<style>` 标签注入到 HTML head.

```javascript
// style.css
body {
  background: green;
}

// components.js
import './style.css';

// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
```

## [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)

This plugin extracts CSS into separate files. It creates a CSS file per JS file which contains CSS.

即将 vue 文件里面的样式提取到单独的 css 文件

`development` 模式使用 `style-loader`

`production` 模式使用 `mini-css-extract-plugin`

## [file-loader](https://github.com/webpack-contrib/file-loader)

resolves `import`/`require()` on a file into a url and emits the file into the output directory.

```javascript
// file.js
import img from './file.png'

// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
};
```

## [url-loader](https://github.com/webpack-contrib/url-loader)

A loader for webpack which transforms files into base64 URIs.

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192, // Specifying the maximum size of a file in bytes.
            },
          },
        ],
      },
    ],
  },
};
```

Vue-CLI 通过 `file-loader` 用 **版本哈希值** 和正确的 **公共基础路径** 来决定最终的文件路径，再用 `url-loader` 将小于 4kb 的资源内联，以减少 HTTP 请求的数量。

```javascript
// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('images')
        .use('url-loader')
          .loader('url-loader')
          .tap(options => Object.assign(options, { limit: 4096 }))
  }
}
```

## [svg-sprite-loader](https://github.com/JetBrains/svg-sprite-loader#readme)

Webpack loader for creating SVG sprites.

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
            },
          },
        ],
      },
    ],
  },
};
```

## [Sass](https://github.com/sass/sass)

Sass is an extension of CSS, adding nested rules, variables, mixins, selector inheritance, and more.

是对 CSS 扩展，类似的还有 [less](http://lesscss.org/), [Stylus](https://stylus.bootcss.com/).

文档：[英文](https://sass-lang.com/)/[中文](https://www.sass.hk/guide/)

### [sass-loader](https://github.com/webpack-contrib/sass-loader)

```sh
npm install sass-loader sass -D
```

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
};
```

## [PostCSS](https://github.com/postcss/postcss)

A tool for transforming CSS with JavaScript. 

是一个用 JavaScript 工具和插件转换 CSS 代码的工具，有很多插件可供使用，例如：Autoprefixer, postcss-preset-env, stylelint。

### [postcss-loader](https://github.com/webpack-contrib/postcss-loader)

Loader to process CSS with `PostCSS`

```sh
npm install postcss-loader postcss -D
```

### [Autoprefixer](https://github.com/postcss/autoprefixer)

自动获取浏览器的流行度和能够支持的属性，并根据这些数据帮你自动为 CSS 规则添加前缀。

[Autoprefixer CSS online](https://autoprefixer.github.io/)

### [postcss-preset-env](https://github.com/csstools/postcss-preset-env)

使用新的 CSS 语法，[官网](https://preset-env.cssdb.org/)

### [stylelint](https://github.com/stylelint/stylelint)

一个现代化 CSS 代码检查工具，[官网](https://stylelint.io/)

## [browserslist](https://github.com/browserslist/browserslist)

The config to share target browsers and Node.js versions between different front-end tools.

```json
"browserslist": [
  "> 1%",
  "last 2 versions",
  "not dead"
]
```

```sh
## Check what browsers will be selected by some query
npx browserslist "last 1 version, >1%"

## In your project directory to see project’s target browsers
npx browserslist
```

## [Can I Use](https://caniuse.com/)

查看哪些浏览器支持某些特性

## [CSS Modules](https://github.com/css-modules/css-modules)

[CSS Modules 用法教程](http://www.ruanyifeng.com/blog/2016/06/css_modules.html)

加入了局部作用域和模块依赖。

CSS Modules 必须通过向 `css-loader` 传入 `modules: true` 来开启，默认是如果文件名匹配 `/\.module\.\w+$/i`, 则开启

```css
<style module>
.red {
  color: red;
}
.bold {
  font-weight: bold;
}
</style>
```

Vue 模板可以使用 `<scoped>`

## [style-resources-loader](https://github.com/yenshih/style-resources-loader)

This loader is a CSS processor resources loader for webpack, which injects your style resources (e.g. `variables, mixins`) into multiple imported `css, sass, scss, less, stylus` modules.

It's mainly used to

-   share your `variables, mixins, functions` across all style files, so you don't need to `@import` them manually.
-   override `variables` in style files provided by other libraries (e.g. [ant-design](https://github.com/ant-design/ant-design)) and customize your own theme.

```javascript
module.exports = {
  chainWebpack: config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('stylus').oneOf(type)))
  },
}

function addStyleResource (rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/styles/imports.styl'),
      ],
    })
}
```

也可以使用 [vue-cli-plugin-style-resources-loader](https://github.com/nguyenvanduocit/vue-cli-plugin-style-resources-loader/#readme)

Sass 也可以使用 [sass-resources-loader](#sass-resources-loader)

## [webpack-chain](https://github.com/neutrinojs/webpack-chain)

使用一个链式 API 来生成和简化 `webpack` 的配置的修改。

## [Babel](https://babeljs.io/)

是一个 JavaScript 编译器，能让你使用最新的 JavaScript 语法。

### [@babel/core](https://babeljs.io/docs/en/babel-core)

The core functionality of Babel.

### [@babel/cli](https://babeljs.io/docs/en/babel-cli) 

A tool that allows you to use babel from the terminal.

### [@babel/polyfill](https://babeljs.io/docs/en/babel-polyfill)

Babel includes a **polyfill** that includes a custom [regenerator runtime](https://github.com/facebook/regenerator/blob/master/packages/regenerator-runtime/runtime.js) and [core-js](https://github.com/zloirock/core-js).

**Deprecated**

使用 `core-js/stable` (to polyfill ECMAScript features) and `regenerator-runtime/runtime` (needed to use transpiled generator functions)

### [core-js](https://github.com/zloirock/core-js#readme)

Modular standard library for JavaScript. Includes polyfills for [ECMAScript up to 2021](https://github.com/zloirock/core-js#ecmascript): [promises](https://github.com/zloirock/core-js#ecmascript-promise), [symbols](https://github.com/zloirock/core-js#ecmascript-symbol), [collections](https://github.com/zloirock/core-js#ecmascript-collections), iterators, [typed arrays](https://github.com/zloirock/core-js#ecmascript-typed-arrays), many other features, [ECMAScript proposals](https://github.com/zloirock/core-js#ecmascript-proposals), [some cross-platform WHATWG / W3C features and proposals](https://github.com/zloirock/core-js#web-standards) like [`URL`](https://github.com/zloirock/core-js#url-and-urlsearchparams). You can load only required features or use it without global namespace pollution.

### [regenerator](https://github.com/facebook/regenerator/blob/master/packages/regenerator-runtime/runtime.js)

This package implements a fully-functional source transformation that takes the syntax for generators/`yield` from [ECMAScript 2015 or ES2015](http://www.ecma-international.org/ecma-262/6.0/) and [Asynchronous Iteration](https://github.com/tc39/proposal-async-iteration) proposal and spits out efficient JS-of-today (ES5) that behaves the same way.

### [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env.html)

`preset` is pre-determined set of plugins.

```json
{
  "presets": [
    [
      "@babel/env",
      {
        "targets": {
          "edge": "17",
          "firefox": "60",
          "chrome": "67",
          "safari": "11.1",
        },
        "useBuiltIns": "usage",
      }
    ]
  ]
}
```

`"useBuiltIns: usage"` will only include the polyfills you need.

### [Stage 0,1,2,3,4](https://segmentfault.com/a/1190000010074709)

0.  Strawman：任何尚未提交为正式提案的讨论、想法、改变或对已有规范的补充建议
1.  Proposal：升级为正式化的提案
2.  Draft：有了初始的规范，此阶段通过 `polyfill`，开发者可以开始使用这一阶段的草案了，一些浏览器引擎也会逐步对这一阶段的规范的提供原生支持，此外通过使用构建工具也可以编译源代码为现有引擎可以执行的代码，这些方法都使得这一阶段的草案可以开始使用了
3.  Candidate：候选推荐规范，这一阶段之后变化就不会那么大了
4.  Finished：将包含在 ECMAScript 的下一个修订版中

## [@vue/cli-plugin-babel](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel)

Uses Babel 7 + [babel-loader](https://github.com/babel/babel-loader) + [@vue/babel-preset-app](https://github.com/vuejs/vue-cli/tree/dev/packages/@vue/babel-preset-app#readme) by default, but can be configured via `babel.config.js` to use any other Babel presets or plugins.

`@vue/babel-preset-app`，通过 [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env.html) 和 [browserslist](https://github.com/browserslist/browserslist) 配置来决定项目需要的 [polyfill](https://babeljs.io/docs/en/babel-polyfill/)

## [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)

根据模板生成 index.html 文件

### minify

If the `minify` option is set to `true` (the default when webpack's `mode` is `'production'`), the generated HTML will be minified using [html-minifier-terser](https://github.com/terser/html-minifier-terser) and the following options:

```
{
  collapseWhitespace: true,
  keepClosingSlash: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true
}
```

## [html-minifier-terser](https://github.com/terser/html-minifier-terser)

HTML minifier. 为了能压缩模板 index.html 里自己写的 `<style>` (例如自定义开机 loading)，需要配置 `minifyCSS: true`

```javascript
config.plugin('html')
  .tap(args => {
  	args[0].minify = {
      collapseWhitespace: true,
      keepClosingSlash: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      minifyCSS: true // here
    }
    return args
})
```

## [script-ext-html-webpack-plugin](https://github.com/numical/script-ext-html-webpack-plugin)

This is an extension plugin for the [webpack](http://webpack.github.io/) plugin [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)

This plugin simplifies the creation of HTML files to serve your webpack bundles.

比如 inline runtime 模块

```javascript
config
  .plugin('ScriptExtHtmlWebpackPlugin')
  .after('html')
  .use('script-ext-html-webpack-plugin', [{
    // 匹配 runtimeChunk name. 格式 "runtime.hash.js"
    inline: /runtime\..*\.js$/
  }])
  .end()
```

## [style-ext-html-webpack-plugin](https://github.com/numical/style-ext-html-webpack-plugin)

This extension plugin builds on this by moving the CSS content generated by the extract plugins from an external CSS file to an internal `<style>` element.

## [DefinePlugin](https://www.webpackjs.com/plugins/define-plugin/)

创建一个在**编译**时可以配置的全局常量，Vue CLI 其实就是使用这个定义 [环境变量](https://cli.vuejs.org/zh/guide/mode-and-env.html#%E6%A8%A1%E5%BC%8F)

## [compression-webpack-plugin](https://github.com/webpack-contrib/compression-webpack-plugin)

gzip 压缩

一般 `nginx` 服务器配置会开启 `gzip`，所以前端一般不需要压缩。

## [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)

Visualize size of webpack output files with an interactive zoomable treemap.

Vue-CLI 内置 bundle analyzer

```javascript
"scripts": {
  "report": "vue-cli-service build --report",
}
```

## [babel-plugin-dynamic-import-node](https://github.com/airbnb/babel-plugin-dynamic-import-node)

Babel plugin to transpile `import()` to a deferred `require()`, for node

[有何用处？](https://panjiachen.github.io/vue-element-admin-site/guide/advanced/lazy-loading.html)

## [sass-resources-loader](https://github.com/shakacode/sass-resources-loader)

Load your SASS resources into every **required** SASS module. So you can use your shared variables, mixins and functions across all SASS styles without manually loading them in each file.

```javascript
// vue.config.js
const oneOfsMap = config.module.rule('scss').oneOfs.store
oneOfsMap.forEach(item => {
  item
    .use('sass-resources-loader')
    .loader('sass-resources-loader')
    .options({
      // Provide path to the file with resources
      resources: resolve('src/styles/variables.scss'),
    })
    .end()
})
```

## [lint-staged](https://github.com/okonet/lint-staged#readme)

提交代码前进行 lint 检查。

`@vue/cli-service` 也会安装 [yorkie](https://github.com/yyx990803/yorkie)，它会让你在 `package.json` 的 `gitHooks` 字段中方便地指定 Git hook：

> `yorkie` fork 自 [`husky`](https://github.com/typicode/husky) 并且与后者不兼容。

```json
"gitHooks": {
  "pre-commit": "lint-staged"
},
"lint-staged": {
  "src/**/*.{js,vue}": [
    "vue-cli-service lint",
    "prettier --write"
  ]
}
```

## [HashedModuleIdsPlugin](https://webpack.js.org/plugins/hashed-module-ids-plugin/)

固定住 Module Id, 参考[手摸手，带你用合理的姿势使用webpack4（下）](https://juejin.cn/post/6844903652956585992#heading-6)

## [NamedModulesPlugin](https://webpack-v3.jsx.app/plugins/named-modules-plugin/)

`NamedModulesPlugin` 和 `HashedModuleIdsPlugin` 原理是相同的，将文件路径作为 Module Id, 用于开发环境。

## NamedChunksPlugin

固定住 Chuck Id, 参考[手摸手，带你用合理的姿势使用webpack4（下）](https://juejin.cn/post/6844903652956585992#heading-6)

## [ESLint](https://github.com/eslint/eslint)

代码格式校验

### [@vue/cli-plugin-eslint](https://github.com/vuejs/vue-cli/tree/dev/packages/@vue/cli-plugin-eslint#readme)

ESLint plugin for vue-cli. Inject `vue-cli-service lint` command and install `eslint` and [eslint-plugin-vue](https://eslint.vuejs.org/).

Lints and fixes files.

### [eslint-plugin-vue](https://eslint.vuejs.org/)

Official ESLint plugin for Vue.js. 

This plugin allows us to check the `<template>` and `<script>` of `.vue` files with ESLint, as well as Vue code in `.js` files.

-   Finds syntax errors.
-   Finds the wrong use of Vue.js Directives
-   Finds the violation for Vue.js Style Guide

三个分类

1.  必要 `plugin:vue/essential`
2.  强烈推荐  `plugin:vue/strongly-recommended`
3.  推荐  `plugin:vue/recommended`

### [babel-eslint](https://github.com/babel/babel-eslint)

Allows you to lint all valid Babel code with the fantastic [ESLint](https://github.com/eslint/eslint).

babel-eslint is now `@babel/eslint-parser`

### Vue CLI 的配置

```javascript
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/essential",  // eslint-plugin-vue
    "eslint:recommended",    // eslint
    "@vue/prettier"          // @vue/eslint-config-prettier
  ],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off"
  }
};
```

## [prettier](https://github.com/prettier/prettier)

代码格式化。另一个是 [js-beautify](https://github.com/beautify-web/js-beautify).

[官网](https://prettier.io/)

### 安装

```sh
npm install --save-dev --save-exact prettier
```

可以设置 `webstorm` 用 `prettier` 格式化代码，setting 里面搜索 `pretter`.

### [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier#readme)

Runs [Prettier](https://github.com/prettier/prettier) as an [ESLint](http://eslint.org/) rule and reports differences as individual ESLint issues.

### [@vue/eslint-config-prettier](https://github.com/vuejs/eslint-config-prettier)

Turns off all rules that are unnecessary or might conflict with [Prettier](https://prettier.io/).

是用于 Vue CLI 的 [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)

### 问题

`prettier` 相对于我的习惯来说有以下几个问题，可以持续关注一下 `prettier` 的更新

1. 设置 `"jsxBracketSameLine": true`, 对 vue template 不起作用
2. 对象数组导致行数太多
3. then() 希望能换到新的一行去
4. 需要注意，因为设置了 `"htmlWhitespaceSensitivity": "ignore"`, 可能导致 html 显示错误，这个时候就需要 `<!-- prettier-ignore -->`

## [Mock](https://github.com/nuysoft/Mock)

postman, YAPI 和微信小程序有支持 Mock 的功能

难道没有好用的 Mock 服务网站?