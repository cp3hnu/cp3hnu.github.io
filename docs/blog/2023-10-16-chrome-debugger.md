---
pageClass: blog-page
title: Chrome 调试技巧
tags:
  - web
  - chrome
  - debugger
date: 2023-10-16
author: cp3hnu
location: ChangSha
summary: 本篇文章总结一下 Chrome 的一些调试技巧
---

# Chrome 调试技巧

## 生产环境调试

首先开启 Sources -> Enable Local Overrides

![](./assets/chrome-debugger-overrides.png)

然后保存文件到本地

![](./assets/chrome-debugger-override-content.png)

这样就可以修改本地文件，然后进行调试了

# 条件断点

条件断点（Conditional Breakpoints）允许你定义表达式，表达式求值为 `true` 时中断。

<img src="./assets/chrome-debugger-conditional-breakpoint.gif" style="zoom:67%;" />

## 日志断点

日志断点（Log Points）让你方便地输出日志到控制台

![](./assets/chrome-debugger-log-point.png)

## Hover 状态检查元素

1. 进入 `Sources` 页签
2. 显示检查的元素
3. 使用快捷键 `comand + \` 或者 `F8`

<img src="./assets/chrome-debugger-hover.png" style="zoom:67%;" />



## References

- [Chrome DevTools](https://developer.chrome.com/docs/devtools/javascript/breakpoints/)

- [Chrome Developer Tools](https://blittle.github.io/chrome-dev-tools/)
