---
pageClass: blog-page
title: TypeScript 学习笔记
tags: 
  - web
  - typescript
  - javascript
date: 2022-08-06
author: cp3hnu
location: ChangSha
summary: TypeScript 具有类型系统，是 JavaScript 的超集，它可以编译成普通的 JavaScript 代码。本文将列出 TypeScript 语法清单，以便使用的时候能快速查找。
---

# TypeScript 学习笔记

## 安装 & 编译

```sh
$ npm install -g typescript
$ tsc hello.ts
```

## Primitives

TypeScript 提供 7 个 primitive 类型，对应 JavaScript 的 primitive 类型

- `string`
- `number`
- `boolean`
- `null`
- `undefined`
- `symbol`
- `bigint`

## 其它类型

`any` 表示所有的类型

`unknown` 表示任何类型，和 `any` 的区别是不能对 `unknown` 类型的数据做操作

`void` 表示函数没有返回值

`never` 用于函数返回值类型时，表示函数从来没有返回，而是抛异常；也表示不可能的类型

`object` 表示泛型对象，Typescript 可以定义具体的对象类型

`Function` 表示泛型函数，Typescript 可以定义具体的函数类型

数组类型使用 `类型[]` 表示，比如字符串数组：`string[]`，也可以使用泛型 `Array<string>`

## Type Annotations

类型标注

### 变量

```typescript
let myName: string = "Alice";
```

### 函数参数与返回值

```typescript
function greet(name: string): string {
  return "Hello, " + name.toUpperCase() + "!!"
}
```

Typescript 支持类型推断

```typescript
let myName = "Alice";
```

Typescript 可以推断出 `myName` 是 `string` 类型

## Union Types

组合类型

```typescript
function printId(id: number | string) {
  console.log("Your ID is: " + id);
}
```

## Object Types

对象类型

```typescript
function printCoord(pt: { x: number; y: number }) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}
```

## Type Aliases

类型别名

```typescript
type UserInputSanitizedString = string; // Primitives 别名
type ID = number | string; // Union Types 别名
type Point = { // Object Types 别名
  x: number;
  y: number;
};
type GreetFunction = (a: string) => void; // 函数类型别名
```

## Interfaces

接口

```typescript
interface Point {
  x: number;
  y: number;
}
```

### Type Aliases VS Interfaces

`Type Aliases` 和 `Interfaces` 非常类似，在很多场景这两种都可以使用，除了 `Interfaces` 可以重新打开添加新的属性，而 `Type Aliases` 则不行。

```typescript
interface User {
  name: string
}

interface User {
  age: number
}
```

使用 `Type Aliases` 将会报错

```typescript
type User = {
  name: string
}

type User = {
  age: number
}

 // Error: Duplicate identifier 'User'.
```

`Type Aliases` 和 `Interfaces` 都可以扩展，只是语法不一样

`Interfaces` 使用 `extends`

```typescript
interface Animal {
  name: string
}

interface Bear extends Animal {
  honey: boolean
}

const bear = getBear() 
bear.name
bear.honey
```
`Type Aliases` 使用连接符 `&`

```typescript
type Animal = {
  name: string
}

type Bear = Animal & { 
  honey: boolean 
}

const bear = getBear();
bear.name;
bear.honey;
```

## Type Assertions

`Type Assertions` 使用 `as` 确定更加具体的类型，比如确定一个类型的子类

```typescript
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
// 或者
const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas");
```

如果 Typescript 不允许你使用 `as` 转换，你可以先转换成 `any` 类型

```typescript
const a = (expr as any) as T;
```

## Literal Types

字面类型

```typescript
const constantString = "Hello World";
```

`constantString` 的推断类型是 `const constantString: "Hello World"`

字面类型一般结合 `Union Types` 使用

```typescript
function printText(s: string, alignment: "left" | "right" | "center") {
  // ...
}
printText("Hello, world", "left");
printText("G'day, mate", "centre"); // error
```

