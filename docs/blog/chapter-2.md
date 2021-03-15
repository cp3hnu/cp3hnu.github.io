---
title: 内建集合类型
tags: 
  - Swift
  - Apple
date: 2016-10-20
author: cp3hnu
location: ChangSha
summary: build-in collection type
---



# 第2章 内建集合类型

[[toc]]
## 数组

### 扩展

[Array](https://github.com/cp3hnu/Advanced-Swift/blob/master/Utils/Array.swift)

### 切片

```swift
let fibs = [0, 1, 1, 2, 3, 5]
let slice = fibs[1...]
slice // [1, 1, 2, 3, 5]
type(of: slice) // ArraySlice<Int>
```

**要点**

1.  切片类型只是数组的一种表示方式，它背后的数据仍然是原来的数组，只不过是用切片的方式来进行表示，slice 共享 fibs 数组。
2.  访问 slice 里的数据不能从 0开 始，而是从 slice.startIndex 开始，到 slice.endIndex 结束。访问 0 可能导致崩溃。
3.  改变 fibs 时，slice 不受影响。我估计改变 fibs 或者 slice，**写时复制**。

```swift
var fibs = [0, 1, 1, 2, 3, 5]
var slice = fibs[1...] // [1, 1, 2, 3, 5]
fibs[2] = [11]
fibs.remove(at: 3) // [1, 1, 2, 3, 5] 
slice[slice.startIndex] = 10 // [10, 1, 2, 3, 5] 
slice[0] // 越界崩溃
```

## 字典

### *Hashable*

```swift
protocol Hashable: Equatable {
  func hash(into hasher: inout Hasher)
}
```

**自动实现(同样适用于 *Equatable* )**

1.  对于 **struct**，所有的存储属性 conform to *Hashable*
2.  对于 **enum**，所有的 associated value conform to *Hashable*
3.  对于 **enum**，如果没有 associated value，不需要声明就自动 conform to *Hashable*
4.  **class** 需要手动实现
5.  两个同样的实例 (== 定义相同)，必须拥有同样的哈希值。不过反过来，两个相同哈希值的实例不一定需要相等

```swift
class Point: Hashable {
  let x: Int
  let y: Int
    
  init(x: Int, y: Int) {
    self.x = x
    self.y = y
  }
    
  static func == (lhs: Point, rhs: Point) -> Bool {
    return lhs.x == rhs.x && lhs.y == rhs.y
  }
    
  func hash(into hasher: inout Hasher) {
    hasher.combine(x)
    hasher.combine(y)
  }
}
```

## Set

1.  和 Dictionary 一样，Set 也是通过哈希表实现的，并拥有类似的性能特性和要求。测试集合中是 否包含某个元素是一个常数时间的操作，和字典中的键一样，集合中的元素也必须满足 *Hashable*
2.  Set 遵守 *ExpressibleByArrayLiteral* 协议
3.  使用 Set 的场景：
    -   高效地测试某个元素是否存在于序列中；
    -   保证序列中不出现重复元素；
    -   集合操作，交集、并集
4.  *SetAlgebra* 协议
5.  *IndexSet* 和 *CharacterSet*
6.  既保证有序又保证唯一性

```swift
extension Sequence where Element: Hashable {
  func unique() -> [Element] {
    var seen: Set<Element> = []
    return filter { element in
      if seen.contains(element) {
        return false
      } else {
        seen.insert(element)
        return true
      }
    }
  }
}
```

### IndexSet

IndexSet 表示了一个由正整数组成的集合。当然，你可以用 `Set<Int>` 来做这件事，但是 IndexSet 更加高效，因为它内部使用了**一组范围列表**进行实现。

```swift
var indices = IndexSet()
indices.insert(integersIn: 1..<5)
indices.insert(integersIn: 11..<15)
let evenIndices = indices.filter { $0 % 2 == 0 } // [2, 4, 12, 14]
```

### CharacterSet

CharacterSet 是一个高效的存储 Unicode 码点 (code point) 的集合。

## Range

半开范围 Range: ..<，只有半开范围能表示空间隔，例如 5..<5

闭合访问 ClosedRange: …，只有闭合范围能包括最大值

元素 confirm to *comparable *协议

ClosedRange 和 Range 不能相互转换

### 可数范围

CountableRange 和 CountableClosedRange

```swift
typealias CountableRange<Bound> = Range<Bound> where Bound : Strideable, Bound.Stride : SignedInteger

typealias CountableClosedRange<Bound> = ClosedRange<Bound> where Bound : Strideable, Bound.Stride : SignedInteger
```

元素 confirm to *Strideable* 协议，步长是 SignedInteger 类型

```swift
extension Range : Sequence where Bound : Strideable, Bound.Stride : SignedInteger {}

extension Range : Collection, BidirectionalCollection, RandomAccessCollection where Bound : Strideable, Bound.Stride : SignedInteger {}

extension ClosedRange : Sequence where Bound : Strideable, Bound.Stride : SignedInteger {}

extension ClosedRange : Collection, BidirectionalCollection, RandomAccessCollection where Bound : Strideable, Bound.Stride : SignedInteger {}
```

因为 *Strideable* 协议，使得 CountableRange 和 CountableClosedRange 支持 *Sequence*、*Collection*、*BidirectionalCollection *以及 *RandomAccessCollection* 协议

因为 *Sequence* 协议，所有可以迭代

```swift
for i in 0..<10 {}
```

因为 *RandomAccessCollection* 协议，所有通过索引访问元素

```swift
let range = 1..<10
range[range.startIndex] // 1
```

range.startIndex 的类型是 Int，但是 range.startIndex 不是从 0 开始

如果你想要对连续的浮点数值进行迭代的话，你可以通过使用 `stride(from:to:by)` 和 `stride(from:through:by)` 方法来创建序列用以迭代

```swift
func stride<T>(from start: T, to end: T, by stride: T.Stride) -> StrideTo<T> where T : Strideable
extension StrideTo : Sequence {}

for radians in stride(from: 0.0, to: .pi * 2, by: .pi / 2) {
  let degrees = Int(radians * 180 / .pi)
  print("Degrees: \(degrees), radians: \(radians)")
}
```

### 部分范围

```swift
let fromA: PartialRangeFrom<Character> = Character("a")...
let throughZ: PartialRangeThrough<Character> = ...Character("z") 
let upto10: PartialRangeUpTo<Int> = ..<10
let fromFive: CountablePartialRangeFrom<Int> = 5...
```

只有 CountablePartialRangeFrom 这一种可数类型

```swift
typealias CountablePartialRangeFrom<Bound> = PartialRangeFrom<Bound> where Bound : Strideable, Bound.Stride : SignedInteger
```

### *RangeExpression*

上述 8 中类型都 confirm to *RangeExpression*

```swift
public protocol RangeExpression {
associatedtype Bound: Comparable
// 某个元素是否被包括在该范围中
func contains(_ element: Bound) -> Bool 
// 给定一个集合类型，它能够计算出表达式所指定的完整的Range，例如array[2..<4]
func relative<C>(to collection: C) -> Range<Bound> where C : Collection, Self.Bound == C.Index 
static func ~= (pattern: Self, value: Self.Bound) -> Bool // switch case中模式匹配
```

**无边界**

array[…]

[Swift 标准库中的一个特殊实现](https://tonisuter.com/blog/2017/08/unbounded-ranges-swift-4/)

```swift
public typealias UnboundedRange = (UnboundedRange_)->()

public enum UnboundedRange_ {
  public static postfix func ... (_: UnboundedRange_) -> () {
    fatalError("uncallable")
  }
}

extension Collection {
  @_inlineable
  public subscript(x: UnboundedRange) -> SubSequence {
    return self[startIndex...]
  }
}
```
