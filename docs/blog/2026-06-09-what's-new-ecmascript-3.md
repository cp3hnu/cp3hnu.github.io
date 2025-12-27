---
pageClass: blog-page
title: ES2024 ~ ES2025 新特性
tags: 
  - web
  - javascript
  - ECMAScript
date: 2026-06-09
author: cp3hnu
location: ChangSha
summary: 学习总结 ECMAScript 从 2024 年到 2025 年引入的新特性
---

# ES2024 ~ ES2025 新特性

接上篇 [ES2021 ~ ES2023 新特性](/2023/06/09/what-s-new-ecmascript-2/)

[这里](https://github.com/tc39/proposals/blob/main/finished-proposals.md) 是 ECMAScript 2024 ~ 2025 所有通过的提案

[这里](https://cp3hnu.github.io/What-s-New-in-ECMAScript/) 是我写的下面这些新特性的 playground，方便查看运行结果

> 使用这些新特性之前，建议用 [CanIUse](https://caniuse.com/)，查一下浏览器的兼容性

> 如果浏览器不支持可以自行 polyfill：[core-js](https://github.com/zloirock/core-js), [Polyfill.io](https://polyfill.io/)

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

- [`toWellFormed()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toWellFormed) 方法，将 [lone surrogates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#utf-16_characters_unicode_code_points_and_grapheme_clusters) 字符替换成 `U+FFFD` 字符（�）

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

## Source Code

[`cp3hnu/What-s-New-in-ECMAScript`](https://github.com/cp3hnu/What-s-New-in-ECMAScript)

## 应用地址

[What-s-New-in-ECMAScript/](https://cp3hnu.github.io/What-s-New-in-ECMAScript/)

## References

- [tc39/finished-proposals](https://github.com/tc39/proposals/blob/main/finished-proposals.md)
- [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [What's New in ES2024](https://pawelgrzybek.com/whats-new-in-ecmascript-2024/)
- [CanIUse](https://caniuse.com/)
- [Compat-Table](https://compat-table.github.io/compat-table/es2016plus/)
- [node.green](https://node.green/)
- [core-js](https://github.com/zloirock/core-js)
- [Polyfill.io](https://polyfill.io/)
- [RegExp `v` flag with set notation and properties of strings](https://v8.dev/features/regexp-v-flag)
