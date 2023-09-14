---
pageClass: blog-page
title: 迭代器和生成器
tags:
  - web
  - javascript
date: 2023-03-11
author: cp3hnu
location: ChangSha
summary: ES6 规范新增了两个高级特性，迭代器和生成器。使用这两个特性，能够更清晰、更高效、更方便地实现迭代。
---

# 迭代器和生成器

ES6 规范新增了两个高级特性，迭代器和生成器。使用这两个特性，能够更清晰、更高效、更方便地实现迭代。

## 迭代器

### 可迭代对象

实现了 **Iterable** 协议的对象，就是可迭代对象。

Iterable 协议只定义了一个属性或者方法，属性值或者方法返回值是一个迭代器：

```swift
protocol Iterable {
  [Symbol.iterator]() {
    return iterator;
  }
}
```

可迭代对象实现 `[Symbol.iterator]()` 方法时，最好是调用迭代器工厂函数，生成一个新的迭代器，这样才能保证迭代相互独立。

### 迭代器对象

实现了 **Iterator** 协议的对象，就是迭代器对象，简称迭代器。

Iterator 协议，定义了三个方法：

```swift
protocol Iterator {
  // required
  func next(value) {
    return { done: false, value: "value" } // IteratorResult
  }
  
  // optional
  func return(value) {}
  
  // optional
  func throw(exception) {}
}
```

迭代器必须实现 `next()` 方法，返回 ` IteratorResult: { done: false, value: "value" }` 对象，当 `done: true` 表示迭代完成。

可以把 **可迭代对象** 当成是一把有刻度的尺子，而 **迭代器** 就是游标，尺子通过游标来读取上面的刻度，可迭代对象通过迭代器遍历其数据。

一个对象可以同时是可迭代对象和迭代器

### 自定义可迭代对象

下面我们来实现一个迭代器 `Counter`

```js
class Counter { 
  constructor(limit) {
  	this.limit = limit; 
  }
  [Symbol.iterator]() {
  	let count = 1,
  	limit = this.limit;
  	return { 
      next() {
        if (count <= limit) {
          return { done: false, value: count++ };
        } else {
          return { done: true, value: undefined };
        } 
      }
  	};
  } 
}

// 利用迭代器迭代
const iterator = counter[Symbol.iterator]();
let {done, value } = iterator.next();
while (!done) {
  console.log(value); // 1 2 3
  ({done, value } = iterator.next());
}

// 利用 JS 的语法特性迭代
const counter = new Counter(3);
for (const i of counter) {
  console.log(i); // 1 2 3
}
```

### 可迭代对象的语法特性

可迭代对象会自动接收 JS 中关于可迭代对象的语言特性：

- for...of
- 数组解构，`const [a, b] = counter`
- 扩展操作符，`[...counter]`
- Array.from()，生成一个数组对象
- new Set()
- new Map()
- Promise.all()
- Promise.race()
- yield* 操作符

### 提前关闭迭代器

我们注意到  **Iterator** 协议还定义了两个可选的方法 `return()` 和 `throw()`。通过这两个方法可以提前关闭迭代器。这两个方法的返回值也是 **IteratorResult** 类型的对象。

```js {18}
class Counter { 
  constructor(limit) {
  	this.limit = limit; 
  }
  [Symbol.iterator]() {
  	let count = 1,
  	limit = this.limit;
  	return { 
      next() {
        if (count <= limit) {
          return { done: false, value: count++ };
        } else {
          return { done: true, value: undefined };
        } 
      },
      return() {
        console.log("提前退出");
        count = limit + 1;
        return { done: true, value: undefined };
      }
  	};
  } 
}

const counter = new Counter(10);
const iterator = counter[Symbol.iterator]();
for (const value of counter) {
  console.log(value); // 只打印 1 2 3
  if (value >= 3) {
    iterator.return();
v  }aluez
}
```

当 value 等于 3 时，迭代器调用 `return()` 方法，将 `count` 设置为 `limit + 1`，关闭迭代器。

**调用迭代器的 `return()` 方法，并不保证关闭迭代器。是否关闭迭代器取决于 `return()` 方法的内部逻辑**。例如上面的例子，如果没有设置 ` count = limit + 1`，迭代器就不会关闭。

在下面的情况下，会自动调用迭代器的 `return()` 方法

- for...of 循环中通过 break、continue、return 或者 throw 提前退出循环
- 解构操作并未消费所有的值

## 生成器

### 生成器函数

函数名称前面加一个星号（*）表示这个函数是一个生成器函数

```js
function* generatorFn() {}
```

这个星号（*）不受两侧空格的影响。

### 生成器

调用生成器函数，产生一个生成器对象，简称生成器。

生成器既是可迭代对象，又是迭代器。作为可迭代对象，它的迭代器就是自己。

```js
const generator = generatorFn();
generator[Symbol.iterator]() === generator; // true
```

生成器函数一开始处于暂停执行的状态，只会在生成器初次调用 `next()` 方法后，才开始执行。

```js
function* generatorFn() {
  console.log("foobar");
  return "foo";
}

// 这个时候不会打印"foobar"
const generator = generatorFn(); 
// 这个时候才打印"foobar"
const { done, value } = generator.next();
// 返回值 { done: true,  value: foo }
```

