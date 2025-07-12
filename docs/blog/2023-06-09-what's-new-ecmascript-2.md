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

接上篇 [ES2016 ~ ES2020 新特性](/2022/04/09/what-s-new-ecmascript/)

[这里](https://github.com/tc39/proposals/blob/main/finished-proposals.md) 是 ECMAScript 2021 ~ 2025 所有通过的提案

[这里](https://www.joylearn123.com/What-s-New-in-ECMAScript/) 是我写的下面这些新特性的 playground，方便查看运行结果

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

- `Array`
- `String`
- `TypedArray`，例如 `Uint8Array`

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

在正则表达式（RegExp）中添加 `d` flag，获取正则表达式中捕获组在源字符串中起止位置，这些信息存放在匹配返回对象的 `indices` 数组中。

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

ES2024 新增 **7** 组新特性

- [Well-Formed Unicode Strings](https://github.com/tc39/proposal-is-usv-string)
- [Array Grouping](https://github.com/tc39/proposal-array-grouping)
- [`Atomics.waitAsync`](https://github.com/tc39/proposal-atomics-wait-async)
- [`Promise.withResolvers`](https://github.com/tc39/proposal-promise-with-resolvers)
- [RegExp `v` flag with set notation + properties of strings](https://github.com/tc39/proposal-regexp-v-flag)
- [Resizable and growable ArrayBuffers](https://github.com/tc39/proposal-resizablearraybuffer)
- [ArrayBuffer transfer](https://github.com/tc39/proposal-arraybuffer-transfer)

### Well-Formed Unicode Strings

什么是 "Well-Formed Unicode Strings"？是指字符串中不包含 [lone surrogates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#utf-16_characters_unicode_code_points_and_grapheme_clusters)。在 UTF-16 编码中，`0xD800 ~ 0xDBFF` 表示 "leading surrogates"，`0xDC00 ~ 0xDFFF` 表示 "trailing surrogates"，它们必须按顺序成对出现，"leading surrogates" 在前，"trailing surrogates" 在后，而且两者中间不能有其它字符。如果字符串只包含一个，或者顺序不正确，这种字符串被称为 "Ill-Formed Unicode Strings"。在处理这种字符串时，有些 API 会报异常，比如 [`encodeURI`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI)。

因此 `String` 新增两个方法：

- [`isWellFormed()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/isWellFormed) 方法，判断字符串是否是 "Well-Formed Unicode Strings"

-  [`toWellFormed()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toWellFormed) 方法，将 [lone surrogates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#utf-16_characters_unicode_code_points_and_grapheme_clusters) 字符替换成 `U+FFFD` 字符（�）

```js
const strings = [
  // Lone leading surrogate
  "ab\uD800",
  "ab\uD800c",
  // Lone trailing surrogate
  "\uDFFFab",
  "c\uDFFFab",
  // Well-formed
  "abc",
  "ab\uD83D\uDE04c",
];

for (const str of strings) {
  console.log(str.isWellFormed());
}

// false,
// false,
// false,
// false,
// true,
// true

for (const str of strings) {
  console.log(str.toWellFormed());
}

// "ab�"
// "ab�c"
// "�ab"
// "c�ab"
// "abc"
// "ab😄c"
```

### Array Grouping

对数组进行分组，添加了两个静态方法

- [`Object.groupBy()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy)
- [`Map.groupBy()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/groupBy)

> 这里需要注意，分组方法是 `Object` 和 `Map` 的静态方法，而不是 `Array` 的实例方法

```js
Object.groupBy(items, callbackFn)
```

`items` 是任意可迭代对象。该方法对可迭代对象的每一个元素，调用 `callbackFn(element, index)` 函数，以这个函数的返回值作为分组的属性，而属性值是分组的元素组成的数组。

```js
const inventory = [
  { name: "asparagus", type: "vegetables", quantity: 5 },
  { name: "bananas", type: "fruit", quantity: 0 },
  { name: "goat", type: "meat", quantity: 23 },
  { name: "cherries", type: "fruit", quantity: 5 },
  { name: "fish", type: "meat", quantity: 22 },
];

const result = Object.groupBy(inventory, ({ type }) => type);

/* Result is:
{
  vegetables: [
    { name: 'asparagus', type: 'vegetables', quantity: 5 },
  ],
  fruit: [
    { name: "bananas", type: "fruit", quantity: 0 },
    { name: "cherries", type: "fruit", quantity: 5 }
  ],
  meat: [
    { name: "goat", type: "meat", quantity: 23 },
    { name: "fish", type: "meat", quantity: 22 }
  ]
}
*/
```

需要注意的是，该方法返回的对象里的分组元素和原始可迭代对象的元素是同一个，不是深拷贝。

[`Map.groupBy()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/groupBy) 和 [`Object.groupBy()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy) 的语法类似，使用 [`Map.groupBy()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/groupBy) 一般是为了使用 object 作为 key。

```js
const inventory = [
  { name: "asparagus", type: "vegetables", quantity: 9 },
  { name: "bananas", type: "fruit", quantity: 5 },
  { name: "goat", type: "meat", quantity: 23 },
  { name: "cherries", type: "fruit", quantity: 12 },
  { name: "fish", type: "meat", quantity: 22 },
];

const restock = { restock: true };
const sufficient = { restock: false };
const result = Map.groupBy(inventory, ({ quantity }) =>
  quantity < 6 ? restock : sufficient,
);
console.log(result.get(restock));
// [{ name: "bananas", type: "fruit", quantity: 5 }]
```

### `Atomics.waitAsync`

`Atomics` 新增 [`waitAsync()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics/waitAsync) 静态方法等待共享内存位置上的异步操作，并返回包含操作结果的对象。与 [`Atomics.wait()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics/wait) 不同的是 `waitAsync` 是非阻塞的，可以在主线程上使用。

```js
Atomics.waitAsync(typedArray, index, value)
Atomics.waitAsync(typedArray, index, value, timeout)
```

- `typedArray` 只能是查看 [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) 的 [`Int32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int32Array) 或者 [`BigInt64Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt64Array)

- `index` 是等待的位置

- `value` 是期待的值

- `timeout` 是等待的毫秒数，如果是 `NaN` 将变成 `Infinity` ，负数将变成 0

该方法返回一个对象，有下面两个属性

- `async`，一个布尔值，表示 value 是不是一个 Promise
- `value`，如果 `async` 是 `false`，它将是一个字符串，值为 "not-equal" 或者是 "timed-out"（只有当 `timeout` 为 0 时）。如果 `async` 为 `true`，它将是一个 Promise，resovle 值为 "ok" 或 "timeout"。

```js
// main thread
let i32a = null;

const w = new Worker("worker.js");
w.onmessage = function (env) {
  i32a = env.data;
};

setTimeout(() => {
  Atomics.store(i32a, 0, 1);
  Atomics.notify(i32a, 0);
}, 1000);
```

```js
// worker thread
const sab = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
const i32a = new Int32Array(sab);
postMessage(i32a);

const wait = Atomics.waitAsync(i32a, 0, 0);
// { async: false; value: "not-equal" | "timed-out"; }
// or
// { async: true; value: Promise<"ok" | "timed-out">; }

if (wait.async) {
  wait.value.then((value) => console.log(value));
} else {
  console.log(wait.value);
}
```

### `Promise.withResolvers`

`Promise`  添加 [`withResolvers()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers) 静态方法，该方法返回一个对象，包含一个新的 `promise` 和两个解析或拒绝它的函数

```js
const { promise, resolve, reject } = Promise.withResolvers()
```

等价于

```js
let resolve, reject;
const promise = new Promise((res, rej) => {
  resolve = res;
  reject = rej;
});
return { promise, resolve, reject }
```

`Promise.withResolvers()` 的使用场景是，当你有一个 promise，需要通过某个事件监听器来解决（resolve）或拒绝（reject），而这些事件监听器无法包装在 promise 的执行器（executor）里。比如 Node.js [readable stream](https://nodejs.org/api/stream.html#class-streamreadable).

```js
async function* readableToAsyncIterable(stream) {
  let { promise, resolve, reject } = Promise.withResolvers();
  stream.on("error", (error) => reject(error));
  stream.on("end", () => resolve());
  stream.on("readable", () => resolve());

  while (stream.readable) {
    await promise;
    let chunk;
    while ((chunk = stream.read())) {
      yield chunk;
    }
    ({ promise, resolve, reject } = Promise.withResolvers());
  }
}
```

`Promise.withResolvers()` 是一个泛型方法。它可以在与 `Promise` 构造函数相同签名的任意构造函数上使用。

```js
class NotPromise {
  constructor(executor) {
    // The "resolve" and "reject" functions behave nothing like the native
    // promise's, but Promise.withResolvers() just returns them, as is.
    executor(
      (value) => console.log("Resolved", value),
      (reason) => console.log("Rejected", reason),
    );
  }
}

const { promise, resolve, reject } = Promise.withResolvers.call(NotPromise);
resolve("hello");
// Resolved hello
```

### RegExp `v` flag with set notation + properties of strings

RegExp 新增 `v` flag，并提供三个功能

- 字符串的 Unicode 属性
- 集合标记法和字符串文本语法
- 改进不区分大小写的匹配

#### 字符串的 Unicode 属性

Unicode 标准为每个符号定义了各种属性和属性值。ES2018 Unicode 字符属性转义可以轻松匹配这些 Unicode 字符属性，例如 `\p{Script_Extensions=Greek}` 匹配希腊脚本中使用的每个符号

```js
const regexGreekSymbol = /\p{Script_Extensions=Greek}/u;
regexGreekSymbol.test('π');
// true
```

其实 Unicode 字符属性是一组码位（code point），比如 `\p{ASCII_Hex_Digit}` 等价于 `[0-9A-Fa-f]`。Unicode 字符属性有个缺点：一次只匹配单个 Unicode 字符或者码位，而这在某些情形下是不够的，比如：

```js
// Unicode defines a character property named “Emoji”.
const re = /^\p{Emoji}$/u;

// Match an emoji that consists of just 1 code point:
re.test('⚽'); // '\u26BD'
// true ✅

// Match an emoji that consists of multiple code points:
re.test('👨🏾'); // '\u{1F468}\u{1F3FE}\u200D\u2695\uFE0F'
// false ❌
```

在上面的示例中，正则表达式不匹配 👨🏾，因为它是由多个码位组成，而 `Emoji` 是一个 Unicode 字符属性。

幸运的是，Unicode 标准还定义了字符串属性。此类属性是一组字符串，每个字符串都包含一个或多个码位。与现有的 Unicode 属性转义不同，此模式可以匹配多字符字符串

```js
const re = /^\p{RGI_Emoji}$/v;

// Match an emoji that consists of just 1 code point:
re.test('⚽'); // '\u26BD'
// true ✅

// Match an emoji that consists of multiple code points:
re.test('👨🏾'); // '\u{1F468}\u{1F3FE}\u200D\u2695\uFE0F'
// true ✅
```

[`RGI_Emoji`](https://www.unicode.org/reports/tr51/#def_rgi_set) 是推荐用于一般交换的所有有效表情符号（字符和序列）的子集。有了这个，我们现在可以匹配 emoji，无论它们包含多少个码位。除了 `RGI_Emoji`，还有下列字符串 Unicode 属性支持 `v` flag

- `Basic_Emoji`
- `Emoji_Keycap_Sequence`
- `RGI_Emoji_Modifier_Sequence`
- `RGI_Emoji_Flag_Sequence`
- `RGI_Emoji_Tag_Sequence`
- `RGI_Emoji_ZWJ_Sequence`

随着 Unicode 标准定义字符串的其它属性，这样的属性列表将来可能会增加。

> 尽管字符串的属性目前只在 `v` 标志下使用，[但是也计划在 `u` 模式下可用](https://github.com/tc39/proposal-regexp-v-flag/issues/49)。

#### 集合标记法和字符串文本语法

当使用 Unicode 字符属性和 `v` 标志时，可以实现字符集的差集、交集和并集操作

**使用 `--` 表示差集**

语法 `A--B` 可用于匹配 *`A` 中的字符串，但不能用于匹配 `B` 中的*字符串，即差集。

```js
/[\p{Script_Extensions=Greek}--π]/v.test('π'); 

// 排除多个，可以使用 []，下面是匹配非 ASCII 数字
/[\p{Decimal_Number}--[0-9]]/v.test('𑜹'); // true
/[\p{Decimal_Number}--[0-9]]/v.test('4'); // false
```

**使用 `&&` 表示交集**

`A&&B` 语法匹配 *`A` 和 `B` 中的*字符串，即交集

```js
// 匹配希腊字母
const re = /[\p{Script_Extensions=Greek}&&\p{Letter}]/v;
re.test('π'); // true
re.test('𐆊'); // false
```

**并集**

并集以前就支持了，`[AB]` 语法匹配 *`A` 或者 `B` 中的*字符串，即并集

```js
const re = /^[\p{ASCII}\q{🇧🇪|abc}xyz0-9]$/v;
re.test('_'); // true
re.test('🇧🇪'); // true
re.test('abc'); // true
re.test('x'); // true
re.test('4'); // true
```

注意这里的 `\q{🇧🇪|abc}`，这是正则表达式中字符串字面量的新语法。例如，`\q{🇧🇪|abc}` 匹配字符串 `🇧🇪` 和 `abc`。主要是用于多字符字符串，比如 `🇧🇪` 。

#### 改进不区分大小写的匹配

`u` 标志存在[令人困惑的不区分大小写的匹配行为](https://github.com/tc39/proposal-regexp-v-flag/issues/30)。请考虑以下两个正则表达式

```js
const re1 = /\p{Lowercase_Letter}/giu;
const re2 = /[^\P{Lowercase_Letter}]/giu;
```

这两个正则表达式应该是同一个意思，表示小写字母，且不区分大小写，但是它们的行为却非常不同

```js
const re1 = /\p{Lowercase_Letter}/giu;
const re2 = /[^\P{Lowercase_Letter}]/giu;

const string = 'aAbBcC4#';

string.replaceAll(re1, 'X');
// 'XXXXXX4#'

string.replaceAll(re2, 'X');
// 'aAbBcC4#''
```

使用 `v` 标志而不是 `u` 标志时，两种模式的行为就相同了

```js
const re1 = /\p{Lowercase_Letter}/giv;
const re2 = /[^\P{Lowercase_Letter}]/giv;

const string = 'aAbBcC4#';

string.replaceAll(re1, 'X');
// 'XXXXXX4#'

string.replaceAll(re2, 'X');
// 'XXXXXX4#'
```

无论是否设置了 `i` 标志，`v` 标志都会使 `[^\p{X}]` = `[\P{X}]`，`[^\P{X}]` = `[\p{X}]`

更多详情请参考 [RegExp `v` flag with set notation and properties of strings](https://v8.dev/features/regexp-v-flag)

### Resizable and growable ArrayBuffers

[`ArrayBuffer` 构造函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/ArrayBuffer) 新增 [`maxByteLength`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/ArrayBuffer#maxbytelength) 选项来创建一个大小可变的 ArrayBuffer，比如下面创建一个 8 字节的缓冲区，其大小可以调整为 16 字节：

```js
const buffer = new ArrayBuffer(8, { maxByteLength: 16 });
```

同时 ArrayBuffer 新增

- [`resize(newLength)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/resize) 方法，将缓冲区的大小调整为指定的大小（以字节为单位），如果 
- [`maxByteLength`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/maxByteLength) 属性，表示缓冲区可以调整大小的最大长度（以字节为单位）
- [`resizable`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/resizable) 属性，表示缓冲区是否可以调整大小

```js
const buffer = new ArrayBuffer(8, { maxByteLength: 16 });
console.log(buffer.byteLength); // 8
console.log(buffer.maxByteLength); // 16
console.log(buffer.resizable); // true

buffer.resize(12);
console.log(buffer.byteLength); // 12
console.log(buffer.maxByteLength); // 16
console.log(buffer.resizable); // true

buffer.resize(24); // RangeError，
```

`resize()` 方法只能用于大小可变的 ArrayBuffer，否则抛出 `TypeError` 异常

如果 `resize()` 的参数 `newLength` 大于 `maxByteLength`，则抛出 `RangeError` 异常

### ArrayBuffer transfer

`ArrayBuffer` 新增 [`transfer()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/transfer) 和 [`transferToFixedLength()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/transferToFixedLength) 方法，创建一个与缓冲区具有相同字节内容的新 `ArrayBuffer`，然后分离此缓冲区。不同的是后者只能创建一个固定大小的 `ArrayBuffer`。

同时 `ArrayBuffer` 新增 [`detached`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/detached) 属性，表示该缓冲区是否已被转移。

```js
transfer()
transfer(newByteLength)
transferToFixedLength()
transferToFixedLength(newByteLength)
```

例子：

```js
const buffer = new ArrayBuffer(8);
const view = new Uint8Array(buffer);
view[1] = 2;
view[7] = 4;

// Copy the buffer to the same size
const buffer2 = buffer.transfer();
console.log(buffer.detached); // true
console.log(buffer2.byteLength); // 8
const view2 = new Uint8Array(buffer2);
console.log(view2[1]); // 2
console.log(view2[7]); // 4

// Copy the buffer to a smaller size
const buffer3 = buffer2.transfer(4);
console.log(buffer3.byteLength); // 4
const view3 = new Uint8Array(buffer3);
console.log(view3[1]); // 2
console.log(view3[7]); // undefined

// Copy the buffer to a larger size
const buffer4 = buffer3.transfer(8);
console.log(buffer4.byteLength); // 8
const view4 = new Uint8Array(buffer4);
console.log(view4[1]); // 2
console.log(view4[7]); // 0
```

## ES2025 (ES 16)

敬请期待...



## References

- [tc39/finished-proposals](https://github.com/tc39/proposals/blob/main/finished-proposals.md)
- [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [What’s New In ES2021](https://www.howtogeek.com/devops/whats-new-in-the-es2021-standard-for-javascript/)
-  [What's New in ES2022](https://dev.to/jasmin/whats-new-in-es2022-1de6)
-  [What's New in ES2023](https://dev.to/jasmin/what-is-new-in-es2023-4bcm)
-  [What's New in ES2024](https://pawelgrzybek.com/whats-new-in-ecmascript-2024/)
-  [CanIUse](https://caniuse.com/)
-  [Compat-Table](https://compat-table.github.io/compat-table/es2016plus/)
-  [node.green](https://node.green/)
-  [core-js](https://github.com/zloirock/core-js)
-  [Polyfill.io](https://polyfill.io/)
-  [RegExp `v` flag with set notation and properties of strings](https://v8.dev/features/regexp-v-flag)