字面类型与 primitive 类型是不一致的

```typescript
function handleRequest(url: string, method: "GET" | "POST") {}

const req = { url: "https://example.com", method: "GET" };
handleRequest(req.url, req.method); //error
```

解决方法

```typescript
// 方法一
const req = { url: "https://example.com", method: "GET" as "GET" };
// 方法二
handleRequest(req.url, req.method as "GET");
// 方法三
const req = { url: "https://example.com", method: "GET" } as const;
```

方法三中的 `as const` 将 `req` 所有属性声明为字面类型

```typescript
{
  readonly url: "https://example.com";
  readonly method: "GET";
}
```

## Enums

枚举类型，支持 `number` 和 `string`

### Number 枚举类型

```typescript
enum Direction {
  Up = 1, // 默认从 0 开始，自增 1
  Down,
  Left,
  Right,
}
```

### String 枚举类型

```typescript
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}
```

### 枚举成员作为字面类型

枚举类型的值可以作为字面类型，例如

```typescript
enum ShapeKind {
  Circle,
  Square,
}
 
interface Circle {
  kind: ShapeKind.Circle;
  radius: number;
}
 
interface Square {
  kind: ShapeKind.Square;
  sideLength: number;
}
```

### `keyof` `typeof` 

`keyof typeof` 得到所有 enum key 组成的 `Union Types`

```typescript
enum LogLevel {
  ERROR,
  WARN,
  INFO,
  DEBUG,
}
type LogLevelStrings = keyof typeof LogLevel;
// type LogLevelStrings = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
```

### `typeof` 

得到变量、对象属性的类型，比如

```typescript
let x = { a: 1, b: 2, c: 3, d: 4 };
type ObjectTypes = typeof x;
/*
type ObjectTypes = {
    a: number;
    b: number;
    c: number;
    d: number;
}
*/
```

### `keyof`

 得到对象类型中所有 key name 组成的 `Union Types`

```typescript
type ObjectTypes = keyof typeof x;
// type ObjectTypes = "a" | "b" | "c" | "d"
```

### Const Enums

```typescript
enum Direction {
  Up = 1,
  Down,
  Left,
  Right,
}

let direction = Direction.Up;
```

一般的枚举转换成 js 时是这样的

```js
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 1] = "Up";
    Direction[Direction["Down"] = 2] = "Down";
    Direction[Direction["Left"] = 3] = "Left";
    Direction[Direction["Right"] = 4] = "Right";
})(Direction || (Direction = {}));

let direction = Direction.Up;
```

`Const Enums` 使用内联值

```typescript
const enum Direction {
  Up = 1,
  Down,
  Left,
  Right,
}

let direction = Direction.Up;
```

转换成 js 时是这样的

```js
let direction = 1 /* Direction.Up */;
```

### 使用 Objects 代替 Enums

枚举是 TypeScript 少数几个不是 JavaScript 类型扩展的特性之一。意思就是将 ts 文件转成 js 文件时，不是直接删除 ts 里定义的类型，而是修改了代码，例如上面的例子。如果不想要这样的结果，可以使用 object 代替 enum

```typescript
const ODirection = {
  Up: 0,
  Down: 1,
  Left: 2,
  Right: 3,
} as const;
 
type Keys = keyof typeof ODirection;
// type Keys = "Up" | "Down" | "Left" | "Right"
type Direction = typeof ODirection[Keys];
// type Direction = 0 | 1 | 2 | 3
function run(dir: Direction) {}
run(ODirection.Left);
```

使用这种方式比 `Enums` ，多了一个类型定义，例如：

```typescript
type Direction = typeof ODirection[keyof typeof ODirection];
```

转换出来的 js 是这样的

```js
const ODirection = {
    Up: 0,
    Down: 1,
    Left: 2,
    Right: 3,
};
function run(dir) { }
run(ODirection.Left);
```

