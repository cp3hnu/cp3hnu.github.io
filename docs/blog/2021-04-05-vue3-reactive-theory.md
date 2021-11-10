---
title: Vue 3 响应性原理
tags: 
  - web
  - vue
date: 2021-04-05
author: cp3hnu
location: ChangSha
summary: 探讨 Vue 3 响应性原理
---
# Vue 3 响应性原理

在介绍 Vue 3 响应性原理之前，先回顾一下 Vue 2 响应性原理，Vue 2 响应性原理的核心是

1. 当把一个普通的 JavaScript 对象传入 Vue 实例作为 `data` 选项时，Vue 将遍历此对象所有的 property，并使用 [`Object.defineProperty`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)) 把这些 property 全部转为 [getter/setter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#defining_getters_and_setters)；

2. 每个组件实例都对应一个 **watcher** 实例，它会在组件渲染的过程中把“接触”过的数据 property 记录为依赖。之后当依赖项的 setter 触发时，会通知 watcher，从而使它关联的组件重新渲染。

Vue 3 响应性的关键是使用 ES6 **[Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)** 代替 `Object.defineProperty`

## Proxy

Proxy 是一个对象，它包装了另一个对象(目标对象)，并允许你拦截对该对象的任何交互。

```js
const dinner = {
  meal: 'tacos'
}

const handler = {
  get(target, property) {
    console.log('intercepted!')
    return target[property]
  }
}

const proxy = new Proxy(dinner, handler)
console.log(proxy.meal)
// intercepted!
// tacos
```

Vue 3 实现响应性的中心思想大致如下：

```js
const dinner = {
  meal: 'tacos'
}

const handler = {
  get(target, property) {
    track(target, property)
    return Reflect.get(...arguments)
  },
  set(target, property, value, receiver) {
    trigger(target, property)
    return Reflect.set(...arguments)
  }
}

const proxy = new Proxy(dinner, handler)
console.log(proxy.meal)
```

上述代码的执行步骤：

1. **当一个值被读取时进行追踪**：proxy 的 `get` 处理函数中 `track` 函数记录了该 property 和当前副作用。
2. **当某个值改变时进行检测**：在 proxy 上调用 `set` 处理函数。
3. **重新运行代码来读取原始值**：`trigger` 函数查找哪些副作用依赖于该 property 并执行它们。

由此可见，响应性由两个部分组成，追踪依赖(track)和当依赖变化时执行副作用(trigger)

## 追踪依赖



## 执行副作用



Vue 3 将 `data` 返回的对象交由 `reactive()` 使其成为响应式对象，并存储为 `this.$data`。Property `this.val1` 和 `this.val2` 分别是 `this.$data.val1` 和 `this.$data.val2` 的别名。

一个组件的模板被编译成一个 [`render`](https://v3.cn.vuejs.org/guide/render-function.html) 函数，它被包裹在一个副作用中，允许 Vue 在运行时跟踪被“触达”的 property。如果这些 property 中的任何一个随后发生了变化，它将触发副作用再次运行，重新运行 `render` 函数以生成新的 VNodes。

## 响应性 API

`data` 返回的对象交由 `reactive()` 使其成为响应式对象，但是其它地方使用对象时(比如 `setup`)，并不具有响应性，为了实现响应性可以使用下面这些函数。

> 对比 Vue 2，对于没有在 data 中定义的 propterty，后面想追加响应性，只能使用 `vue.$set` 函数，而在 Vue 3 中添加响应性property 更加灵活

#### 声明响应式状态：`reactive`

要为 JavaScript 对象创建响应式状态，可以使用 `reactive` 方法。`reactive` 的响应式转换是“深层”的—它影响所有嵌套 property.

```js
import { reactive } from 'vue'

// 响应式状态
const state = reactive({
  count: 0
})
```

#### 原始值变成响应式：`ref`

`ref`  可以让基本数据类型变成响应式。`ref`  返回一个可变的响应式对象，该对象作为一个响应式的引用维护着它内部的值，该对象只包含一个名为 `value` 的 property

```js
import { ref } from 'vue'

const count = ref(0)
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

当 `ref` 作为渲染上下文 (从 [setup()](https://v3.cn.vuejs.org/guide/composition-api-setup.html) 中返回的对象) 上的 property 返回并可以在模板中被访问时，它将自动浅层次解包内部值。只有访问嵌套的 ref 时需要在模板中添加 `.value`

```vue
<template>
  <div>
    <span>{{ count }}</span>
    <button @click="count ++">Increment count</button>
    <button @click="nested.count.value ++">Nested Increment count</button>
  </div>
</template>

<script>
  import { ref } from 'vue'
  export default {
    setup() {
      const count = ref(0)
      return {
        count,

        nested: {
          count
        }
      }
    }
  }
</script>
```

当 `ref` 作为响应式对象的 property 被访问或更改时，为使其行为类似于普通 property，它会自动解包内部值

```js
const count = ref(0)
const state = reactive({
  count
})

console.log(state.count) // 0

state.count = 1
console.log(count.value) // 1
```

Ref 解包仅发生在被**响应式 `Object`** 嵌套的时候。当从 `Array` 或原生集合类型如 [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)访问 ref 时，不会进行解包

#### `reactive` 与 `ref` 的区别

`reactive` 只能用于 Object 类型，而 `ref` 常用于值类型(number, string, boolean)，当然也能用于 Object 类型，当 `ref` 用于 Object 时，浅层次解包后和 `reactive` 的用法类似。

```js
const refState = ref({
   count: 0
})

const reactiveState = reactive({
   count: 0
})
```

![](/Users/cp3hnu/Documents/mine/cp3hnu.github.io/docs/blog/assets/vue3-ref.png)

#### 响应式状态解构：`toRefs`

让解构后的 property 具有响应性，使用 `toRefs`。 `toRefs `将响应式对象转换为普通对象，其每个 property 都是指向原始对象相应 property 的 [`ref`](https://v3.cn.vuejs.org/api/refs-api.html#ref)。

```js
import { reactive, toRefs } from 'vue'

const book = reactive({
  author: 'Vue Team',
  year: '2020',
  title: 'Vue 3 Guide',
  description: 'You are reading this book right now ;)',
  price: 'free'
})

// author、title 都是 ref 类型
let { author, title } = toRefs(book)

title.value = 'Vue 3 Detailed Guide' 
console.log(book.title) // 'Vue 3 Detailed Guide'
```

#### 可选的 property 解构：`toRef`

上例中如果 `title` 是可选的 prop，则传入的 `props` 中可能没有 `title` 。在这种情况下，`toRefs` 将不会为 `title` 创建一个 ref 。你需要使用 `toRef` 替代它。

`toRef` 可以用来为源响应式对象上的某个 property 新创建一个 ref。

```js
import { toRef } from 'vue'

const book = reactive({
  author: 'Vue Team',
  year: '2020',
  title: 'Vue 3 Guide',
  description: 'You are reading this book right now ;)',
  price: 'free'
})

// author、title 都是 ref 类型
let title = toRef(book, 'title')

title.value = 'Vue 3 Detailed Guide' 
console.log(book.title) // 'Vue 3 Detailed Guide'
```

## 执行副作用 API

