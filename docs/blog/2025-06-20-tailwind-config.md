---
pageClass: blog-page
title: Tailwind CSS 自定义
tags:
  - web
  - css
  - tailwind
date: 2025-06-20
author: cp3hnu
location: ChangSha
summary: 学习怎么在实际项目中配置 Tailwind CSS。
---

# Tailwind CSS 自定义

上篇文章 [Learn Tailwind CSS](/2025/06/12/tailwind-css) 我们学习了 Tailwind CSS，这篇文章我们将学习怎么在实际项目中配置 Tailwind CSS。

## 自定义主题

### 修改默认的主题变量

Tailwind CSS 有一套 [默认的主题变量 ](https://tailwindcss.com/docs/theme#default-theme-variable-reference)供功能类使用。比如

```css
--color-black: #000;
--text-base: 1rem;
```

而 Tailwind CSS 的实用类会使用这些主题变量，比如

```css
.text-black {
  color: var(--color-black);
}

.text-base {
  font-size: var(--text-base);
}
```

如果我们想 `.text-black` 的颜色为 `#0c0d0e`，而 `.text-base` 的字体大小为 `16px` 时，可以修改 Tailwind CSS 默认的主题变量

```css
@theme {
  --color-black: #0c0d0e;
  --text-base: 16px;
}

/* 也可以使用 :root */
:root {
  --color-black: #0c0d0e;
  --text-base: 16px;
}
```

**但是需要注意的是：**修改 Tailwind CSS 主题变量（`--color-black`），不是只修改了一个功能类（`.text-black`），而是修改了整个系统的主题，因为还有很多的功能类，比如 `.bg-black` 也是依赖  `--color-black` 变量。

```css
.bg-black {
  background-color: var(--color-black);
}
```

这些功能类一起组成了整个系统的主题，修改 `--color-black` 为 `#0c0d0e;` 意味着系统的黑色变成了 ` #0c0d0e`。

### 添加主题变量

我们也可以添加自己的主题变量，比如我们以前最喜欢用 `primary-color` 表示系统的主题色，这个 Tailwind CSS 是没有的，我们可以自定义，还是使用 `@theme` 指令

```css
@theme {
  --color-primary: #514cf9;
}
```

在添加主题变量的同时，Tailwind CSS 会生成新的功能类，比如 `text-primary`、`bg-primary`、`fill-primary` 等。但是这样的主题变量命名是有要求的，并不是任意添加的主题变量都会生成功能类，它们必须遵守 [Theme variable namespaces](https://tailwindcss.com/docs/theme#theme-variable-namespaces)。

```react
<p className="text-primary text-base">
  React + Tailwind CSS
</p>
```

## 自定义 Breakpoints

Tailwind CSS 有一套 [默认的 Breakpoints](https://tailwindcss.com/docs/theme#default-theme-variable-reference)

```css
--breakpoint-sm: 40rem;
--breakpoint-md: 48rem;
--breakpoint-lg: 64rem;
--breakpoint-xl: 80rem;
--breakpoint-2xl: 96rem;
```

对应 `16px` 它们分别是

```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

功能类可以使用这些 breakpoints

```css
<div class="grid xs:grid-cols-2 2xl:grid-cols-6">
  <!-- ... -->
</div>
```

Tailwind CSS  这套 breakpoints 是为了适配手机端和 PC 端，如果我们的系统只运行在 PC 端，同时要求适配更大的屏幕时，这套 breakpoints 并不适用。我们可以像 [自定义主题 ](#自定义主题) 一样修改和新增 Tailwind CSS  的 breakpoints。

```css
@theme {
  --breakpoint-3xl: 112rem;
  --breakpoint-4xl: 128rem;
}
```

这里我添加了两个 breakpoints，Tailwind CSS 将自动生成相应的功能类 `3xl`、`4xl`。

```react
<div class="grid grid-cols-2 3xl:grid-cols-3 4xl:grid-cols-4">
  <!-- ... -->
</div>
```

## 自定义功能类

如果发现在重复使用相同的 arbitrary values，我们也可以使用 `@utility` 指令自定义功能类

### 简单功能类

比如设置 `color` 为  `#1664ff`：

```css
@utility primary-color {
  color: #1664ff;
}
```

然后我们就可以使用 `primary-color` 功能类了

```html
<div class="primary-color">
  <!-- ... -->
</div>
```

也支持一些复杂的样式，比如嵌套：

```css
@utility scrollbar-hidden {
  &::-webkit-scrollbar {
    display: none;
  }
}
```

### 命名空间功能类

如果想和 Tailwind CSS 的功能类一样支持多种写法，可以使用 `--value()` 函数

```css
@theme {
  --tab-size-github: 8;
}
@utility tab-* {
  tab-size: --value(--tab-size-*); /* tab-github */
  tab-size: --value(integer); /* tab-任意数字 */
  tab-size: --value('inherit', 'initial', 'unset'); /* tab-inherit、tab-initial、tab-unset */
  tab-size: --value([integer]); /* tab-[任意数字] */
}
```

同时使用这四种方式时，要求名称不能冲突。比如不要设置 `--tab-size-2` 的主题变量，不然方式 1 和方式 2 冲突了，导致 `tab-2` 有两个 `tab-size` 属性。

```css
.tab-2 {
  tab-size: var(--tab-size-2);
  tab-size: 2;
}
```

`--value()` 函数也可以接受多个参数，并从左到右依次解析它们，同样要求功能类的名称不冲突。

```css
@theme {
  --tab-size-github: 8;
}
@utility tab-* {
  tab-size: --value(--tab-size-*, 'inherit', 'initial', 'unset', integer, [integer]);
}
```

自定义功能类也支持负值，但是必须和正值分开定义

```css
@utility inset-* {
  inset: calc(var(--spacing) * --value([percentage], [length]));
}

@utility -inset-* {
  inset: calc(var(--spacing) * --value([percentage], [length]) * -1);
}
```

## 自定义变体

我们可以通过 `@custom-variant` 指令自定义变体，比如创建常用的 `@supports` 快捷方式

```css
@import "tailwindcss";
@custom-variant supports-grid {
  @supports (display: grid) {
    @slot;
  }
}
```

```html
<div class="supports-grid:grid">
  <!-- ... -->
</div>
```

```css
.supports-grid\:grid {
  @supports (display: grid) {
    display: grid;
  }
}
```

再比如，创建常用的 data 属性快捷方式

```css
@import "tailwindcss";
@custom-variant data-checked (&[data-ui~="checked"]);
```

```html
<div data-ui="checked active" class="data-checked:underline">
  <!-- ... -->
</div>
```

```css
.data-checked\:underline {
  &[data-ui~="checked"] {
    text-decoration-line: underline;
  }
}
```

## 自定义类

如果发现自己重复地写同样的一套  Tailwind CSS 的功能类，可以自定义类。使用 `@apply` 指令，组合使用 Tailwind CSS 的功能类。比如下面的表单样式

```css
@layer components {
  .input-base {
    @apply mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm 
            focus:outline-none focus:ring-indigo-500 focus:border-indigo-500;
  }
}
```

## References

- [Tailwind CSS](https://tailwindcss.com/)
- [Theme variables](https://tailwindcss.com/docs/theme#default-theme-variable-reference)
- [Functions and directives](https://tailwindcss.com/docs/functions-and-directives)
- [Using custom breakpoints](https://tailwindcss.com/docs/responsive-design#using-custom-breakpoints)
- [Adding custom styles](https://tailwindcss.com/docs/adding-custom-styles)