使用 Object 没有添加别的代码。

## Optional Properties

在属性后面添加 `？` 表示这个属性是可选属性，即这个属性可能是 `undefined`

```typescript
// last 可能是 `string` 或者 `undefined`
function printName(obj: { first: string; last?: string }) {}
```

## Non-null Assertion Operator

在属性后面添加 `!` 表示这个属性一定不是可选属性，即不会是 `undefined` 和 `null`

```typescript
function liveDangerously(x?: number | null) {
  // No error
  console.log(x!.toFixed());
}
```

## Narrowing

> Typescript looks at these special checks (called *type guards*) and assignments, and the process of refining types to more specific types than declared is called *narrowing*.

将声明的类型细化为更具体类型的过程称为 **narrowing**

```typescript
function padLeft(padding: number | string, input: string) {
  if (typeof padding === "number") {
    // 这个时候 typescript 知道, 在这个分支下 padding 是 number 类型
    return " ".repeat(padding) + input;
  }
  //  在这个分支下 padding 是 string 类型
  return padding + input;
}
```

Narrowing 的方式有：*truthiness*、`typeof`、`in`、`instanceOf`、*equality* ( `===`, `!==`, `==`, and `!= `)、*assignment* ( `=` ) 等

### Type Predicate

定义一个函数，它的返回值是类型断言（type predicate），其格式是 `parameterName is Type`.

```typescript
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

使用这个函数时，就能缩小类型的范围，例如

```typescript
// pet 是 Fish 或者 Bird
let pet = getSmallPet();
 
if (isFish(pet)) {
  // 这个分支下 pet 是 Fish
  pet.swim();
} else {
  // 这个分支下 pet 是 Bird
  pet.fly();
}
```

### Discriminated Unions

当 `Union Types` 中的每个类型都包含相同的字面类型的属性时，通过这个属性，TypeScript 能辨识出具体的类型，例如

```typescript
interface Circle {
  kind: "circle";
  radius: number;
}
 
interface Square {
  kind: "square";
  sideLength: number;
}
 
type Shape = Circle | Square;
```

`Shape` 包含两个类型 `Circle` 和 `Square`，这两个类型都有一个字面类型属性 `kind`，TypeScript 通过分析这个 `kind` 就能分辨出 `Shape` 类型的变量，它的具体类型是 `Circle` 还是 `Square`。

```typescript
function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    // Circle
    return Math.PI * shape.radius ** 2;
  } else {
    // Square
    return shape.sideLength ** 2;
  }
}
```

### `never` type

Narrowing 将 `Union Types` 排除到不可能的类型时，TypeScript 将使用 `never` 类型来表示一个不应该存在的类型，可以用于穷尽性检查（Exhaustiveness checking）。例如

```typescript {9-11}
type Shape = Circle | Square;
 
function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```

如果再添加一种新类型，将会导致 typeScript error:

```typescript
interface Triangle {
  kind: "triangle";
  sideLength: number;
}
 
type Shape = Circle | Square | Triangle;
 
function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      // Type 'Triangle' is not assignable to type 'never'.
      return _exhaustiveCheck;
  }
}
```

## Functions

### Function Type

```typescript
type GreetFunction = (a: string) => void;
// 对象构造函数
type Constructor = new (...args: any[]) => {};
```

### Call Signatures

可调用签名语法，有点像对象类型

```typescript
type DescribableFunction = {
  description: string;
  (someArg: number): boolean;
};

// 或者
interface DescribableFunction {
  description: string;
  (someArg: number): boolean;
};

