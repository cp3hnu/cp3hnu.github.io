---
pageClass: blog-page
title: ES2016 ~ ES2022 新特性
tags: 
  - web
  - javascript
date: 2022-04-09
author: cp3hnu
location: ChangSha
summary: 学习总结 ECMAScript 从 2016 年到 2022 年引入的新特性
---

# ES2016 ~ ES2022 新特性

我们知道 ECMAScript 在 ES2015（即 ES6）引入很多很多的新特性，比如箭头函数、class、promise、proxy、reflect 等等，详情可以参考 Babel 的 [Learn ES2015](https://babeljs.io/docs/en/learn)。在 ES2015 以后 ECMAScript 每年也陆续引入一些新特性，这篇文章总结了从 ES2016 到 ES2022 引入的新特性。

[这里](https://github.com/tc39/proposals/blob/main/finished-proposals.md) 是 ECMAScript 2016 ~ 2022 所有通过的提案

[这里](https://replit.com/@cp3hnu/ECMAScript) 是我写的下面这些新特性的 playground，方便查看运行结果

> 使用这些新特性之前，建议用 [CanIUse](https://caniuse.com/)，查一下浏览器的兼容性

> 如果浏览器不支持可以自行 polyfill：[core-js](https://github.com/zloirock/core-js), [Polyfill.io](https://polyfill.io/)

## ES2016 (ES7)

ES2016 新增 **2** 个新特性

- [`Array.prototype.includes()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes) 
- [Exponentiation (**)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Exponentiation) 幂操作符

### Array.prototype.includes()

#### 语法

```javascript
arr.includes(searchElement[, fromIndex])
```

判断数组中是否存在 `searchElement`，可选参数 `fromIndex` 表示从哪里开始搜索，如果 `fromIndex` 是负数，则使用 `array.length + fromIndex`，`includes` 使用  [`sameValueZero`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#same-value-zero_equality) 查询 `searchElement` 是否存在。

#### Demo

```javascript
const pets = ['cat', 'dog', 'bat'];

pets.includes('cat'); // true
pets.includes('at'); // false
```

### Exponentiation (**)

#### 语法

```javascript
x ** y
```

幂操作运算符，等于  `Math.pow`，除了它可以接受 `BigInt` 类型的数据，有以下两点注意事项

- 它是右结合运算符，即 `a ** b ** c` 等于 `a ** (b ** c)`
- 不能把一元运算符（`+/-/~/!/delete/void/typeof`）放在基数的前面，所以 `-2 ** 2` 会抛出异常，应该使用 `- (2 ** 2)` 或者  `(-2) ** 2`

#### Demo

```javascript
2 ** 2 // 4
2 ** 10 // 1024
// 右结合
2 ** 2 ** 3 // 2 ** (2 ** 3)，即2的8次方256
-(2 ** 2) // -4
(-2) ** 2 // 4

// 下面这个会报异常
// -2 ** 2
```

## ES2017 (ES8)

ES2017 新增 **6** 组新特性

- [async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

- [`Object.values()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values) 和 [`Object.entries()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
- [`String.prototype.padStart()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart) 和 [`String.prototype.padEnd()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd)
- [`Object.getOwnPropertyDescriptors()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors)
- [Trailing commas in function parameter lists and calls](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Trailing_commas#trailing_commas_in_functions)
- [Shared memory and atomics](https://github.com/tc39/proposal-ecmascript-sharedmem/blob/main/TUTORIAL.md)

### async function

#### 语法

```javascript
async function name([param[, param[, ...param]]]) {
   statements
}
```

异步函数，这个我们平时已经用得很多了，搭配 [await 操作符](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) 一起使用。这个函数的返回一个 `promise`。有三点需要注意：

- 如果异步函数抛出异常，函数返回 `Promise.reject()`。
- 如果 `await`  后面的 `promise` 是 `Promise.reject()`，将导致异步函数抛出异常。
- 如果 `await`  后面的函数抛出异常，相当于 `await` 一个 `reject` 的 `promise`。

#### Demo

```javascript
function defer() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(1024)
    }, 2000)
  })
}

async function asyncFunc() {
  const result = await defer()
  console.log('result =', result)
}

asyncFunc() // result = 1024
```

> 注意要使用 [try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) 处理 await 失败的情况，或者使用 await func().catch(e){...}

### Object.values()

#### 语法

```javascript
Object.values(obj)
```

返回对象 `obj` 自己的（own）可枚举的且不是 `Symbol` 的属性值数组

> [`Object.keys(obj)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys) 返回对象 `obj` 自己的（own）可枚举的属性名数组

#### Demo

```javascript
const object1 = {
  a: 'somestring',
  b: 42,
  c: false
};

Object.values(object1)  // ['somestring', 42, false]
```

### Object.entries()

#### 语法

```javascript
Object.entries(obj)
```

返回对象 `obj` 自己的（own）可枚举的且不是 `Symbol` 的属性名和属性值组成的数组的数组，即 `[[key1, value1], [key2, value2]]`

#### Demo

```javascript
const object1 = {
  a: 'somestring',
  b: 42,
  c: false
};

Object.entries(object1)  // [['a', 'somestring'], ['b', 42], ['c', false]]
```

### String.prototype.padStart()

#### 语法

```javascript
str.padStart(targetLength[, padString])
```

填充字符串：用 `padString` （默认是空格）从字符串的开始位置填充字符串，使字符串的总长度达到 `targetLength`

如果 `padString.length + str.length > targetLength `  则使用 `padString` 的一部分字符填充。

如果 `padString.length + str.length < targetLength `  则使用多个 `padString` 填充。

#### Demo

```javascript
'abc'.padStart(10);         // "       abc"
'abc'.padStart(8, "0");     // "00000abc"
'abc'.padStart(6,"123465"); // "123abc"
'abc'.padStart(1);          // "abc"
'abc'.padStart(10, "foo");  // "foofoofabc"
```

### String.prototype.padEnd()

和 `String.prototype.padStart()`  一样，只是从后面填充字符串

### Object.getOwnPropertyDescriptors()

#### 语法

```javascript
Object.getOwnPropertyDescriptors(obj)
```

返回对象 `obj` 自己的（own）属性描述，包括不可枚举属性和 `Symbol` 属性

#### Demo

```javascript
const object1 = {
  a: 'somestring',
  b: 42,
  c: false
};

Object.getOwnPropertyDescriptors(object1)
/*
{
  a: {
    value:"somestring",
    writable:true,
    enumerable:true,
    configurable:true
  },
  b: {
    value:42,
    writable:true,
    enumerable:true,
    configurable:true
  },
  c: {
    value:false,
    writable:true,
    enumerable:true,
    configurable:true
  }
}
*/
```

### Trailing commas in function parameter lists and calls

在定义函数参数和调用函数的时候，末尾添加逗号是合法的，例如

定义函数参数

```javascript
function f(p,) {} 
// 等同于
function f(p) {}
```

函数调用

```javascript
f(p,);
// 等同于
f(p);
```

### Shared Memory and Atomics

为了增强并发处理，引入了 `SharedArrayBuffer` 和 `Atomics`。`SharedArrayBuffer ` 允许多个 Worker 共享字节，`Atomics` 为原子操作提供了很多静态方法。[这里](https://github.com/tc39/proposal-ecmascript-sharedmem) 是这个提案的详情。

## ES2018 (ES9)

ES2018 新增 **5** 组新特性

- [`Promise.prototype.finally`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally)
- [Rest/Spread Properties](https://github.com/tc39/proposal-object-rest-spread)
- [Asynchronous Iteration](https://github.com/tc39/proposal-async-iteration)
- [New features related to regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
- [Template literals revision](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates_and_escape_sequences)

### Promise.prototype.finally()

#### 语法

```javascript
p.finally(function() {
   // clean
});
```

无论 Promise 是 resolve 还是 reject，`finally()` 都会执行，一般用于最后的执行清理工作，比如关闭文件等

> `finally()` 跟 `then()` 和 `catch()` 函数一样，都是返回 Promise，这样可以级联使用

#### Demo

```javascript
function checkMail() {
  return new Promise((resolve, reject) => {
    if (Math.random() > 0.5) {
      resolve('Mail has arrived');
    } else {
      reject(new Error('Failed to arrive'));
    }
  });
}

checkMail()
  .then((mail) => {
    console.log(mail);
  })
  .catch((err) => {
    console.error(err);
  })
  .finally(() => {
    console.log('Experiment completed');
  });

/*
	output:
	Mail has arrived
	Experiment completed
*/
```

### Rest/Spread Properties

ES2015 引入了 [解构赋值](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) 和 [展开语法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator)，也引入了应用于数组的 Rest/Spread Elements

ES2018 引入了应用于对象的 Rest/Spread Properties

#### Rest Properties

在对象解构赋值中，rest 操作符（…）将原对象自己（own）所有的可枚举属性复制到 rest properties 中（除了那些已经在对象字面量中提到的属性）

##### 数组

```javascript
const {a, b, ...rest} = [10, 20, 30, 40]
console.log(a);     // 10
console.log(a);     // 20
console.log(rest);  // [30, 40]
```

##### 对象

```javascript
const {a, b, ...rest} = {a: 10, b: 20, c: 30, d: 40};
console.log(a);     // 10
console.log(a);     // 20
console.log(rest);  // {c: 30, d: 40}
```

##### Rest parameters

```javascript
function func({a, b, ...rest}) {};
```

#### Spread Properties

展开操作符（`...`）将操作数自己（own）所有的可枚举属性插入到目标对象中

##### 数组

```javascript
const arr = [30, 40]
const arr1 = [10, 20, ...arr]
console.log(arr1); // [10, 20, 30, 40]
```

##### 对象

```javascript
const obj = {
  c: 30,
  d: 40
}
const obj1 = {
  a: 10, 
  b: 20,
  ...obj
}
console.log(obj1) // {a: 10, b: 20, c: 30, d: 40}
```

##### Spread 操作符 VS Object.assign

Spread 操作符实现了 [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) 的功能，但是不会改变 source target，且语法更加简单

```javascript
const obj1 = {
  a: 10,
  b: 20
}；
const obj2 = {
  c: 30,
  d: 40
}
const obj3 = {
  ...obj1,
  ...obj2
}
const obj4 = Object.assign({}, obj1, obj2)
```

### Asynchronous Iteration

ES2015 引入了[迭代器和生成器](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators)。为了实现异步迭代，ES2018 引入了**异步迭代器（Async Iterator）** 、**异步生成器（Async Generator）**和 **[异步迭代语句（ for await of）](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of)**

#### Async Iterator

AsyncIterator 和 Iterator 一样，有一个 `next` 方法，不同的是 AsyncIterator 的 `next` 方法返回一个 resolve `{ value, done }` 对象的 Promise

> AsyncIterator 的 `next` 方法也可以直接返回 `{ value, done }` 对象

#### Symbol.asyncIterator

和同步迭代一样，支持异步迭代的对象必须实现 `Symbol.asyncIterator`，返回一个异步迭代器 AsyncIterator

#### Async Generator

通过 `async *function` 实现异步生成器，异步生成器和同步生成器结构是一样的，除了 `next` 方法返回 Promise 而不是 `{ value, done }`。

#### for await of

迭代异步可迭代对象使用 for await of 语句。

> for await of 语句只能用于异步函数中（async function）

#### Demo

下面通过一个例子来了解异步迭代

```javascript
class AsynchronousIteration {
  constructor(max) {
    this.max = max
  }
  [Symbol.asyncIterator]() {
    const max = this.max
    let count = 0
    return {
      next() {
        if (count <= max) {
          return new Promise((resolve) => {
            resolve({value: count++, done: false})
          }, 1000)
        } else {
          return new Promise((resolve) => {
            resolve({value: count++, done: true})
          }, 1000)
        }
      }
    }
  }
}

async function testAsyncIteration() {
  const iterable = new AsynchronousIteration(5)
  for await (const count of iterable) {
    console.log(count)
  }
}

testAsyncIteration() // 1 2 3 4 5
```

for await of 也可以用于同步迭代器，比如数组，但是有一点需要注意，就是如果同步迭代返回的元素是 Promise，则 for await of 会等待 Promise fulfilled 或者 rejected

```javascript
const arr = [1, 2, Promise.resolve(3)]
function testSync() {
  for (const i of arr) {
    console.log(i)
  }
}
async function testAsync() {
  for await (const i of arr) {
    console.log(i)
  }
}

testSync()  // 1, 2, Promise { 3 }
testAsync() // 1, 2, 3
```

异步生成器

```javascript
async function* readLines(path) {
  let file = await fileOpen(path);

  try {
    while (!file.EOF) {
      yield await file.readLine();
    }
  } finally {
    await file.close();
  }
}
```

### New features related to regular expression

ES2018 引入了 **4** 个正则表达式的新特性

#### `/s` flag

我们知道在正则表达式里，`.` 表示除换行符以外的任意字符。ES2018 在 RegExp 中加入 `/s` flag，表示`.` 也能匹配换行符。

```javascript
console.log(/^.$/.test('\n')) // false
console.log(/^.$/s.test('\n')) // true
```

同时 RegExp 添加了 `RegExp.prototype.dotAll `属性，表示 RegExp 中是否包含 `/s` flag

#### Named capture groups

以前 RegExp 执行 `exec` ，只能通过 index 获取对应的捕获组，比如

```javascript
const eventDate = /([0-9]{4})-([0-9]{2})-([0-9]{2})/;
const matchedObject = eventDate.exec('2022-04-09');
console.log(matchedObject[1]); // 2022
console.log(matchedObject[2]); // 04
console.log(matchedObject[3]); // 09
```

ES2018 通过 `(?<name>...)` 可以给捕获组命名

```javascript
const eventDate = /(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2})/;
const matchedObject = eventDate.exec('2022-04-03');
console.log(matchedObject.groups.year);  // 2022
console.log(matchedObject.groups.month); // 04
console.log(matchedObject.groups.day);   // 09

// 还可以使用对象解构赋值
const { groups: {year, day, month} } = matchedObject.exec('2022-04-09');
```

命名捕获组还能通过 `\k<name>` 反向引用，例如

```javascript
let duplicate = /^(?<half>.*).\k<half>$/u;
duplicate.test('a*b'); // false
duplicate.test('a*a'); // true
```

当然也能通过 `\index` 反向引用（index 是捕获组的序号）

```javascript
let triplicate = /^(?<part>.*).\k<part>.\1$/u;
triplicate.test('a*a*a'); // true
triplicate.test('a*a*b'); // false
```

用于  `String.prototype.replace` 方法时，在替换字符串中可以通过 `$<name>` 表示正则表达式中的捕获组，例如

```javascript
let re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/u;
let result = '2015-01-02'.replace(re, '$<day>/$<month>/$<year>');
// result === '02/01/2015'
```

如果   `String.prototype.replace`  的第二个参数是函数，在这个函数的最后新增了一个 `groups` 参数，表示所有的捕获组

`function (matched, capture1, ..., captureN, offset, S, groups)`

```javascript
let re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/u;
let result = '2015-01-02'.replace(re, (...args) => {
 let {day, month, year} = args[args.length - 1];
 return `${day}/${month}/${year}`;
});
// result === '02/01/2015'
```

#### Lookbehind Assertions

零宽度后行断言 `(?<=pattern)`，用于匹配 `pattern` 后面的字符串，这个 `pattern` 不在匹配内，只是作为一个前置标志，例如下面是匹配美元符号（$）后面的金额数字：

```javascript
const regExp = /(?<=\$)\d+(\.\d*)?/;
console.log(regExp.exec('$199')[0]); // 199
console.log(regExp.exec('199')); // null
```

相反的操作是负向零宽度后行断言 `(?<!pattern)`，匹配其前面没有 `pattern` 的字符串

```javascript
const regExp = /(?<!\$)\d+(\.\d*)?/;
console.log(regExp.exec('￥199')[0]); // 199
console.log(regExp.exec('$199')[0]); // 99
```

##### Lookahead Assertions

复习一下零宽度先行断言，它对应的是  `(?=pattern)` 和 `(?!pattern)` ，例如下面匹配结尾是 `ing` 的字符串

```javascript
const regExp = /\w+(?=ing)/;
console.log(regExp.exec('starting')[0]); // start
console.log(regExp.exec('start')); // null
```

#### Unicode Property Escapes

使用 `\u` 标识符和 `\p{…}`，匹配 Unicode 字符，例如匹配希腊字符

```javascript
const regexGreekSymbol = /\p{Script=Greek}/u;
regexGreekSymbol.test('π');
```

匹配空白字符

```javascript
const result = /\p{White_Space}+/u.test('3 empanadas');
console.log(result) // Prints true
```

`\P{...}` 和  `\p{…} `意思相反，表示不匹配。

这个平时我很少用到，[这里](https://github.com/tc39/proposal-regexp-unicode-property-escapes) 有详细的描述和例子。

### Template literals revision

ES2015 (ES 6) 引入了 [Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) 和 [Tagged templates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates)，但是如果在模板字符串中存在下列情形的，则抛出 **SyntaxError** 异常

- `\uXXXX`：unicode 转义，如 `\u00A9` 表示 ©，但是像 `\ubuntu` 这种则是错误的
- `\u{Code Point}`：和 `\uXXXX` 一样是 unicode 转义，但是可以放置一个 [码点（code point）](https://developer.mozilla.org/en-US/docs/Glossary/Code_point)，码点是 Unicode 中一个字符的完整标识，可能是16位，也可能是32位，例如 `\u{1F60A}` 表示一个笑脸（😊）， 但是像 `\u{ubuntu}` 这种则是错误的
- `\xHH`：16 进制转义，如 `\xA9` 表示 ©，但是像 `\xerxes` 这种则是错误的
- `\OOO`  [8进制转义](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Deprecated_octal#octal_escape_sequences)已经 deprecated，所以像 `\251` 这种也是错误的

在 ES2018 的 Tagged templates，上面这些将不再抛出 **SyntaxError** 异常，而是返回 `undefined`，如

```javascript
function latex(str) {
  return { "cooked": str[0], "raw": str.raw[0] }
}

latex`\unicode`

// { cooked: undefined, raw: "\\unicode" }
```

但是在 Template literals 和普通字符串(用双引号或者单引号包起来的)中依然是错误的，会抛出 **SyntaxError** 异常，如

```javascript
let bad = `bad escape sequence: \unicode`;
```

## ES2019 (ES10)

ES2019 新增 **8** 组新特性

- [`Array.prototype.flat()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat) 和 [`Array.prototype.flatMap()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap)
- [`String.prototype.trimStart()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trimStart) 和 [`String.prototype.trimEnd()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trimEnd)
- [`Object.fromEntries()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries)
- [`Symbol.prototype.description`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/description)
- [Optional `catch` binding](https://github.com/tc39/proposal-optional-catch-binding)
- [JSON superset](https://github.com/tc39/proposal-json-superset)
- [Well-formed `JSON.stringify`](https://github.com/tc39/proposal-well-formed-stringify)
- [`Function.prototype.toString` revision](https://github.com/tc39/Function-prototype-toString-revision)

### Array.prototype.flat()

#### 语法

```javascript
arr.flat(depth = 1)
```

`flat()` 就是将一个嵌套数组打平，`depth` 控制解套的层级，默认值是 `1`，数组本身不改变，返回打平后的数组

#### Demo

```javascript
const arr1 = [0, 1, 2, [3, 4]];
console.log(arr1.flat()); // [0, 1, 2, 3, 4]

const arr2 = [0, 1, 2, [[3, 4]]];
// 默认只打平一层嵌套数组
console.log(arr2.flat()); // [0, 1, 2, [3, 4]]
console.log(arr2.flat(2)); // [0, 1, 2, 3, 4]
```

[这里](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat) 列举了很多实现 `flat` 函数的方法，比如使用生成器

```javascript
function* flatten(array, depth) {
  if (depth === undefined) {
    depth = 1;
  }

  for (const item of array) {
    if (Array.isArray(item) && depth > 0) {
      yield* flatten(item, depth - 1);
    } else {
      yield item;
    }
  }
}

const arr = [1, 2, [3, 4, [5, 6]]];
const flattened = [...flatten(arr, Infinity)]; // [1, 2, 3, 4, 5, 6]
```

### Array.prototype.flatMap()

#### 语法

```javascript
arr.flatMap((currentValue, index, array) => { /* ... */ } )
```

`flatMap()` 等价于 `flat(1).map()`。`currentValue` 是数组的元素，`index` 是数组的索引，`array` 是数组本身。数组本身不改变，返回新的数组

#### Demo

```javascript
const arr = [1, 2, 3, 4];
const arr2 = arr.flatMap(x => x * x); // 1, 4, 9, 16
```

### String.prototype.trimStart() 和 String.prototype.trimEnd()

移除字符串前面（trimStart）或者后面（trimEnd）的空白字符，字符串本身不改变，返回去掉空白字符的字符串

#### Demo

```javascript
let str = '   foo  ';
console.log(str.length); // 8  
str = str.trimStart(); 
console.log(str.length); // 5 
str = str.trimEnd();
console.log(str.length); // 3  
```

### Object.fromEntries()

#### 语法

```javascript
Object.fromEntries(iterable);
```

将 `[key, value]` 对的列表（Array，Map 等可迭代对象）转换成对象，是 [`Object.entries()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries) 的反向操作

#### Demo

```javascript
const entries = new Map([
  ['foo', 'bar'],
  ['baz', 42]
]);
const obj = Object.fromEntries(entries);
console.log(obj); // { foo: "bar", baz: 42 }
```

### Symbol.prototype.description

创建 Symbol 的时候可以带一个可选的 `description` 参数，例如： **Symbol("foo")**，这个属性就是获取 Symbol 的 `description`（"foo"），不同的是创建 Symbol 时 `description` 可以是非字符串类型，例如 Number 类型，但是 `description` 属性返回的是其字符串形式。

`description` 属性不同于 `Symbol.prototype.toString()` ，前者没有用 "Symbol()" 字符串包裹 description

#### Demo

```javascript
console.log(Symbol("desc").description);     // "desc"
console.log(Symbol("desc").toString());     // "Symbol(desc)"
// 注意这里是字符串不是数字
console.log(Symbol(22).description);        // "22"
console.log(Symbol.for('foo').description); // "foo"
```

Symbol 虽然有 `toString()`方法 ， 但是 Symbol 不能转换成字符串，比如 `${Symbol("desc")}` 将抛出 **TypeError**，这是因为

> According to ECMA-262, using the [*addition operator*](http://www.ecma-international.org/ecma-262/7.0/index.html#sec-addition-operator-plus) on a value of type Symbol in combination with a string value first calls the internal [*ToPrimitive*](http://www.ecma-international.org/ecma-262/7.0/index.html#sec-toprimitive), which returns the symbol. It then calls the internal [*ToString*](http://www.ecma-international.org/ecma-262/7.0/index.html#sec-tostring) which, for Symbols, will throw a TypeError exception.
>
> So calling the internal *ToString* is not the same as calling [*Symbol.prototype.toString*](http://www.ecma-international.org/ecma-262/7.0/index.html#sec-symbol.prototype.tostring).
>
> 答案来源于 [stackoverflow](https://stackoverflow.com/questions/44425974/why-symbols-not-convert-string-implicitly)

### Optional `catch` binding

ES2019 之前 [try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) 中的 catch 块必须绑定一个错误变量，ES2019 提议这个错误变量是可选的了

```javascript
// 以前
try {
   ...
} catch(error) {
   ...
}

// 现在
try {
   ...
} catch {
   ...
}
```

### JSON superset

扩展 ECMA-262 成为 JSON 的超集。现在在字符串中允许存在行分隔符(U+2028)和段落分隔符(U+2029)。以前它们被视为行终止符，并导致 **SyntaxError** 异常。详见 [提案](https://github.com/tc39/proposal-json-superset)

### Well-formed `JSON.stringify`

ES2019 使用 JSON 转义序列来表示未配对代理代码点（例如 U+D800 ~ U+DFFF），而不是奇怪的字符。详见 [提案](https://github.com/tc39/proposal-well-formed-stringify)

```javascript
JSON.stringify('\uD800'); // '"�"'
JSON.stringify('\uD800'); // '"\ud800"'
```

### `Function.prototype.toString` revision

`Function.prototype.toString` 现在返回的字符串中包含函数的空白字符和注释

```javascript
function /* a comment */ foo () {}

foo.toString();

// 以前输出
"function foo() {}"


// 现在输出
"function /* comment */ foo () {}"
```

## ES2020 (ES11)

ES2020 新增 **9** 组新特性

- [Optional Chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
- [Nullish coalescing Operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator)

- [`String.prototype.matchAll()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll)
- [`Promise.allSettled()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)
- [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
- [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis)
- [`for-in` mechanics](https://github.com/tc39/proposal-for-in-order)
- [Dynamic Import `import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#dynamic_imports)
- [`import.meta`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import.meta)

### Optional Chaining (?.)

可选链操作符 `?.`，iOS Swift 开发的同学对这个再熟悉不过了

```swift
let str: String? = nil
let count = str?.count // count is nil
```

 JavaScript 终于也引入了这个操作符。

```javascript
const a = null // 或者 undefined
const b = a?.count
```

当 `a` 是 `null` 或者 `undefined`，直接返回  `undefined` 给 `b`，不会像 `.` 操作符报错，说

> Cannot read property 'count' of null

这个操作符对访问深层次的属性很有帮助，不需要一层一层的判断对象是否存在了

```javascript
// 以前
let property = ...
if (obj && obj.first && obj.first.array && obj.first.array[0]) {
  property = obj.first.array[0].property
}


// 现在
const property = obj?.first?.array?.[0]?.property
```

#### 语法

```javascript
obj.val?.prop
obj.val?.[expr]
obj.arr?.[index]
obj.func?.(args)
```

支持对象、数组和方法可选链式

#### Demo

```javascript
const adventurer = {
  name: 'Alice',
  cat: {
    name: 'Dinah'
  },
};

// 对象
console.log(adventurer.dog?.name); // undefined

// 方法
console.log(adventurer.someNonExistentMethod?.()); // undefined

//数组
console.log(adventurer.list?.[0]) // undefined
```

### Nullish coalescing Operator (??)

空值合并运算符 `??`，iOS Swift 开发的同学对这个也很熟悉

> 难道是 JavaScript 从 Swift 语言借鉴了这两个操作符（可选链操作符 `?.` 和 空值合并运算符 `??`），就是 Swift 5.5 借鉴了 Javascript 的  Async Function 和 await 操作符一样。😁

#### 语法

```javascript
const res = leftExpr ?? rightExpr
```

等价于

```javascript
const res = (leftExpr !== null && leftExpr !== undefined) ? leftExpr : rightExpr
```

当 `leftExpr` 是 `null` 或 `undefined` 是，`res` 为 `rightExpr`， 否则 `res` 为 `leftExpr` 

主要区别于逻辑或 `||`

```javascript
const res = leftExpr || rightExpr
```

逻辑或 `||` 是当 leftExpr 是 [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) 时，`res` 为 `rightExpr`， 否则 `res` 为 `leftExpr` 

 `??` 和 逻辑或 `||` 一样，当左边表达式的值不是  `null` 或 `undefined`，右边的表达式不会运算

#### Demo

```javascript
const myText = '';
const otherText = null;

const preservingFalsy = myText ?? 'Hi neighborhood';
console.log(preservingFalsy);   // ''

const neighborhood = otherText ?? 'Hi neighborhood';
console.log(neighborhood);     // 'Hi neighborhood'

const notFalsyText = myText || 'Hello world';
console.log(notFalsyText);     // Hello world
```

### String.prototype.matchAll()

#### 语法

```javascript
str.matchAll(regexp)
```

参数 `regexp`，是一个 RegExp 对象 ，如果不是，将使用 `new RegExp(regexp)` 转换成 RegExp 对象。这个 `RegExp` 对象必须带有 `\g` flag，否则抛出 **TypeError** 错误

它返回一个迭代器，其中每个元素是匹配成功的数组，带有额外的 `index` 和 `input` 属性。数组的第一元素是匹配的字符串，后面是对应的捕获组。

迭代器元素跟带 `\g` flag [`RegExp.prototype.exec()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec) 函数返回值是一样的。下面是这两个函数的 Demo.

#### Demo

##### RegExp.prototype.exec()

```javascript
const regexp = new RegExp('foo[a-z]*','g');
const str = 'table football, foosball';
let match;

while ((match = regexp.exec(str)) !== null) {
  console.log(`Found ${match[0]} start=${match.index} end=${regexp.lastIndex}.`);
}

// expected output: "Found football start=6 end=14."
// expected output: "Found foosball start=16 end=24."
```

##### String.prototype.matchAll()

```javascript
const regexp = new RegExp('foo[a-z]*','g');
const str = 'table football, foosball';
const matches = str.matchAll(regexp);

for (const match of matches) {
  console.log(`Found ${match[0]} start=${match.index} end=${match.index + match[0].length}.`);
}

// expected output: "Found football start=6 end=14."
// expected output: "Found foosball start=16 end=24."
```

> `matchAll()` 在函数内部复制了 `regexp`， 所以不像 `RegExp.prototype.exec()`，`regexp` 的 `lastIndex` 没有改变

### Promise.allSettled()

#### 语法

```javascript
Promise.allSettled(iterable);
```

等待所有的 promise resovle 或者 reject。返回一个 `Promise.resovle([{status, value | reason}])`

status 是 `'fulfilled'` 或者 `'rejected'`，另一个属性是

- 当 promise 是 resovle 时，返回 `value`
- 当 promise 是 reject 时，返回 `reason`

#### Demo

```javascript
const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve, reject) => setTimeout(reject, 100, 'foo'));
const promises = [promise1, promise2];

Promise.allSettled(promises).
  then((results) => results.forEach((result) => console.log(result)));

/* 
{ status: 'fulfilled', value: 3 }
{ status: 'rejected', reason: 'foo' }
*/
```

### BigInt

ES2020 引入了一个新的数据类型 **BigInt**。顾名思义用于处理大的整数的，它是一个内部 `bigint` 类型的封装对象，类似于与 Number（封装 number 类型）

> 目前位置 JavaScript 有 number、string、boolean、null、undefined、Object、Symbol 和 BigInt 8 个基础类型

```javascript
console.log('\n**BigInt**')
const a = BigInt(0)
console.log(typeof a) // bigint
```

可以在数字后面附加一个 `n`，表示这是一个 BigInt，或者使用 BigInt 构造函数，注意前面不要加 `new` 关键字。下面都是创建 BigInt 的方式

```javascript
// 数字字面量后面附加 n
const previouslyMaxSafeInteger = 9007199254740991n

// BigInt 构造函数
const alsoHuge = BigInt(9007199254740991)

// BigInt 构造函数的参数可以是字符串，数字和字符串可以是10进制、16进制、8进制和2进制
const hugeString = BigInt("9007199254740991")

// 16进制
const hugeHex = BigInt("0x1fffffffffffff")

// 8进制
const hugeOctal = BigInt("0o377777777777777777")

// 2进制
const hugeBin = BigInt("0b11111111111111111111111111111111111111111111111111111")
```

#### 主要事项

使用 BigInt 时，要注意

- 不能使用 `Math` 的方法，例如 `abs()`，会报错：**Cannot convert xxx BigInt value to a number**
- BigInt 支持 `+ * - % **` 运算，但是两个操作数要统一类型，不能混用 BigInt 和 number，例如 `1n + 2`，会报错：**Cannot mix BigInt and other types, use explicit conversions**
- 除法运算（`/`），只返回整数，例如 `5n / 2n = 2n`
- BigInt 运算结果是 BigInt 类型
- BigInt 不支持一元运算符 `+`
-  BigInt 支持[位运算符](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators)，除了 `>>>`
- BigInt 可以和 number 类型进行比较，如大于（>）、小于（>）和 等于（==）等
- `0n` 也是 [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) 值

### globalThis

以前全局对象（global）在不同的运行环境有不同的名字，浏览器是 `window`， Node 是 `global`， web workers 是  `self`。现在统一使用 `globalThis` 表示全局对象，下面的代码在浏览器里输出 `browers`

```javascript
if (globalThis === window){
  console.log('browser')
}
```

### `for-in` mechanics

ES2020 规定 `for (x in y)` 应以何种顺序访问 `y` 的属性，这样每次迭代的顺序是固定的。外部未知，属于内部实现细节。

### Dynamic Import `import()`

以前我们只能在文件的顶部静态地导入模块，如

```javascript
import _ from "lodash"
```

静态导入导致一开始就加载了模块的所有代码，增加了加载负荷，但是可能这些模块暂时是不需要的，这个时候就需要动态导入。

ES2020 引入动态导入 `import()`，可以按需导入模块。

`import()` 函数返回 promise

```javascript
let module = await import('/modules/my-module.js');
```

#### 路由懒加载

[路由懒加载](https://router.vuejs.org/zh/guide/advanced/lazy-loading.html) 就是使用了动态导入，当路由被访问的时候才加载对应组件。

```javascript
const UserDetails = () => import('./views/UserDetails')

const router = createRouter({
  // ...
  routes: [{ path: '/users/:id', component: UserDetails }],
})
```

### import.meta

使用 `import.meta` 访问 module 的元数据，比如 `url`

```javascript
<script type="module" src="es2020.js"></script>

// es2020.js
console.log(import.meta); 
// in replit.com
// { url: 'https://5511b908-bf3c-426b-be8b-a6c25d39cb67.id.repl.co/es2020.js' }
// playcode 不支持 type="module"
```

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

| Pattern   | Inserts                                             |
| :-------- | :-------------------------------------------------- |
| `$$`      | `$` 字符本身                                        |
| `$&`      | 匹配的子字符串                                      |
| `$``      | `匹配的子字符串左边的字符串`                        |
| `$'`      | 匹配的子字符串右边的字符串                          |
| `$n`      | 第 n 个捕获组，没有捕获组表示字符串本身 "$1, 2...." |
| `$<name>` | 命名捕获组，没有对应的捕获组时，值为空字符串        |

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

如果都是所有的 promise 都 reject， `Promise.any` 返回 Promise.reject(error)，error 是 [`AggregateError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError) 类型，这个错误类型有要给`errors` 属性，表示收集的多个错误。

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

ES2021 新增 **8** 组新特性

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
| groups         | 命名捕获组                                                   |

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

## References

- [tc39/finished-proposals](https://github.com/tc39/proposals/blob/main/finished-proposals.md)
- [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Useful New Features in ES2016 and 2017](https://betterprogramming.pub/useful-new-features-in-es2016-and-2017-3df7b29cc503)
- [What’s new in ES2018 (ES9)](https://medium.com/@xoor/whats-new-in-es2018-es9-a122b53e56a4)
- [What’s new in JavaScript ES2019](https://www.freecodecamp.org/news/whats-new-in-javascript-es2019-8af4390d8494/)
- [What’s new in JavaScript — ES2020](https://medium.com/@gaute.meek/whats-new-in-javascript-es2020-99dfff403f6f)
- [What’s New In the ES2021 Standard for JavaScript?](https://www.howtogeek.com/devops/whats-new-in-the-es2021-standard-for-javascript/)
-  [What's new in ES2022](https://dev.to/jasmin/whats-new-in-es2022-1de6)