生成器函数执行时，如果没有遇到 `yield` 中断，中间不会停留，调用一次 `next()` 就会让生成器到达 `done: true` 状态，同时函数的返回值作为 `value` 的值，如果没有返回值，则 `value` 为 `undefined`.

### yield

生成器函数只有和 `yield ` 语句一起使用才有意义。当生成器函数碰到 `yield` 语句时会暂停执行，`yield` 后面带的 `value` 作为生成器 `next()` 方法的返回值 `{ value }`。停止执行的生成器函数只能通过在生成器上调用 `next()` 方法来恢复执行。

```js
function* generatorFn() {
  yield 1;
  yield 2;
  yield 3;
  return "finished"
}
const generator = generatorFn()
console.log(generator.next()) // { done: false,  value: 1 }
console.log(generator.next()) // { done: false,  value: 2 }
console.log(generator.next()) // { done: false,  value: 3 }
console.log(generator.next()) // { done: true,  value: finished }
console.log(generator.next()) // { done: true,  value: undefined }
```

#### yield 实现输入

`yield` 语句也是有返回值，上一次让生成器函数暂停执行的 `yield` 会接收使其恢复执行的 `next()` 函数的第一个参数作为返回值。 

```js
function* generatorFn(initial) { 
  console.log(initial); 
  console.log(yield); 
  console.log(yield);
}

const generatorObject = generatorFn('foo');
generatorObject.next('bar'); // 打印 foo
generatorObject.next('baz'); // 打印 baz 
generatorObject.next('qux'); // 打印 qux
```

### yield*

生成器函数通过使用 `yield* 可迭代对象`，让它能够迭代一个可迭代对象，但是一次只产生一个值。

```js
function* generatorFn() {
  yield* [1, 2, 3]; 
  yield* [4, 5, 6];
}
for (const x of generatorFn()) { 
   console.log(x); // 1 2 3 4 5 6
}
```

#### 递归算法

`yield*` 可以迭代可迭代对象，而生成器就是一个可迭代对象，所以可以使用 `yield*` 实现递归算法

```js
function* nTimes(n) { 
  if (n > 0) {
    yield* nTimes(n - 1);
    yield n - 1;
  } 
}

for (const x of nTimes(3)) { 
   console.log(x); // 0 1 2
}
```

### 生成器作为可迭代对象的迭代器

因为生成器也是迭代器，所以生成器非常适合作为可迭代对象的迭代器，上面的例子可以改成下面这样，这种方式更加简洁

```js
class Counter { 
  constructor(limit) {
  	this.limit = limit; 
  }
  *[Symbol.iterator]() {
  	for (let count = 1; count <= this.limit; count++) {
      yield count
    }
  } 
}

const counter = new Counter(3);
const iterator = counter[Symbol.iterator](); // 生成器
let {done, value } = iterator.next();
while (done === false) {
  console.log(value); // 1 2 3
  ({done, value } = iterator.next());
}
```

### 提前关闭生成器

生成器自带了 `return()` 和 `throw()` 方法，调用生成器 `return()` 方法，将关闭生成器，且无法恢复。

```js
function* generatorFn() {
  for (const x of [1, 2, 3]) {
    yield x;
  }
}

const g = generatorFn();
console.log(g.next());    // { done: false, value: 1 }
console.log(g.return(4)); // { done: true, value: 4 }
console.log(g.next());    // { done: true, value: undefined } 
```

 `throw()` 方法会在暂停的时候将一个提供的错误注入到生成器中，如果生成器函数没有捕获错误，生成器将关闭。

 ```js
 function* generatorFn() {
   for (const x of [1, 2, 3]) {
 		yield x; 
   }
 }
 const g = generatorFn();
 console.log(g.next());    // { done: false, value: 1 }
 try {
 	g.throw('foo'); 
 } catch (e) {
 	console.log(e); // foo 
 }
 console.log(g.next());    // { done: true, value: undefined }
 ```

但是如果生成器函数内部处理了这个错误，那么生成器就不会关闭，而且可以恢复执行，错误处理会跳过对应的 `yield`.

```js
function* generatorFn() {
  for (const x of [1, 2, 3]) {
		try {
      yield x;
    } catch(e) {}
  }
}
const g = generatorFn();
console.log(g.next());    // { done: false, value: 1 }
try {
	g.throw('foo'); // 这个函数的返回值是 { done: false, value: 2 }
} catch (e) {
	console.log(e); // 不会执行到这里
}
console.log(g.next());  // { done: false, value: 3 }
```

如果生成器函数还没有开始执行，那么调用  `throw()` 方法抛出的错误不会在函数内部被捕获，将直接导致生成器关闭.

```js
function* generatorFn() {
  for (const x of [1, 2, 3]) {
		try {
      yield x;
    } catch(e) {}
  }
}
const g = generatorFn();
try {
	g.throw('foo'); 
} catch (e) {
	console.log(e); // foo
}
console.log(g.next());  // { done: true, value: undefined }
```

## 异步迭代器和生成器

请参考 [Asynchronous Iteration](https://www.joylearn123.com/2022/04/09/what-s-new-ecmascript/#asynchronous-iteration)

## References

- Professional Javascript for Web Developers
- [Iterators and generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators)

- [Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)
- [Asynchronous Iteration](https://www.joylearn123.com/2022/04/09/what-s-new-ecmascript/#asynchronous-iteration)