function doSomething(fn: DescribableFunction) {
  console.log(fn.description + " returned " + fn(6));
}
```

### Construct Signatures

可以作为构造函数，例如 `Date` 类型

```typescript
interface CallOrConstruct {
  new (s: string): Date;
  (n?: number): number;
}
```

### Generic Functions

泛型函数

```typescript
function firstElement<Type>(arr: Type[]): Type | undefined {
  return arr[0];
}
```

#### Call Signatures for Generic Functions

泛型函数的可调用签名语法

```typescript
interface GenericIdentityFn<Type> {
  (arg: Type): Type;
}
function identity<Type>(arg: Type): Type {
  return arg;
}
 
let myIdentity: GenericIdentityFn<number> = identity;
```

#### Specifying Type Arguments

大部分情况下我们调用 generic 函数时不需要指定类型，Typescript 能推断出 `Type` 是什么类型，但是如果 Typescript 不能推断或者推断错误时，我们也可以指定 `Type` 的类型

```typescript
function combine<Type>(arr1: Type[], arr2: Type[]): Type[] {
  return arr1.concat(arr2);
}

// const arr = combine([1, 2, 3], ["hello"]);
// 这种情况 Typescript 推断 Type 是 number 类型，从而导致 ["hello"] 不符合类型要求
// 这种情况我们就需要指定 Type 是 `string | number` 类型
const arr = combine<string | number>([1, 2, 3], ["hello"]);
```

#### Constraints

使用 `extends` 对类型进行约束

```typescript
function longest<Type extends { length: number }>(a: Type, b: Type) {
  if (a.length >= b.length) {
    return a;
  } else {
    return b;
  }
}
```

### Optional Parameters

在参数后面添加 `？` 表示这个参数是可选的

```typescript
function f(x?: number) {
  // ...
}
```

### Function Overloads

Typescript 可以定义多个函数签名和一个函数实现，函数实现的参数必须兼容重载的函数签名。

```typescript
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  } else {
    return new Date(mOrTimestamp);
  }
}
```

## Object Types

### Index Signatures

有时你不知道对象所有属性的名称，但是你知道属性值的类型，你可以使用 `Index Signatures`

```typescript
interface StringArray {
  [index: number]: string;
}
 
const myArray: StringArray = getStringArray();
const secondItem = myArray[1]; // const secondItem: string
```

### Extending Types

使用 `extends` 扩展对象类型

```typescript
interface BasicAddress {
  name?: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}
 
interface AddressWithUnit extends BasicAddress {
  unit: string;
}
```

### Intersection Types

使用 `&` 操作符拼接多种类型

```typescript
interface Colorful {
  color: string;
}
interface Circle {
  radius: number;
}
 
type ColorfulCircle = Colorful & Circle;
```

`ColorfulCircle` 具有 `Colorful` 和 `Circle` 所有的属性

### Generic Object Types

像泛型函数一下，对象类型也支持泛型

```typescript
interface Box<Type> {
  contents: Type;
}

let box: Box<string>;
```

#### `Array`

`Array` 就是一个泛型的对象类型，表示数组类型

```typescript
interface Array<Type> {
  ...
}
```

在 Typescript 里 `number[]` 等价于 `Array<number>`

#### `ReadonlyArray`

`ReadonlyArray` 也是一个泛型的对象类型，表示数组的内容不能改变，而不是变量不能重新赋值，这一点与 `const`、`readonly` 是有区别的

在 Typescript 里 `readonly number[]` 等价于 `ReadonlyArray<number>`

### Tuple Types

元组类型是一种具体的 Array 类型，确定了数组中元素的个数以及每个元素的类型

```typescript
type StringNumberPair = [string, number];
```

## Type Manipulation

### Indexed Access Types

Typescript 使用 `Type[propertyName]` 获取对象属性的类型

```typescript
type Person = { age: number; name: string; alive: boolean };
type Age = Person["age"];
// type Age = number

type I1 = Person["age" | "name"];
// type I1 = string | number

type I2 = Person[keyof Person];  
// type I2 = string | number | boolean
```

可以使用 `number` 获取数组元素的类型

```typescript
const MyArray = [
  { name: "Alice", age: 15 },
  { name: "Bob", age: 23 },
  { name: "Eve", age: 38 },
];
 
