---
pageClass: blog-page
title: Scss and Less
tags: 
  - web
  - css
  - scss
  - less
date: 2022-09-24
author: cp3hnu
location: ChangSha
summary: Scss 和 Less 都是 CSS 的超集，都是对 CSS 的扩展，本文通过对比来学习 Scss 和 Less。
---

# Scss and Less

Scss 和 Less 都是 CSS 的超集，都是对 CSS 的扩展，本文通过对比来学习 Scss 和 Less。

## 变量 Variable

### Variable

Scss 和 Less 中都可以定义变量，只不过 Scss 使用 `$`，而 Less 使用 `@`。

**Scss**

```scss
$link-color: #428bca;
```

**Less**

```less
@link-color: #428bca;
```

### Variable Interpolation

Scss 和 Less 都支持选择符、CSS 属性名、字符串属性值、`import` 语句进行变量插值。

Scss 使用 `#{$variable}`，而 Less 使用 `@{variable}`。

**Scss**

Scss 的 [Interpolation](https://sass-lang.com/documentation/interpolation) 功能更加强大，非字符也可以进行插值，也支持函数插值 `#{func()}`。

Scss 的插值返回的都是 [unquoted strings](https://sass-lang.com/documentation/values/strings#unquoted)。

```scss
$my-selector: banner;
$my-property-name: font-size;
$my-property-value: 10;
$width: #{$my-property-value}px; // 10px，变量可以使用插值
$name: inline-#{unique-id()}; // 函数插值
$themes: dark;

.#{$my-selector} {
  width: "#{$my-property-value}px"; // 字符串插值，返回的是 quoted strings
  #{$my-property-name}: #{$my-property-value}px; // 非字符串也能插值，返回的是 unquoted strings
}
@import "#{$themes}/tidal-wave.less";
```

Compiled to:

```css
.banner {
  width: "10px";
  font-size: 10px;
}
@import "dark/tidal-wave.less";
```

**Less**

```less
@my-selector: banner;
@my-property-name: font-size;
@my-property-value: 10;
@themes: dark;

.@{my-selector} {
  @{my-property-name}: ~"@{my-property-value}px";
}
@import "@{themes}/tidal-wave.less";
```

Compiled to:

```css
.banner {
  font-size: 10px;
}
@import "dark/tidal-wave.less";
```

### Imperative VS Declarative

Less 在使用变量之前不需要先声明变量，如果**同一 scope 内**修改了变量值，则使用新的变量值；而 Scss 必须要先声明变量，且后面变量的修改不影响前面的值。可以理解为 Scss 的变量是 imperative （命令式），而 Less 的变量是 declarative（声明式）。

Less 的变量和 CSS 的变量 `var(--color)` 行为是一致的。

**Less**

```less
@var: 1;
.lazy-eval {
  width: @var; // 2
}
@var: 2;
```

**Scss**

```scss
$var: 1;
.lazy-eval {
  width: $var; // 1
}
$var: 2;
```

### 其它特性

#### Scss

##### Default Values

Scss 支持模块提供变量默认值（`!default`） 和导入模块时（`@user <url> with (<variable>: <value>)`）修改这些变量值，如果导入时没有修改变量值，则使用默认值生成 CSS。

```scss
// _library.scss
$black: #000 !default; // 导入时被修改
$border-radius: 0.25rem !default; // 导入时被修改
$box-shadow: 0 0.5rem 1rem rgba($black, 0.15) !default; // 使用这个默认值

code {
  border-radius: $border-radius;
  box-shadow: $box-shadow;
}

// style.scss
@use 'library' with (
  $black: #222,
  $border-radius: 0.1rem
);
```

##### Built-in Variables

Sccs 有一些[内置模块](https://sass-lang.com/documentation/modules)，我们可以使用这些内置模块定义的变量。

```scss
@use "sass:math" as math;

// This assignment will fail.
math.$pi: 0;
```

##### Advanced Variable Functions

- [`meta.variable-exists()`](https://sass-lang.com/documentation/modules/meta#variable-exists) 判断当前范围内是否存在某个变量。
- [`meta.global-variable-exists()`](https://sass-lang.com/documentation/modules/meta#global-variable-exists) 判断全局范围内是否存在某个变量。

#### Less

##### Variable Variables

Less 支持变量的变量 `@@`。

```less
@primary:  green;
@color: primary;

.section {
  color: @@color; // green 
}
```

##### Properties as Variables

Less 支持同一个选择器里的属性作为变量。

```less
.widget {
  color: #efefef;
  background-color: $color; // #efefef
}
```

## 层级嵌套

### Nesting

Scss 和 Less 都支持通过嵌套来表示父子层级关系。

```scss
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
}
```

Compiled to:

```css
nav ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
```

### Parent Selector

Scss 和 Less 都在嵌套的层级关系中使用 `&` 表示父选择器，注意 `&` 表示所有的父选择器。

> Scss 有一个限制：在使用组合选择器时，`&` 只能放在前面，比如这样是不行的 `span&`，而 `&span` 是可以的。

```scss
.alert {
  &:hover {
    font-weight: bold;
  }
  
  [dir=rtl] & {
    margin-left: 0;
    margin-right: 10px;
  }
  
  :not(&) {
    opacity: 0.8;
  }
}
```

Compiled to:

```css
.alert:hover {
  font-weight: bold;
}
[dir=rtl] .alert {
  margin-left: 0;
  margin-right: 10px;
}
:not(.alert) {
  opacity: 0.8;
}
```

### 其它特性

#### Scss

##### Property Prefix

Scss 可以使用嵌套添加属性前缀 `prefix: {}`，使用 `-` 进行拼接。

```scss
.enlarge {
  font-size: 14px;
  transition: {
    property: font-size;
    duration: 4s;
    delay: 2s;
  }
}
```

Compiled to:

```css
.enlarge {
  font-size: 14px;
  transition-property: font-size;
  transition-duration: 4s;
  transition-delay: 2s;
}
```

## 混合  Mixins

### Mixins

混合就是定义一个规则集，包含一组相关的规则，使用时复制规则集里的所有规则，以实现规则集共享。

Scss 和 Less 都支持混合，也都支持参数。

**Scss**

Scss 通过 `@mixin` 和 `@include` 指令定义和使用混合。混合支持参数，参数支持默认值，`$param: defaultValue。`

```scss
@mixin rtl($property, $ltr-value: left) {
  #{$property}: $ltr-value;
}

.sidebar {
  // 使用位置参数
  @include rtl(float, right);
 	// 使用命名参数
  // @include rtl($property: float, $ltr-value: right); 
}
```

Compiled to:

```css
.sidebar {
  float: right;
}
```

**Less**

Less 通过 `.mixin-name() {}` 定义混合，`()` 可以省略，省略时会生成类选择器规则到 CSS 文件。

通过 `.mixin-name()` 使用混合，`()` 也可以省略，但是建议带上，表示使用混合。

支持参数，参数支持默认值，`@param: defaultValue`。

```less
.my-mixin {
  color: black;
}
.my-other-mixin() {
  background: white;
}
.rtl(@property, @ltr-value: left) {
  @{property}: @ltr-value;
}

.sidebar {
  // 使用位置参数
  .rtl(float, left);
  // 使用命名参数
  // .rtl(@property: float, @ltr-value: left);
  .my-mixin();
  .my-other-mixin()
}
```

Compiled to:

```css
.my-mixin {
  color: black;
}
.sidebar {
  float: left;
  color: black;
  background: white;
}
```

### 其它特性

#### Scss

##### Taking Arbitrary Arguments

`@mixin` 中如果最后的参数带 `...` 结尾，即 `$params...`，表示 `params` 是个 list，类似于 JavaScript 函数中的最后的参数 `...params`。

```scss
@mixin order($height, $selectors...) {
  @for $i from 0 to length($selectors) {
    #{nth($selectors, $i + 1)} {
      position: absolute;
      height: $height;
      margin-top: $i * $height;
    }
  }
}

@include order(150px, "input.name", "input.address", "input.zip");
```

如果 `@include` 调用时使用参数名  `$param1: value1`，那么 `params` 是 map，可以使用 [`meta.keywords()`](https://sass-lang.com/documentation/modules/meta#keywords) 解析这个参数。

```scss
@use "sass:meta";

@mixin syntax-colors($args...) {
  @debug meta.keywords($args);
  // (string: #080, comment: #800, variable: #60b)

  @each $name, $color in meta.keywords($args) {
    pre span.stx-#{$name} {
      color: $color;
    }
  }
}

@include syntax-colors(
  $string: #080,
  $comment: #800,
  $variable: #60b,
)
```

`@include` 调用时也可以传入 `$values...`，表示传入参数列表，`$values` 可以是逗号分隔的 list（位置参数） 或者 map（命名参数）。

```scss
// list
$form-selectors: "input.name", "input.address", "input.zip";
// map
$form-selectors: (
  string: #080,
  comment: #800,
  variable: #60b,
)

@include order(150px, $form-selectors...);
```

##### Content Blocks

Scss 的 `@mixin` 还支持定义规则块，称为内容区 `@content`。

```scss
@mixin hover {
  border: 1px solid black;
  @content;
}

.button {
  @include hover {
    border-width: 2px;
  }
}
```

Compiled to:

```css
.button {
  border: 1px solid black;
  border-width: 2px;
}
```

`@content` 还能传递参数 `@include <name> using (<arguments...>)`，详情请参考 [Passing Arguments to Content Blocks](https://sass-lang.com/documentation/at-rules/mixin#passing-arguments-to-content-blocks)。

#### Less

##### Namespaces

Less 通过命名空间减少混合的冲突，`#namespace() {}`

```less
#outer() {
  .inner {
    color: red;
  }
}

.c {
  #outer.inner();
}
```

Less 的命名空间支持 [Guarded Namespaces](https://lesscss.org/features/#mixins-feature-guarded-namespaces)，用于匹配哪个命名空间生效。

##### The `!important` keyword

Less 在调用混合时使用 `!important` 关键字，将混合里所有的规则都标记为 `!important`。

##### Overloading mixins

Less 支持混合重载，下面的例子定义了 3 个重载的混合，调用时使用所有匹配的混合。

```less
.mixin(@color) { // 1
  color-1: @color;
}
.mixin(@color, @padding: 2) { // 2
  color-2: @color;
  padding-2: @padding;
}
.mixin(@color, @padding, @margin: 2) { // 3
  color-3: @color;
  padding-3: @padding;
  margin: @margin @margin @margin @margin;
}
.some {
  .mixin(#008000); // 匹配1和2
}
```

Compiled to:

```css
.some {
  color-1: #008000;
  color-2: #008000;
  padding-2: 2;
}
```

##### The `@arguments` and `@rest` Variable

Less 的混合里可以使用  `@arguments` 表示所有的参数，像 JavaScript 里的函数一样。

Less 的混合里可以使用  `@rest` 表示余下所有的参数，像 JavaScript 里的函数一样。

```less
.box-shadow(@x: 0, @rest...) {  
  box-shadow: @rest;
  rest: @rest;
}
.big-block {
  .box-shadow(2px, 5px, 1px, solid);
}
```

Compiled to:

```css
.big-block {
  box-shadow: 5px 1px solid;
  rest: 5px 1px solid;
}
```

##### Pattern-matching

Less 混合支持模式匹配

```scss
.mixin(dark, @color) { // 1
  color: darken(@color, 10%);
}
.mixin(light, @color) { // 2
  color: lighten(@color, 10%);
}
.mixin(@_, @color) { // 3
  display: block;
}

.class {
  .mixin(dark, #888); // 匹配1和3
}
```

##### 其它功能

- [Mixin Guards](https://lesscss.org/features/#mixins-feature-mixin-guards-feature)
- [Recursive Mixins](https://lesscss.org/features/#mixins-feature-loops-feature)
- [Aliasing Mixins](https://lesscss.org/features/#mixins-feature-mixin-aliasing-feature)

## 扩展 Extends

Scss 和 Less 都支持扩展，扩展就是样式继承。Scss 使用 `@extend` 指令，Less 使用 `:extend` 伪类。

**Scss**

```scss
.error {
  border: 1px #f00;
  background-color: #fdd;
}

.error--serious {
  @extend .error;
  border-width: 3px;
}
```

Compiled to:

```css
.error, .error--serious {
  border: 1px #f00;
  background-color: #fdd;
}
.error--serious {
  border-width: 3px;
}
```

Scss 的扩展比较智能也比较复杂，详情请参考 [How It Works](https://sass-lang.com/documentation/at-rules/extend#how-it-works)

```scss
.content nav.sidebar {
  @extend .info;
}

// This won't be extended, because `p` is incompatible with `nav`.
p.info {
  background-color: #dee9fc;
}

// There's no way to know whether `<div class="guide">` will be inside or
// outside `<div class="content">`, so Sass generates both to be safe.
.guide .info {
  border: 1px solid rgba(#000, 0.8);
  border-radius: 2px;
}

// Sass knows that every element matching "main.content" also matches ".content"
// and avoids generating unnecessary interleaved selectors.
main.content .info {
  font-size: 0.8em;
}
```

Compiled to:

```css
p.info {
  background-color: #dee9fc;
}

.guide .info, .guide .content nav.sidebar, .content .guide nav.sidebar {
  border: 1px solid rgba(0, 0, 0, 0.8);
  border-radius: 2px;
}

main.content .info, main.content nav.sidebar {
  font-size: 0.8em;
}
```

Scss 只支持简单的选择器，比如 `.info`，其它的（`.message.info`， `.main .info`）都不支持。

如果在 `@media` 下进行扩展，Scss 只能扩展同一个 `@media`  下的选择器。

**Less**

Less 的扩展采用精确匹配，例如下面只扩展 `.info ` 规则，其它的统统忽略，比如 `*.info`, `.info:hover`， `.info .a`。

因为

```less
nav ul {
  &:extend(.info);
  background: blue;
}
.info {
  color: red;
  &:hover {
    font-size: 12px;
  }
}
```

Compiled to:

```css
nav ul {
  background: blue;
}
.inline,
nav ul {
  color: red;
}
.info:hover {
  font-size: 12px;
}
```

Less 支持在被扩展选择器后面添加 `all` 关键字，扩展所有的包含被扩展选择器的规则，比如 `p.info`, `.info:hover`， `.info .a`。

```less
.content nav.sidebar {
  &:extend(.info all);
}

// 扩展成 p.content nav.sidebar
p.info {
  background-color: #dee9fc;
}

// 扩展成 .guide .content nav.sidebar
.guide .info {
  border: 1px solid rgba(#000, 0.8);
  border-radius: 2px;
}

// 扩展成 main.content .content nav.sidebar
main.content .info {
  font-size: 0.8em;
}

// 扩展成 .content nav.sidebar:hover
.info {
  &:hover {
  	font-size: 12px;
	}
}
```

Compiled to:

```css
p.info,
p.content nav.sidebar {
  background-color: #dee9fc;
}
.guide .info,
.guide .content nav.sidebar {
  border: 1px solid rgba(0, 0, 0, 0.8);
  border-radius: 2px;
}
main.content .info,
main.content .content nav.sidebar {
  font-size: 0.8em;
}
.info:hover,
.content nav.sidebar:hover {
  font-size: 12px;
}
```

### 其它特性

#### Scss

##### Placeholder Selectors

Scss 支持占位选择器，只用于扩展

```scss
%strong-alert {
  font-weight: bold;
  &:hover {
    color: red;
  }
}

.info {
  @extend %strong-alert;
}
```

Compiled to:

```css
.info {
  font-weight: bold;
}
.info:hover {
  color: red;
}
```

## 自定义函数 Custom Functions

### Custom Funtions

Scss 和 Less 都支持自定义函数。Scss 通过 `@function` 和 `@return` 指令定义函数，而 Less 通过 mixin 和 lookup 定义函数。

**Scss**

```scss
@function pow($base, $exponent) {
  $result: 1;
  @for $_ from 1 through $exponent {
    $result: $result * $base;
  }
  @return $result;
}

.sidebar {
  float: left;
  margin-left: pow(4, 3) * 1px; // 64px
}
```

和 mixin 一样参数支持默认值，支持 arbitrary arguments ( `$params...` ) ，调用函数时也和 mixin 一样支持传递 arbitrary arguments ( `$params...` )。

**Less**

```less
.average(@x, @y) {
  @result: ((@x + @y) / 2);
}

div {
  // call a mixin and look up its "@result" value
  padding: .average(16px, 50px)[@result]; // 33px
}
```

`@result` 不是必须的，任意 name 都可以，如果使用 `[]` ，里面不带 name，则返回最后属性的值，例如

```less
.average(@x, @y) {
  @result: ((@x + @y) / 2);
 	value: 10px;
}

div {
  padding: .average(16px, 50px)[]; // 10px, 相当于调用 .average(16px, 50px)[value];
}
```

## 内置模块/函数

### Built-In

**Scss**

Scss 定了很多的内置模块，详情请参考 [Built-In Modules](https://sass-lang.com/documentation/modules)。

**Less**

Less 定义了很多的内置函数，详情请参考 [Functions](https://lesscss.org/functions/)。

# References

- [Sass](https://sass-lang.com/documentation/)
- [Less](https://lesscss.org/features/)
- [Less-To-CSS Playground](http://lesscss.org/less-preview/#eyJjb2RlIjoiIiwiYWN0aXZlVmVyc2lvbiI6IjQuMS4zIn0=)
- [Sass Palyground](https://www.sassmeister.com/)
- [BEM](https://getbem.com/)
- [Sass中文网](https://www.sass.hk/docs/)

