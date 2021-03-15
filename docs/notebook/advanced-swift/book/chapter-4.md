---
layout: NotebookLayout
pageClass: index-page
---
# 第4章 可选值
[[toc]]
### 一些有意思的语法

```swift
// x?是.Some(x)的缩写
var array = ["one","two","three"] 
switch array.index(of: "four") { 
  case let idx?: array.remove(at: idx) 
  case nil: break
}

for case let i? in maybeInts { ... }
for case nil in maybeInts { ... }
```

```swift
let j = 5 
if case 0..<10 = j { ... }
```

if case/for case/switch case 使用 **~=** 运算符重载 

```swift
struct Pattern {
  let s: String
  init(_ s: String) { self.s = s }
}
func ~=(pattern: Pattern, value: String) -> Bool { 
	return value.range(of: pattern.s) != nil
}
let s = "Taylor Swift"
if case Pattern("Swift") = s { ... }
```

```swift
struct Person { 
  var name: String 
  var age: Int
}
var optionalLisa: Person? = Person(name: "Lisa Simpson", age: 8)
optionalLisa?.age += 1 // 注意！
```

请注意 a = 10 和 a? = 10 的细微不同。前一种写法无条件地将一个新值赋给变量，而后一种写法只在 a 的值在赋值发生前不是 nil 的时候才生效。

### a ?? b ?? c 和 (a ?? b) ?? c 的区别

对于一层可选值他们是一样的，但是对于双层嵌套可选值就不一样了

```swift
let s1: String?? = nil // nil
(s1 ?? "inner") ?? "outer" // inner
let s2: String?? = .some(nil) // Optional(nil) 
(s2 ?? "inner") ?? "outer" // outer
```

### 一些运算符

[Optional](https://github.com/cp3hnu/Advanced-Swift/blob/master/Utils/Optional.swift)