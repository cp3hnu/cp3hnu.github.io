---
pageClass: blog-page
title: Flex 布局
tags:
  - web
  - css
  - flex
date: 2024-02-22
author: cp3hnu
location: ChangSha
summary: 学习总结一下 Flex 布局。
---

# Flex 布局

今天我们来学习总结一下 Flex 布局

## `flex` 默认值和缺省值

[`flex`](https://developer.mozilla.org/en-US/docs/Web/CSS/flex) 是下面三个属性的简写：

- [`flex-grow`](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-grow)
- [`flex-shrink`](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-shrink)
- [`flex-basis`](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-basis)

它们的默认值为：`0 1 auto`，即 `initial`

但是如果在 `flex` 简写中某个属性没有指定时（比如 `flex: 1;`），使用他们的缺省值：`1 1 0%`

## `flex` 关键字

`flex` 定义了 3 个关键字：

- `flex: initial;` 等同于 `flex: 0 1 auto;`

- `flex: auto;` 等同于 `flex: 1 1 auto;`

- `flex: none;` 等同于 `flex: 0 0 auto;`

## `flex-basis`

Flex 布局最关键的是就是 `flex-basis`，`flex-basis` 确定 flex 元素的初始宽度（即放进 flex 容器之前的宽度），它的优先级高于 `width`（`flex-basis` 不是 `auto` ），即使  `width` 使用 `!important`。

`flex-basis` 的值分为以下几种：

| `flex-basis`                 | 元素的宽度                                 | 参与 grow/shrink 的宽度                   |
| ---------------------------- | ------------------------------------------ | ----------------------------------------- |
| 确定值（0, 10px, 30%）       | max(`flex-basis`, min-content<sup>1</sup>) | `flex-basis` 的值                         |
| `auto` (`width` 也为 `auto`) | 等同于 `flex-basis: content`               | 等同于 `flex-basis: content`              |
| `auto` (`width` 为确定值)    | `width` 属性的值                           | `width `属性的值                          |
| `content`                    | content<sup>2</sup>                        | content<sup>2</sup>                       |
| `max-content`<sup>3</sup>    | 等同于 `flex-basis: content`               | 等同于 `flex-basis: content`              |
| `min-content`                | min-content<sup>1</sup>                    | min-content<sup>1</sup>                   |
| `fit-content`                | min(content<sup>2</sup>, flex 容器的宽度)  | min(content<sup>2</sup>, flex 容器的宽度) |

[ 1 ] min-content：元素的最小宽度。对于文本，表示其中最长单词的宽度，如果设置了 `word-break: break-all`，则是一个字母的宽度。详情请参考 [`min-content`](http://developer.mozilla.org/en-US/docs/Web/CSS/min-content)。

[ 2 ] content：元素不自动换行的宽度。

[ 3 ] max-content：感觉上等同于 `flex-basis: content`，暂时没有找到它们的区别，文档上也没有说明。


## `flex-grow` 扩展公式

每个 grow 因子增长的宽度：
$$
GrowFactorWidth = \frac{RemainingSpace}{GrowF1\,+\,...\,+\,GrowFN}
$$
最终元素的宽度为
$$
NewWidthN = WidthN + GrowFN \times GrowFactorWidth
$$

## `flex-shrink` 缩减公式

缩减因子：
$$ShrinkPercent = \frac{NegativeSpace}{(WidthF1 \times ShrF1)\,+\,...\,+\,(WidthFN \times ShrFN)}$$
最终元素的宽度为：
$$
NewWidthN = WidthN - ShrinkPersent \times WidthN
$$



## 常见问题

### Flex 布局的子元素，设置了 `flex-shrink`，为什么没有收缩？

子元素的最小宽度是由内容决定的，比如设置了 `min-width` 或者一个很长的单词。为了解决这个问题，可以尝试设置 `min-width: 0`。

另一种种常见的情形是设置了 `white-space: nowrap`，子元素内部的文本没有被设置为换行，那么即使容器宽度不足，子元素也不会收缩。为了解决这个问题，也可以尝试设置 `min-width: 0`，或者设置 `overflow: auto` 或 `overflow: hidden`。

## References

- [Understanding min-content, max-content, and fit-content in CSS](https://blog.logrocket.com/understanding-min-content-max-content-fit-content-css/)



## VuePress 中使用数学公式

因为我的 Blog 是使用 VuePress 搭建的，一开始无法正确展示数学公式，查询资料得知需要这么配置

### 安装组件

数学公式插件 [markdown-it-katex](https://github.com/waylonflinn/markdown-it-katex)

```sh
$ npm install markdown-it-katex --save
```

### 添加配置

修改 `.vuepress/config.js` 下的配置

```js
module.exports = {
  head: [
    ['link', { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.css' }],
    ['link', { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.10.0/github-markdown.min.css" }]
  ],
  extendMarkdown(md) {
    md.set({ html: true });
    md.use(require("markdown-it-katex"));
  }
}
```

然后再部署，就可以正确展示数学公式了



