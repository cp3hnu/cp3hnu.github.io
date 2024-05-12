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

| `flex-basis`                 | 元素的宽度                        | 参与 grow/shrink 的宽度          |
| ---------------------------- | --------------------------------- | -------------------------------- |
| 确定值（0, 10px, 30%）       | max(`flex-basis`, min-content^1^) | `flex-basis` 的值                |
| `auto` (`width` 也为 `auto`) | 等同于 `flex-basis: content`      | 等同于 `flex-basis: content`     |
| `auto` (`width` 为确定值)    | `width` 属性的值                  | `width `属性的值                 |
| `content`                    | content^2^                        | content^2^                       |
| `max-content`^3^             | 等同于 `flex-basis: content`      | 等同于 `flex-basis: content`     |
| `min-content`                | min-content^1^                    | min-content^1^                   |
| `fit-content`                | min(content^2^, flex 容器的宽度)  | min(content^2^, flex 容器的宽度) |

min-content^1^：元素的最小宽度。对于文本，表示其中最长单词的宽度，如果设置了 `word-break: break-all`，则是一个字母的宽度。详情请参考 [min-content](http://developer.mozilla.org/en-US/docs/Web/CSS/min-content)。

content^2^：元素不自动换行的宽度。

max-content^3^：感觉上等同于 `flex-basis: content`，暂时没有找到它们的区别，文档上也没有说明。

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
$$
ShrinkPercent = \frac{NegativeSpace}{(WidthF1 \times ShrF1)\,+\,...\,+\,(WidthFN \times ShrFN)}
$$
最终元素的宽度为：
$$
NewWidthN = WidthN - ShrinkPersent \times WidthN
$$



## References

[Understanding min-content, max-content, and fit-content in CSS](https://blog.logrocket.com/understanding-min-content-max-content-fit-content-css/)

