---
pageClass: blog-page
title: Immutability in React
tags: 
  - web
  - react
date: 2022-08-20
author: cp3hnu
location: ChangSha
summary: React 要求不能修改 state 的引用类型属性本身的内容，而是通过 setState 设置一个新值。本文通过 Javascript、Immer 来实现 Object、Array 的不可变性。
---

# Immutability in React

## Javascript

我们先来看看 Javascript 是怎么实现 Array 和 Object 的不可变性。能用基本的 Javascript 实现的，我们就不需要求助于第三方库。

### Array

Array 中下列常用方法是可变方法，因为它们修改了原数组

- `push`
- `pop`
- `unshift`
- `shift`
- `splice`
- `sort`
- `reverse`

而这些方法不会修改原数组，而是返回一个新数组，是不可变方法

- `concat`
- `slice`
- `filter`
- `map`
- `...` 操作符

我们就使用这些不变方法来代替可变方法，实现 Array 的不可变性

#### `push`

在数组的末尾添加数据项

```js
const array = [1,2,3,4];
const immutableArray = array.concat(5); // 1,2,3,4,5
// 或者
const immutableArray = [...array, 5]; // 1,2,3,4,5
```

#### `pop`

从数组的末尾移除数据项

```js
const array = [1,2,3,4];
const last = array[array.length - 1]; // 4
const immutableArray = array.slice(0, -1); // 1,2,3
```

#### `unshift`

在数组的开头添加数据项

```js
const array = [1,2,3,4];
const immutableArray = [5].concat(array); // 5,1,2,3,4
// 或者
const immutableArray = [5, ...array]; // 5,1,2,3,4
```

#### `shift`

在数组的开头移除数据项

```js
const array = [1,2,3,4];
const firt = array[0]; // 1
const immutableArray = array.slice(1); // 2,3,4
```

#### `splice`

`splice` 具有插入、替换、删除的功能

##### 插入

```js
const array = [1,2,3,4];
// 在 index = 2，插入数值 5
const index = 2;
const newValue = 5;
const immutableArray = [...array.slice(0, index), newValue, ...array.slice(index)]; // 1,2,5,3,4
```

##### 替换

```js
const array = [1,2,3,4];
// 将 index = 2 的值，替换成数值 5
const index = 2;
const newValue = 5
const immutableArray = [...array.slice(0, index), newValue, ...array.slice(index + 1)]; // 1,2,5,4
// 更好的方法
const immutableArray = array.map((value, idx) => idx !== index ? value : newValue)
```

##### 删除

```js
const array = [1,2,3,4];
// 将 index = 2 的值删掉
const index = 2;
const immutableArray = [...array.slice(0, index), ...array.slice(index + 1)]; // 1,2,4
// 更好的方法
const immutableArray = array.filter((_, idx) => idx !== index)
```

#### Sort and reverse

先使用 `...` 浅复制数组，然后在复制得到的数组上调用 `sort`、`reverse`。

上面提到的方法（比如 `push`、`pop` 等）以及未提及的方法（比如  `fill`、`copyWithin` 等），都可以采用这个方式实现不可变性。

```js
const array = [1,3,2,4];
const sortedArray = [...array].sort(); // 1,2,3,4
const reversedArray = [...array].reverse(); // 4,2,3,1
```

### Object

对于浅层次的修改比较简单，使用 `...` 操作符或者 `assign` 方法，例如

```js
const state = {
  selected: 'apple',
  quantity: 13,
};
const newState = {
  ...state,
  selected: 'orange', // 修改
  origin: 'imported from Spain' // 新增
};
/* 
newState = {
  selected: 'orange',
  quantity: 13,
  origin: 'imported from Spain'
}
*/
```

对于深层次的修改就比较麻烦了，比如修改 `state.a.b.c.d = 10`

```js
const state = {
  a: {
    b: {
      c: {
        d: 5
      }
    }
  }
};

const newState = {
  ...state,
  ...{
    a: {
      ...state.a,
      ...{
        b: {
          ...state.a.b,
          ...{
            c: {
              ...state.a.b.c,
              d: 10
            }
          }
        }
    	}
    }
  }
}

/*
{
  a: { b: { c: { d: 5 } } }
}
*/
```

这段代码看得人头皮发麻，对于深层次的修改建议使用 `lodash` [`cloneDeep`](https://lodash.com/docs/4.17.15#cloneDeep) 方法，拷贝一份原对象，然后再修改，或者使用第三库

```js
const state = {
  a: {
    b: {
      c: {
        d: 5
      }
    }
  }
};
const newState = _.cloneDeep(state)
newState.a.b.c.d = 10
```

## Immer

未完待续...



## References

- [Immer](https://immerjs.github.io/immer/)
- [immutable-js](https://immutable-js.com/)
- [immutability-helper](https://github.com/kolodny/immutability-helper)

