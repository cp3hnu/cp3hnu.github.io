(window.webpackJsonp=window.webpackJsonp||[]).push([[59],{267:function(e,t,r){e.exports=r.p+"assets/img/vite-project-esbuild.70fb2731.png"},455:function(e,t,r){"use strict";r.r(t);var n=r(4),a=Object(n.a)({},(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[n("h1",{attrs:{id:"使用-vite-搭建-web-项目"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#使用-vite-搭建-web-项目"}},[e._v("#")]),e._v(" 使用 Vite 搭建 Web 项目")]),e._v(" "),n("p",[n("a",{attrs:{href:"https://cn.vitejs.dev/",target:"_blank",rel:"noopener noreferrer"}},[e._v("Vite"),n("OutboundLink")],1),e._v(" 是 Vue 团队最新推出的新型前端构建工具，能够显著提升前端开发体验。它主要由两部分组成：")]),e._v(" "),n("ul",[n("li",[e._v("一个开发服务器，它基于 "),n("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules",target:"_blank",rel:"noopener noreferrer"}},[e._v("原生 ES 模块"),n("OutboundLink")],1),e._v(" 提供了 "),n("a",{attrs:{href:"https://cn.vitejs.dev/guide/features.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("丰富的内建功能"),n("OutboundLink")],1),e._v("，如速度快到惊人的 "),n("a",{attrs:{href:"https://cn.vitejs.dev/guide/features.html#hot-module-replacement",target:"_blank",rel:"noopener noreferrer"}},[e._v("模块热更新（HMR）"),n("OutboundLink")],1),e._v("。")]),e._v(" "),n("li",[e._v("一套构建指令，它使用 "),n("a",{attrs:{href:"https://rollupjs.org/",target:"_blank",rel:"noopener noreferrer"}},[e._v("Rollup"),n("OutboundLink")],1),e._v(" 打包你的代码，并且它是预配置的，可输出用于生产环境的高度优化过的静态资源。")])]),e._v(" "),n("p",[e._v("想要了解更多详情请看 "),n("a",{attrs:{href:"https://cn.vitejs.dev/",target:"_blank",rel:"noopener noreferrer"}},[e._v("Vite官网"),n("OutboundLink")],1)]),e._v(" "),n("p",[e._v("Vite 给我的直观感受就是开发时的快速构建，它使用了 "),n("a",{attrs:{href:"https://esbuild.github.io/",target:"_blank",rel:"noopener noreferrer"}},[e._v("esbuild"),n("OutboundLink")],1),e._v(" "),n("a",{attrs:{href:"https://cn.vitejs.dev/guide/dep-pre-bundling.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("预构建依赖"),n("OutboundLink")],1),e._v("，因此比 "),n("a",{attrs:{href:"https://webpack.js.org/",target:"_blank",rel:"noopener noreferrer"}},[e._v("webpack"),n("OutboundLink")],1),e._v(" 快很多很多。")]),e._v(" "),n("p",[e._v("下面是从 "),n("a",{attrs:{href:"https://esbuild.github.io/",target:"_blank",rel:"noopener noreferrer"}},[e._v("esbuild官网"),n("OutboundLink")],1),e._v(" 上截取的图")]),e._v(" "),n("p",[n("img",{attrs:{src:r(267),alt:""}})]),e._v(" "),n("p",[e._v("Vite 和 Vue-CLI 都是 Vue 团队开发的，只是 Vite 使用 esbuild + Rollup，而 Vue-CLI 使用 webpack。因此里面的很多配置是相似的，比如说 "),n("a",{attrs:{href:"https://cn.vitejs.dev/guide/env-and-mode.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("环境变量和模式"),n("OutboundLink")],1),e._v("。我之前也写过一篇 "),n("a",{attrs:{href:"./2020-12-15-vue-cli-tools"}},[e._v("Vue-CLI 搭建 Web 框架配置工具")]),e._v("，里面很多的工具也适用于 Vite 工程， 大家有兴趣可以去看看。")]),e._v(" "),n("h2",{attrs:{id:"创建项目"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#创建项目"}},[e._v("#")]),e._v(" 创建项目")]),e._v(" "),n("p",[e._v("未完待续...")]),e._v(" "),n("h2",{attrs:{id:"工具集"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#工具集"}},[e._v("#")]),e._v(" 工具集")]),e._v(" "),n("h3",{attrs:{id:"vitejs-plugin-vue"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#vitejs-plugin-vue"}},[e._v("#")]),e._v(" @vitejs/plugin-vue")]),e._v(" "),n("p",[e._v("Vue 3 单文件组件支持："),n("a",{attrs:{href:"https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue",target:"_blank",rel:"noopener noreferrer"}},[e._v("@vitejs/plugin-vue"),n("OutboundLink")],1)]),e._v(" "),n("p",[e._v("Vue 3 JSX 支持："),n("a",{attrs:{href:"https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx",target:"_blank",rel:"noopener noreferrer"}},[e._v("@vitejs/plugin-vue-jsx"),n("OutboundLink")],1)]),e._v(" "),n("h3",{attrs:{id:"vitejs-plugin-legacy"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#vitejs-plugin-legacy"}},[e._v("#")]),e._v(" @vitejs/plugin-legacy")]),e._v(" "),n("p",[n("a",{attrs:{href:"https://github.com/vitejs/vite/tree/main/packages/plugin-legacy#vitejsplugin-legacy-",target:"_blank",rel:"noopener noreferrer"}},[e._v("@vitejs/plugin-legacy"),n("OutboundLink")],1),e._v(" 为打包后的文件提供传统浏览器兼容性支持。")]),e._v(" "),n("h3",{attrs:{id:"vite-plugin-checker"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#vite-plugin-checker"}},[e._v("#")]),e._v(" vite-plugin-checker")]),e._v(" "),n("p",[n("a",{attrs:{href:"https://github.com/fi3ework/vite-plugin-checker",target:"_blank",rel:"noopener noreferrer"}},[e._v("vite-plugin-checker"),n("OutboundLink")],1),e._v("，是一个 Vite 插件，可以在工作线程中运行 TypeScript, VLS, vue-tsc, ESLint, Stylelint。")]),e._v(" "),n("h3",{attrs:{id:"fast-glob"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#fast-glob"}},[e._v("#")]),e._v(" fast-glob")]),e._v(" "),n("p",[n("a",{attrs:{href:"https://github.com/mrmlnc/fast-glob",target:"_blank",rel:"noopener noreferrer"}},[e._v("fast-glob"),n("OutboundLink")],1),e._v(" 提供了遍历文件系统和返回路径名的方法。作用类似于 Webpack 的 "),n("a",{attrs:{href:"https://webpack.js.org/guides/dependency-management/#requirecontext",target:"_blank",rel:"noopener noreferrer"}},[e._v("require.context"),n("OutboundLink")],1),e._v("。")]),e._v(" "),n("h3",{attrs:{id:"rollup-plugin-visualizer"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#rollup-plugin-visualizer"}},[e._v("#")]),e._v(" rollup-plugin-visualizer")]),e._v(" "),n("p",[n("a",{attrs:{href:"https://github.com/btd/rollup-plugin-visualizer",target:"_blank",rel:"noopener noreferrer"}},[e._v("rollup-plugin-visualizer"),n("OutboundLink")],1),e._v(" 分析 rollup bundle，类似于 "),n("a",{attrs:{href:"https://github.com/webpack-contrib/webpack-bundle-analyzer",target:"_blank",rel:"noopener noreferrer"}},[e._v("webpack-bundle-analyzer"),n("OutboundLink")],1),e._v("。")]),e._v(" "),n("h3",{attrs:{id:"rollup-plugin-commonjs"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#rollup-plugin-commonjs"}},[e._v("#")]),e._v(" @rollup/plugin-commonjs")]),e._v(" "),n("p",[n("a",{attrs:{href:"https://github.com/rollup/plugins/tree/master/packages/commonjs#rollupplugin-commonjs",target:"_blank",rel:"noopener noreferrer"}},[e._v("@rollup/plugin-commonjs"),n("OutboundLink")],1),e._v(" 是一个Rollup 插件，用于将 CommonJS 模块转换为 ES 模块。")]),e._v(" "),n("h3",{attrs:{id:"dotenv"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#dotenv"}},[e._v("#")]),e._v(" dotenv")]),e._v(" "),n("p",[n("a",{attrs:{href:"https://github.com/motdotla/dotenv",target:"_blank",rel:"noopener noreferrer"}},[e._v("dotenv"),n("OutboundLink")],1),e._v(" 是一个零依赖模块，它将环境变量从 "),n("code",[e._v(".env")]),e._v(" 文件加载到 "),n("a",{attrs:{href:"https://nodejs.org/docs/latest/api/process.html#process_process_env",target:"_blank",rel:"noopener noreferrer"}},[n("code",[e._v("process.env")]),n("OutboundLink")],1),e._v(" 中。")]),e._v(" "),n("h3",{attrs:{id:"dotenv-expand"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#dotenv-expand"}},[e._v("#")]),e._v(" dotenv-expand")]),e._v(" "),n("p",[n("a",{attrs:{href:"https://github.com/motdotla/dotenv-expand",target:"_blank",rel:"noopener noreferrer"}},[e._v("dotenv-expand"),n("OutboundLink")],1),e._v(" 在 "),n("a",{attrs:{href:"https://github.com/motdotla/dotenv",target:"_blank",rel:"noopener noreferrer"}},[e._v("dotenv"),n("OutboundLink")],1),e._v(" 的基础上增加了变量扩展。")]),e._v(" "),n("h2",{attrs:{id:"references"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#references"}},[e._v("#")]),e._v(" References")]),e._v(" "),n("ul",[n("li",[n("a",{attrs:{href:"https://www.jianshu.com/p/c894ea00dfec",target:"_blank",rel:"noopener noreferrer"}},[e._v("使用require.context实现前端工程自动化"),n("OutboundLink")],1)])])])}),[],!1,null,null,null);t.default=a.exports}}]);