type Person = typeof MyArray[number];
/*    
type Person = {
    name: string;
    age: number;
}
*/
type Age = typeof MyArray[number]["age"];   
//type Age = number
```

### Conditional Types

Typescript 使用 `?:` 运算符选择不同的类型

```typescript
interface Animal {
  live(): void;
}
interface Dog extends Animal {
  woof(): void;
}
 
type ExampleType = Dog extends Animal ? number : string;
```

`Conditional Types` 可以应用于泛型

```typescript
type NameOrId<T extends number | string> = T extends number
  ? IdLabel
  : NameLabel;

function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw "unimplemented";
}
 
let a = createLabel("typescript"); 
// let a: NameLabel
 
let b = createLabel(2.8);
// let b: IdLabel

let c = createLabel(Math.random() ? "hello" : 42);
// let c: NameLabel | IdLabel
```

#### `infer`

在 `Conditional Types` 中的 `true` 分支上可以使用 `infer` 提取类型

```typescript
// 数组的元素类型
type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;

// 函数的返回类型
type GetReturnType<Type> = Type extends (...args: never[]) => infer Return
  ? Return
  : never;
```

#### Distributive

当 `Conditional Types` 作用于泛型时，如果给定的类型是 `Union Types` 时，它们将成为分布（distributive）类型

```typescript
type ToArray<Type> = Type extends any ? Type[] : never;
type StrArrOrNumArr = ToArray<string | number>;
// type StrArrOrNumArr = string[] | number[]
```

如果不想要这种类型，可以使用 `[Type]` ，例如

```typescript
type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;
type StrArrOrNumArr = ToArrayNonDist<string | number>;
// type StrArrOrNumArr = (string | number)[]
```

### Mapped Types

`Mapped Types` 是一种泛型类型，它使用 `PropertyKeys` 的联合（经常通过 `keyof` 创建）迭代其它类型的属性来创建一个类型

```typescript
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};
```

例如下面 `OptionsFlags` 迭代 `FeatureFlags` 的属性，然后将值的类型修改为 `boolean`

```typescript
type FeatureFlags = {
  darkMode: () => void;
  newUserProfile: () => void;
};
 
type FeatureOptions = OptionsFlags<FeatureFlags>;
/*           
type FeatureOptions = {
    darkMode: boolean;
    newUserProfile: boolean;
}
*/
```

#### Mapping Modifiers

`readonly` and `?` 修改类型的可写性和可选性，可使用下面两个前缀符号

- `+`  添加（默认）
- `-`  删除

例如下面删除 `readonly`

```ts
type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property];
};
 
type LockedAccount = {
  readonly id: string;
  readonly name: string;
};
 
type UnlockedAccount = CreateMutable<LockedAccount>;

/*
type UnlockedAccount = {
    id: string;
    name: string;
}
*/
```

#### Key Remapping

通过 `as` 可以修改属性名称

```typescript
type MappedTypeWithNewProperties<Type> = {
    [Properties in keyof Type as NewKeyType]: Type[Properties]
}
```

例如下面将属性 `name` 改成 `getName` 的函数

```typescript
type Getters<Type> = {
    [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property]
};
 
interface Person {
    name: string;
    age: number;
    location: string;
}
 
type LazyPerson = Getters<Person>;
/*         
type LazyPerson = {
    getName: () => string;
    getAge: () => number;
    getLocation: () => string;
}
*/
```

### Template Literal Types

可以像 JavaScript 字符串模板一样定义类型

```typescript
type World = "world";
type Greeting = `hello ${World}`;
// type Greeting = "hello world"
```

对于 `Union Types` 使用 `Template Literal Types` 定义类型时，将产生两个类型的的笛卡尔积

```typescript
type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";
 
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;       
// type AllLocaleIDs = "welcome_email_id" | "email_heading_id" | "footer_title_id" | "footer_sendoff_id"
```

# Classes

```typescript
class Point {
  // 属性
  x: number
  y: number
  // 构造函数
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y
  }
  // 方法
  descrption() {
    console.log(`${this.x}, ${this.y}`);
  }
}
 
