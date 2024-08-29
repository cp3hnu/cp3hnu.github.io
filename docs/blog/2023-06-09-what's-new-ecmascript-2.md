---
pageClass: blog-page
title: ES2021 ~ ES2025 新特性
tags: 
  - web
  - javascript
  - ECMAScript
date: 2023-06-09
author: cp3hnu
location: ChangSha
summary: 学习总结 ECMAScript 从 2021 年到 2025 年引入的新特性
---

# ES2021 ~ ES2025 新特性

接上篇 [ES2016 ~ ES2020 新特性](./2022-04-09-what's-new-ecmascript/)

[这里](https://github.com/tc39/proposals/blob/main/finished-proposals.md) 是 ECMAScript 2021 ~ 2025 所有通过的提案

[这里](https://github.com/cp3hnu/What-s-New-in-ECMAScript) 是我写的下面这些新特性的 playground，方便查看运行结果

> 使用这些新特性之前，建议用 [CanIUse](https://caniuse.com/)，查一下浏览器的兼容性

> 如果浏览器不支持可以自行 polyfill：[core-js](https://github.com/zloirock/core-js), [Polyfill.io](https://polyfill.io/)

## ES2021 (ES12)

ES2021 新增 **6** 组新特性

- [`String.prototype.replaceAll()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll)
- [`Promise.any()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/any)
- [Logical Assignment Operators](https://github.com/tc39/proposal-logical-assignment)
- [Numeric separators](https://github.com/tc39/proposal-numeric-separator)
- [WeakRef](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakRef)
- [FinalizationRegistry](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry)

### String.prototype.replaceAll

#### 语法

```javascript
str.replaceAll(regexp | substr, newSubstr | replacerFunction)
```

子字符串替换，第一个参数是 `regexp`（RegExp）或者 `substr` (子字符串，**不会转换成 RegExp**)，第二个参数是  `newSubstr` 或者 `replacerFunction` 函数，返回一个新的字符串，原字符串不变。

> `replace()` 使用带 `\g` flag 的 `regexp` 能实现同样的作用

使用 `regexp`  时，必须带 `\g` flag，否则抛出 **TypeError:  replaceAll must be called with a global RegExp.**

`newSubstr` 可以使用特殊标记

| Pattern   | Inserts                                      |
| :-------- | :------------------------------------------- |
| `$$`      | `$` 字符本身                                 |
| `$&`      | 匹配的子字符串                               |
| `` $` ``  | 匹配的子字符串左边的字符串                   |
| `$'`      | 匹配的子字符串右边的字符串                   |
| `$n`      | 第 n 个捕获组                                |
| `$<name>` | 命名捕获组，没有对应的捕获组时，值为空字符串 |

`replacerFunction` 函数的参数

| 参数                               | Supplied value                        |
| :--------------------------------- | :------------------------------------ |
| `match`                            | 匹配的子字符串                        |
| `p1, p2, ...` （如果有捕获组）     | 捕获组1, 2...                         |
| `offset`                           | 匹配的子字符串在原字符串中的 index    |
| `string`                           | 原字符串                              |
| `namedGroups` （如果有命名捕获组） | 命名捕获组对象，{ captrueName: ..., } |

存在多个子字符串时，`replacerFunction` 函数会被调用多次

#### Demo

```javascript
const str = 'I saw a saw saw a saw';
console.log(str.replaceAll('saw', 'see'));
// "I see a see see a see"

const regex = /saw/g;
console.log(str.replaceAll(regex, 'listen'));
// "I listen a listen listen a listen"
```

##### 使用捕获组

```javascript
const str = 'table football, foosball';
const regex = /foo([a-z]+)/g;
console.log(str.replaceAll(regex, 'basket($1)'));
// table basket(tball), basket(sball)
```

##### 命名捕获组

```javascript
const regex = /foo(?<name>[a-z]+)/g;
console.log(str.replaceAll(regex, 'basket($<name>)'));
// table basket(tball), basket(sball)
```

##### 使用函数

```javascript
const str = 'table football, foosball';
const regex = /foo(?<name>[a-z]+)/g;
const replacedStr = str.replaceAll(regex, (matched, p1, offset, input, groups) => {
  console.log(matched, p1, offset, groups)
  // football tball 6 { name: 'tball' }
  // foosball sball 16 { name: 'sball' }
  return `basket(${p1})`
})

console.log(replacedStr);
// table basket(tball), basket(sball)
```

### Promise.any()

#### 语法

```javascript
Promise.any(iterable);
```

如果 iterable 中有一个 promise resovle 时， `Promise.any` 返回 Promise.resolve(value)，value 是 resovle promise 的值，

如果所有的 promise 都 reject， `Promise.any` 返回 Promise.reject(error)，error 是 [`AggregateError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError) 类型，这个错误类型有要给`errors` 属性，表示收集的多个错误。

#### Demo

##### resolve

```javascript
const promise1 = Promise.reject(0);
const promise2 = new Promise((resolve) => setTimeout(resolve, 100, 'quick'));
const promise3 = new Promise((resolve) => setTimeout(resolve, 500, 'slow'));

const promises = [promise1, promise2, promise3];

Promise.any(promises).then((value) => console.log(value)); 
// quick
```

##### reject

```javascript
const promise1 = Promise.reject(0);
const promise2 = new Promise((resolve, reject) => setTimeout(reject, 100, 'quick'));
const promise3 = new Promise((resolve, reject) => setTimeout(reject, 500, 'slow'));

const promises = [promise1, promise2, promise3];

Promise.any(promises).catch((error) => console.log(error)); 
// AggregateError: All promises were rejected
```

### Logical Assignment Operators

ES2021 引入 **3** 个 逻辑赋值运算符：`&&=`，`||=` ，`??=`

```javascript
x &&= y  等价于  x && (x = y)
x ||= y  等价于  x || (x = y) 
x ??= y  等价于  x = x ?? y
```

### Numeric separators

数字分隔符，在数字中使用下划线（`_`）分割数字，增强数字的可读性，比如千分位分割

```javascript
const billion = 1000000000;
 
// ES2021, one billion
const billion = 1_000_000_000;
```

> 整数、小数、二进制、八进制、十六进制都可以使用

### WeakRef

ES2021 使用 `WeakRef` 创建一个目标对象（target object）的弱引用，和 `WeakMap` 和 `WeakSet` 类似，`WeakRef` 不会阻止目标对象被回收

> 这个功能[非必要不使用](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakRef#avoid_where_possible)，而且使用时也务必谨慎小心，不要依赖垃圾回收机制的具体实现，这里是一些使用时的 [注意事项]((https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakRef#notes_on_weakrefs))

使用 `WeakRef` 的 `deref()` 方法获取目标对象

```javascript
const target = {};
const xWeakRef = new WeakRef(target);
 
// 如果目标对象被回收，则返回 undefined，否则返回目标对象 target
const deRef = xWeakRef.deref(); 
if (deRef) {
  // ...
}
```

使用 `WeakRef` 构造函数创建目标对象（target object）的弱引用，使用 `deref()` 方法访问目标对象，如果目标对象被回收，则返回 `undefined`。

这里有一个例子：[Counter shown in a DOM element](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakRef#using_a_weakref_object)

### FinalizationRegistry

`FinalizationRegistry` 让你在对象被回收时，请求回调。

> 这个功能 [非必要不使用](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry#avoid_where_possible)，而且使用时也务必谨慎小心，不依赖垃圾回收机制的具体实现，这里是一些使用时的 [注意事项](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry#notes_on_cleanup_callbacks)

##### Demo

```javascript
const registry = new FinalizationRegistry(heldValue => {
  // This callback will run when a registered object is garbage collected
  if (heldValue === "user") {
    // Delete cached user data here.
  }
});
 
const user = { Username: "cp3hnu" };
// unregisterToken 用于注销，可以是任意值
registry.register(user, "user", unregisterToken); 
```

当 `user` 被回收时，将调用回调函数。

如果想注销，可以调用 [`unregister()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry/unregister) 方法，传入

```javascript
registry.unregister(unregisterToken);
```

## ES2022 (ES13)

ES2022 新增 **8** 组新特性

- [Class Fields](https://github.com/tc39/proposal-class-fields)
- [Ergonomic brand checks for Private Fields](https://github.com/tc39/proposal-private-fields-in-in)
- [Class Static Initialization Block](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Class_static_initialization_blocks)
- [Accessible `Object.prototype.hasOwnProperty`](https://github.com/tc39/proposal-accessible-object-hasownproperty)
- [`.at()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at)
- [RegExp Match Indices](https://github.com/tc39/proposal-regexp-match-indices)
- [Top-level `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#top_level_await)
- [Error Cause](https://github.com/tc39/proposal-error-cause)

### Class Fields

#### Public class fields

ES2015 引入了 `class` 用来定义类，但是属性的定义必须在 `constructor` 构造函数里。

```javascript
class Counter {
  constructor() {
    this.x = 0;
  }
  
  clicked() {
    this.x++;
  }
}
```

ES2022 引入了 [public class fields](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields)， 可以在类定义里定义 `public` 实例属性，例如

> 在类的构建期间使用 [`Object.defineProperty()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 添加 public class fields

```javascript {2}
class Counter {
  publicField = 10;  
  accessPublicField() {
    this.publicField+=1;
    console.log("publicField = ", this.publicField)
  }
}
const count = new Counter();
count.accessPublicField();
// publicField = 11
```

#### Public static class fields

ES2022 也引入了 [public static class fields](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#static_methods_and_properties)，可以在类定义里定义 `public` 静态属性

```javascript
class Counter {
  static publicStaticField = 'static field'
  static publicStaticMethod() { 
    return 'This is static method and ' + this.publicStaticField
  }
}
console.log(Counter.publicStaticField);     // static field
console.log(Counter.publicStaticMethod());  // This is static method and static field
```

#### Private class features

现在 JavaScript 终于可以定义 `private` 实例属性和方法，只需要在属性和方法名称前前面加 `#`，例如

```javascript
class Counter {
  #privateField = 20; // 私有属性
	#privateMethods() { // 私有方法
    this.#privateField += 1
  }

  accessPrivateField() {
    this.#privateMethods(); 
    console.log('#privateField =', this.#privateField)
  }
}

const count = new Counter();
count.accessPrivateField();
// #privateField = 21
```

私有属性和方法只能在类定义里访问，不能通过实例访问

```javascript
const count = new Counter();
console.log(count.#privateField);     
// SyntaxError: Private field '#privateField' must be declared in an enclosing class
console.log(count.#privateMethods());
// SyntaxError: Private field '#privateMethods' must be declared in an enclosing class
```

除了定义 `private` 实例属性和方法之外，还可以定义 `private` 静态属性和方法

```javascript
export class Counter {
  static #privateStaticField = 30  
  static #privateStaticMethod() {
    Counter.#privateStaticField += 1
  }
	accessPrivateStaticField() {
    Counter.#privateStaticMethod(); 
    console.log('#privateStaticField =', Counter.#privateStaticField)
  }
}

const count = new Counter();
count.accessPrivateStaticField();

// #privateStaticField = 31
```

和 `private` 实例属性和方法一样，静态私有属性和方法只能在类定义里访问（通过`类名`），在类定义外面不能访问

```javascript
console.log(Counter.#privateStaticField);  
// SyntaxError: Private field '#privateStaticField' must be declared in an enclosing class
console.log(count.#privateStaticMethod());
// SyntaxError: Private field '#privateStaticMethod' must be declared in an enclosing class
```

还有一点要注意，访问静态私有属性和方法时，要使用类名比如 `Counter`，不能使用 `this`，这会导致子类访问静态私有属性和方法时报错。

```javascript
class BaseClassWithPrivateStaticField {
  static #PRIVATE_STATIC_FIELD;

  static basePublicStaticMethod() {
    this.#PRIVATE_STATIC_FIELD = 42;
    return this.#PRIVATE_STATIC_FIELD;
  }
}

class SubClass extends BaseClassWithPrivateStaticField { };
try {
  SubClass.basePublicStaticMethod()
} catch(error) { 
	console.log(error);
  // TypeError: Cannot write private member #PRIVATE_STATIC_FIELD
  // to an object whose class did not declare it
};
```

在这个例子中，`this` 指向 `SubClass`，但是 `SubClass` 没有 `#PRIVATE_STATIC_FIELD` 私有静态属性，所以报错。

#### 继承

子类继承时有下列规则

- 子类只能访问、重写父类的 `public` 属性和方法。
- 子类只能访问、重写父类的 `public` 静态属性和静态方法。

- 子类实例调用父类方法访问 `public` 属性时，子类实例可以重写这个属性，这种情况访问的是子类的属性值。

- 子类实例调用父类方法访问 `private` 属性时，子类实例 **不能** 重写这个属性，所以访问的一直都是父类 `private` 属性。

```javascript
class SubCounter extends Counter {
  publicField = 110; // 子类实例重写了父类的 public 属性
  #privateField = 120; // 子类实例不能重写了父类的 private 属性
}

const s = new SubCounter()
s.accessPublicField(); // 111，返回的是子类的属性值
s.accessPrivateField(); // 21，返回的是父类的属性值
```

### Ergonomic brand checks for Private Fields

使用 `in` 操作符检测对象是否定义了 `private` 属性/方法

```javascript {9}
class C {
  #brand;

  #method() {}

  get #getter() {}

  static isC(obj) {
    return #brand in obj && #method in obj && #getter in obj;
  }
}
```

> **注意**： 这个必须在类定义里使用，而不是这样使用

```javascript
const c = new C()
console.log(#brand in c);
// SyntaxError: Private field '#brand' must be declared in an enclosing class

// 或者
console.log("#brand" in c);
// 输出 false， 因为 c 不存在属性名为"#brand" 的 public属性
```

### Class Static Initialization Block

在类里面定义一个 `static initialization block`，初始化多个 `static` 属性

```javascript {9-14}
class Translator {
  static translations = {
    yes: 'ja',
    no: 'nein',
    maybe: 'vielleicht',
  };
  static englishWords = [];
  static germanWords = [];
  static {
    for (const [english, german] of Object.entries(this.translations)) {
      this.englishWords.push(english);
      this.germanWords.push(german);
    }
  }
}
console.log(Translator.englishWords, Translator.germanWords)
// [ 'yes', 'no', 'maybe' ] [ 'ja', 'nein', 'vielleicht' ]
```

### Accessible `Object.prototype.hasOwnProperty`

使用 [`Object.hasOwn()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn) 静态方法代替 [`Object.prototype.hasOwnProperty()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty) 判断对象是否用于某个非prototype 的属性。

```javascript
const object1 = {
  prop: 'exists'
};

console.log(Object.hasOwn(object1, 'prop')); // true
console.log(Object.hasOwn(object1, 'prop1')); // false
```

使用 `Object.hasOwn()`静态方法代替 `Object.prototype.hasOwnProperty()` 主要有下面两个原因

1. 不是所有的对象都有 `hasOwnProperty()` 方法，例如

```javascript
const obj = Object.create(null)
obj.hasOwnProperty("foo")
// TypeError: obj.hasOwnProperty is not a function
```

2. 对象可以重写  `hasOwnProperty()` 方法

```javascript
let object = {
  hasOwnProperty() {
    throw new Error("gotcha!")
  }
}

object.hasOwnProperty("foo")
// Uncaught Error: gotcha!
```

使用  `Object.hasOwn()` 静态方法就不会有上面的问题

```javascript
const obj = Object.create(null)
Object.hasOwn(obj, "foo") // false

let object = {
  hasOwnProperty() {
    throw new Error("gotcha!")
  }
}
Object.hasOwn(object, "foo") // false
```

### at()

返回索引（index）对应的值。

支持的类型有

- Array
- String
- TypedArray，例如Uint8Array

#### 语法

```javascript
at(index)
```

index 可以是正整数，也可以是负整数，当是负数表示表示从后往前数 index，相当于 `at(length + index)`。函数返回索引对应位置上的值，如果没有则返回 `undefined`

#### Demo

```javascript
[1,2,3,4,5].at(3)    // 4

[1,2,3,4,5].at(-2)   // 4
```

### RegExp Match Indices

在正则表达式（RegExp）中添加 `\d` flag，获取正则表达式中捕获组在源字符串中起止位置，这些信息存放在匹配返回对象的 `indices` 数组中。

| Property/Index | Description                                                  |
| :------------- | :----------------------------------------------------------- |
| `[0]`          | 匹配的子字符串                                               |
| `[1], ...[n]`  | 1~n 个捕获组                                                 |
| `index`        | 匹配的子字符串在源字符串中的开始位置                         |
| `indices`      | 数组，[0] 是匹配的子字符串的起止位置，[1, 2...n] 是捕获组的起止位置。如果捕获组有命名，`indices` 还有一个 `groups` 属性，`key` 是捕获组的名称，`value` 是命名捕获组的起止位置 |
| `input`        | 源字符串                                                     |
| `groups`       | 命名捕获组                                                   |

#### Demo

```javascript
const matchObj = /(a+)(?<name>b+)/d.exec('aaaabb');
console.log(matchObj);

/*
	matchObj[0]: aaaabb,
	matchObj[1]: aaaa,
	matchObj[2]: bb
	matchObj.index: 0,
	matchObj.input: aaaabb,
	matchObj.indices: [ [ 0, 6 ], [ 0, 4 ], [ 4, 6 ], groups: { name: [ 4, 6 ] } ]
	matchObj.groupds: { name: 'bb' }
*/
```

### Top-level `await` modules

顶级 `await` 允许模块充当大型异步函数。有了顶级 `await`，ECMAScript 模块可以等待资源，而引入的模块必须等待这些模块执行完才开始执行。

##### Top-level `await` modules

```javascript
// awaiting.js
const promise = new Promise(resolve => {
  setTimeout(() => {
    resolve(10)
  }, 2000)
})

const data = await promise;
console.log('awaiting.js')
export default data;
```

##### Imported modules


```javascript
// 2022.js
import awaitData from './awaiting.js'
console.log("2022.js");
console.log(awaitData + 10);

// awaiting.js
// 2022.js
// 20
```

等 `awaiting.js` 执行完之后（2s），才开始执行 `2022.js`

### Error Cause

现在 Error 和它的子类通过设置 `cause` 属性可以让我们指定错误背后的原因。这在深度嵌套函数中非常有用，可以帮助我们快速找到错误。

```javascript
function readFiles(filePaths) {
  return filePaths.map(
    (filePath) => {
      try {
        // ···
      } catch (error) {
        throw new Error(
          `While processing ${filePath}`,
          {cause: error}
        );
      }
    });
}
```

## ES2023 (ES14)

ES2023 新增 **4** 组新特性

- [Array find from last](https://github.com/tc39/proposal-array-find-from-last)
- [Change Array by Copy](https://github.com/tc39/proposal-change-array-by-copy)

- [Hashbang Grammar](https://github.com/tc39/proposal-hashbang)

- [Symbols as WeakMap keys](https://github.com/tc39/proposal-symbols-as-weakmap-keys)

### Array find from last

[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 和 [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 新增两个方法：[`findLast`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findLast) 和 [`findLastIndex`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findLastIndex)。从函数命名上，我们就知道这两个方法在功能上和 [`find`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) 和 [`findIndex`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex) 相似，只不过是从后往前查找。

```js
const array = [5, 12, 50, 130, 44];
const found1 = array.findLast((element) => element > 45);      // 130
const found2 = array.findLastIndex((element) => element > 45); // 3
```

### Change Array by Copy

[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 和 [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 新增四个方法：[`toReversed`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toReversed)、[`toSorted`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted)、[`toSpliced`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSpliced)、[`with`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/with)，这四个方法有一个共同点就是不会改变原数组，这对 React 非常友好。

`toReversed`、`toSorted`、`toSpliced` 分别是 [`reverse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse)、[`sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)、[`splice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) 的非破坏性版本

`with` 以非破坏性的方式替换 `index` 处的元素，即 `arr[index] = value` 的非破坏性版本

```js
const items = [1, 5, 3, 4, 2];
const reversedItems = items.toReversed();
const sortedItems = items.toSorted((a, b) => a - b);
const splicedItems = items.toSpliced(2, 0, 6);
const withItems = items.with(0, 10);

console.log(reversedItems); // [ 2, 4, 3, 5, 1 ]
console.log(sortedItems);   // [ 1, 2, 3, 4, 5 ]
console.log(splicedItems);  // [ 1, 5, 6, 3, 4, 2 ]
console.log(withItems);     // [ 10, 5, 3, 4, 2 ]
console.log(items);         // [ 1, 5, 3, 4, 2 ]
```

### Hashbang Grammar

Unix 的命令行脚本都支持 `#!` 命令，又称为 [Shebang / Hashbang](https://zh.wikipedia.org/wiki/Shebang)。这个命令放在脚本的第一行，用来指定脚本的执行器。Hashbang 就是想为 JavaScript 脚本引入了 `#!` 命令。这个命令必须写在脚本文件或者模块文件的第一行

```js
#!/usr/bin/env node
// in the Script Goal
'use strict';
console.log(2*3);
```

```js
#!/usr/bin/env node
// in the Module Goal
export {};
console.log(2*3);
```

这样，Unix 命令行就可以直接执行脚本了

```sh
# 以前执行脚本
$ node hello.js

# 有了 hashbang 之后执行脚本
$ ./hello.js
```

### Symbols as WeakMap keys

当前 WeakMap 只支持对象作为 key，因为对象代表的是内存地址，它们是唯一的。而 Symbol 也具有这种特性。

```js
Symbol("foo") === Symbol("foo"); // false
```

因此 Symbol 也可以作为 WeakMap 的 key。

```js
const weak = new WeakMap();

const key = Symbol('my ref');
const someObject = { /* data data data */ };

weak.set(key, someObject);
```

Symbol 能作为 WeakMap 的 key 这个新特性，能用于 [ShadowRealms](https://github.com/tc39/proposal-symbols-as-weakmap-keys#shadowrealms-membranes-and-virtualization) 和 [Record & Tuples](https://github.com/tc39/proposal-symbols-as-weakmap-keys#record-and-tuples) 提案。详情请参考 [Symbols as WeakMap keys](https://github.com/tc39/proposal-symbols-as-weakmap-keys)。

因为 registered symbols 可以在任何地方任意创建，它们的行为几乎与它们包装的字符串相同。因此不能保证是惟一的，也不能被垃圾回收。所以不能作为 WeakMap 的 key。Well-known symbols 可以作为作为 WeakMap 的 key。

> Registered symbols 是使用 [`Symbol.for()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for) 方法的注册的 symbols。
>
> Well-known symbols 是  [`Symbol.hasInstance`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance) 之类的 symbols。

## ES2024 (ES 15)

期待更新...



## ES2025 (ES 16)

期待更新...



## References

- [tc39/finished-proposals](https://github.com/tc39/proposals/blob/main/finished-proposals.md)
- [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [What’s New In the ES2021 Standard for JavaScript?](https://www.howtogeek.com/devops/whats-new-in-the-es2021-standard-for-javascript/)
-  [What's new in ES2022](https://dev.to/jasmin/whats-new-in-es2022-1de6)
-  [What's new in ES2023](https://dev.to/jasmin/what-is-new-in-es2023-4bcm)
-  [CanIUse](https://caniuse.com/)
-  [Compat-Table](https://compat-table.github.io/compat-table/es2016plus/)
-  [node.green](https://node.green/)