const pt = new Point(4,5);
console.log(`${pt.x}, ${pt.y}`);
```

### readonly

`readonly` 表示属性只读，只能在构造函数里面修改 `readonly` 的属性

```typescript
class Greeter {
  readonly name: string = "world";

  constructor(otherName: string) {
    this.name = otherName;
  }
}
```

### `implements`

通过 `implements` 实现接口定义

```typescript
interface Pingable {
  ping(): void;
}
 
class Sonar implements Pingable {
  ping() {
    console.log("ping!");
  }
}
```

### `extends`

通过 `extends` 实现类继承

```typescript
class Animal {
  move() {
    console.log("Moving along!");
  }
}
 
class Dog extends Animal {
  woof(times: number) {
    for (let i = 0; i < times; i++) {
      console.log("woof!");
    }
  }
}

const d = new Dog();
// Base class method
d.move();
// Derived class method
d.woof(3);
```

### Member Visibility

Typescript 像很多语言一样定义 `public`、`protected`、`private` 3个层次的访问性，默认是 `public`。Typescript 中定义的 `protected`、`private` 都是编译时的类型检查，不影响编译出来的 JavaScript 代码，所以它们称为 *soft private*。而 JavaScript 中的 [private fields](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields) (`#`) 称为 *hard private*。

|        | public | protected | private |
| ------ | ------ | --------- | ------- |
| 类定义 | 能     | 能        | 能      |
| 子类   | 能     | 能        | 不能    |
| 实例   | 能     | 不能      | 不能    |

#### 暴露 `protected`

子类能重载父类的 `protected` 成员为 `public` 成员

> 子类不能重载父类的 `private` 成员为 `public` 成员

```typescript
class Base {
  protected m = 10;
}
class Derived extends Base {
  // No modifier, so default is 'public'
  m = 15;
}
const d = new Derived();
console.log(d.m); // OK
```

#### Cross-instance 访问 `private` 成员

TypeScript 允许 cross-instance 访问 `private` 成员。即在类方法中可以访问相同类实例的 `private` 成员。

```typescript
class A {
  private x = 10;
 
  public sameAs(other: A) {
    // No error
    return other.x === this.x;
  }
}
```

### Static Members

使用 `static` 标记为类静态成员

```typescript
class MyClass {
  static x = 0;
  static printX() {
    console.log(MyClass.x);
  }
}
console.log(MyClass.x);
MyClass.printX();
```

静态成员也有 `public`、`protected`、`private` 三个层次的访问性，也可以被继承。JavaScript 的 Function 属性/方式 (`name`、`length`、`call`) 不能被定义为 `static` 成员。

### Generic Classes

Typescript 中 `class` 也支持泛型

```typescript
class Box<Type> {
  contents: Type;
  constructor(value: Type) {
    this.contents = value;
  }
}
 
const b = new Box("hello!");
```

#### `this` 参数

TypeScript 会检查带 `this` 参数的函数调用是是否在正确的上下文中完成。

```typescript
class MyClass {
  name = "MyClass";
  getName(this: MyClass) {
    return this.name;
  }
}
const c = new MyClass();
// OK
c.getName();
 
const g = c.getName;
// Error, would crash
g()
```

#### `this` 类型

TypeScript 使用 `this` 表示当前类型，这在类继承中用来表示派生类。 

```typescript
class Box {
  contents: string = "";
  set(value: string) {
    this.contents = value;
    return this;
  }
}

class ClearableBox extends Box {
}
 
const a = new ClearableBox();
const b = a.set("hello");
// const b: ClearableBox
```

#### `this is Type`

TypeScript 可以使用 `this is Type` 实现类型 `Narrowing`

```typescript
class FileSystemObject {
  isFile(): this is FileRep {
    return this instanceof FileRep;
  }
  isDirectory(): this is Directory {
    return this instanceof Directory;
  }
  constructor(public path: string, private networked: boolean) {}
}
class FileRep extends FileSystemObject {
  constructor(path: string, public content: string) {
    super(path, false);
  }
}
class Directory extends FileSystemObject {
  children: FileSystemObject[];
}

const fso: FileSystemObject = new FileRep("foo/bar.txt", "foo");
if (fso.isFile()) {
  // const fso: FileRep
} else if (fso.isDirectory()) {
  //const fso: Directory
}
```

### Parameter Properties

Typescript 提供了一个特别的构造函数语法，直接将构造函数的参数赋值给类属性。只需在构造函数参数前面添加 `public`、`protected`、`private`、`readonly` 修饰符

```typescript
class Params {
  constructor(
    public readonly x: number,
    protected y: number,
    private z: number
  ) {
    // No body necessary
  }
}
const a = new Params(1, 2, 3);
console.log(a.x);
```

### `abstract` 类

Typescript 支持虚基类，不能实例化虚基类

```typescript
abstract class Base {
  abstract getName(): string;
}

class Derived extends Base {
  getName() {
    return "world";
  }
}

const d = new Derived();
d.printName();
// Error
const b = new Base();
```

## Modules

Typescript 支持导入/导出类型

```typescript {9}
// @filename: animal.ts
export type Cat = { breed: string; yearOfBirth: number };
export interface Dog {
  breeds: string[];
  yearOfBirth: number;
}
 
// @filename: app.ts
import { Cat, Dog } from "./animal.js";
type Animals = Cat | Dog;
```

#### `import type`

强制导入的是类型

```typescript {7}
// @filename: animal.ts
export type Cat = { breed: string; yearOfBirth: number };
export type Dog = { breeds: string[]; yearOfBirth: number };
export const createCatName = () => "fluffy";
 
// @filename: app.ts
import type { Cat, Dog, createCatName } from "./animal.js";
export type Animals = Cat | Dog;

// error
const name = createCatName();
```

#### 内联 `type` 导入

为了同时导入类型和值，可以在 `import` 中指定 `type`

```typescript {2}
// @filename: app.ts
import { createCatName, type Cat, type Dog } from "./animal.js";
 
export type Animals = Cat | Dog;
const name = createCatName();
```

## Declaration

### Global Variables

```typescript
declare var foo: number;
declare const foo: number;
declare let foo: number;
```

### Global Functions

```typescript
declare function greet(greeting: string): void;
```

### Classes

```typescript
declare class Greeter {
  constructor(greeting: string);
  greeting: string;
  showGreeting(): void;
}
```

### Interfaces

不需要 `declare`

```typescript
interface GreetingSettings {
  greeting: string;
  duration?: number;
  color?: string;
}
```

### Type Aliases

不需要 `declare`

```typescript
type GreetingLike = string | (() => string) | MyGreeter;
```

### Namespaces

```typescript
declare namespace GreetingLib {
  function makeGreeting(s: string): string;
  let numberOfGreetings: number;
}
```

#### Nested Namespaces

```typescript
declare namespace GreetingLib.Options {
  // Refer to via GreetingLib.Options.Log
  interface Log {
    verbose?: boolean;
  }
  interface Alert {
    modal: boolean;
    title?: string;
    color?: string;
  }
}
```

## References

- [Typescript](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Playground](https://www.typescriptlang.org/play?#code/KYDwDg9gTgLgBAG2PAFsBCIHVoICZwC8cARCgJYkDcQA)
- [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [TSConfig Reference](https://www.typescriptlang.org/tsconfig#)
- [Base TSConfig](https://github.com/tsconfig/bases/)
