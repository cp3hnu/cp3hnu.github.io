# 第3章 集合类型协议
[[toc]]
## 序列 (*Sequence*)

满足 *Sequence* 协议非常简单，只需要提供一个返回 iterator 迭代器的 `makeIterator` 方法

```swift
protocol Sequence {
  associatedtype Element where Self.Element == Self.Iterator.Element
  associatedtype Iterator: IteratorProtocol 
  func makeIterator() -> Iterator
	// ...
}

protocol IteratorProtocol { 
  associatedtype Element 
  mutating func next() -> Element?
}
```

### Example

[Sequence](https://github.com/cp3hnu/Advanced-Swift/blob/master/Utils/Sequence.swift)

### *AnyIterator*

 迭代器一般具有值语义，除了 *AnyIterator*

*AnyIterator* 是一个对别的迭代器进行封装的迭代器，用来将原来的迭代器的具体类型"抹掉"，不具有值语义。

值语义

```swift
var iterator1 = FibsIterator()
print(iterator1.next()) // 0
print(iterator1.next()) // 1
print(iterator1.next()) // 1
var iterator2 = iterator1 
print(iterator1.next()) // 2
print(iterator2.next()) // 2
print(iterator1.next()) // 3
print(iterator2.next()) // 3
```

非值语义

```swift
var iterator1 = FibsIterator()
var anyIterator = AnyIterator(iterator1)
print(anyIterator.next()) // 0
print(anyIterator.next()) // 1
print(anyIterator.next()) // 1
var iterator2 = anyIterator
print(anyIterator.next()) // 2
print(iterator2.next())   // 3
print(anyIterator.next()) // 5
print(iterator2.next())   // 8
```

*AnyIterator* 还有一个初始化方法，那就是直接接受一个 `next` 函数作为参数

```swift
func fibsIterator() -> AnyIterator<Int> { 
  var state = (0, 1)
  return AnyIterator {
    let upcomingNumber = state.0
    state = (state.1, state.0 + state.1)
    return upcomingNumber
  } 
}
```

搭配使用 *AnySequence*，创建序列就非常容易了。

*AnySequence* 提供一个初始化方法，接受返回值为迭代器的函数作为参数。

```swift
let fibsSequence = AnySequence(fibsIterator)
```

### `sequence` 函数

-   `sequence(first:next:)`，将使用第一个参数的值作为序列的首个元素，并使用 `next` 参数传入的闭包生成序列的后续元素，最后返回生成的序列
-   `sequence(state:next)`，因为它可以在两次 `next` 闭包被调用之间保存任意的可变状态，所以它更强大一些

```swift
let fibsSequence = sequence(state: (0, 1)) { (state: inout (Int, Int)) -> Int? in 
  let upcomingNumber = state.0
  state = (state.1, state.0 + state.1)
  return upcomingNumber 
}
```

### 序列与迭代器之间的关系

可以单纯地将迭代器声明为满足 *Sequence* 来将它转换为一个序列，因为 *Sequence* 提供了一个默认的 `makeIterator` 实现，对于那些满足协议的迭代器类型，这个方法将返回 self
 本身。所以我们只需要实现 `next` 方法，就同时支持 *Iterator* 和 *Sequence* 协议。

标准库中的大部分迭代器还是满足了 *Sequence* 协议的

### 链表

[List](https://github.com/cp3hnu/Advanced-Swift/blob/master/Utils/List.swift)

## 集合类型 (*Collection*)

### 队列 (Queue)

[FIFOQueue](https://github.com/cp3hnu/Advanced-Swift/blob/master/Utils/FIFOQueue.swift)

## 遵守 *Collection* 协议

*Collection* 协议有 5 个关联类型

```swift
protocol Collection: Sequence {
  associatedtype Element

  associatedtype Index : Comparable where Self.Index == Self.Indices.Element, Self.Indices.Element == Self.Indices.Index, Self.Indices.Index == Self.SubSequence.Index, Self.SubSequence.Index == Self.Indices.Indices.Element, Self.Indices.Indices.Element == Self.Indices.Indices.Index, Self.Indices.Indices.Index == Self.SubSequence.Indices.Element, Self.SubSequence.Indices.Element == Self.SubSequence.Indices.Index, Self.SubSequence.Indices.Index == Self.SubSequence.Indices.Indices.Element, Self.SubSequence.Indices.Indices.Element == Self.SubSequence.Indices.Indices.Index

  associatedtype Iterator = IndexingIterator<Self>

  associatedtype SubSequence : Collection = Slice<Self> where Self.Element == Self.SubSequence.Element, Self.SubSequence == Self.SubSequence.SubSequence

  associatedtype Indices : Collection = DefaultIndices<Self> where Self.Indices == Self.Indices.SubSequence
}
```

*Collection* 的最小实现

```swift
protocol Collection: Sequence { 
  /// ⼀一个表示集合中位置的类型
  associatedtype Index: Comparable
  /// ⼀一个⾮非空集合中⾸首个元素的位置
  var startIndex: Index { get }
  /// 集合中超过末位的位置---也就是⽐比最后⼀一个有效下标值⼤大 1 的位置 
  var endIndex: Index { get }
  /// 返回在给定索引之后的那个索引值 
  func index(after i: Index) -> Index
  /// 访问特定位置的元素
  subscript(position: Index) -> Element { get } 
}
```

### Indices

它代表对于集合的所有有效下标的索引所组成的集合，并以升序进行排列。

Indices 的默认类型是 `DefaultIndices<Self>`。和 Slice 一样，它是对于原来的集合类型的简单封装，并包含起始和结束索引。它需要保持对原集合的引用，这样才能够对索引进行步进。当用戶在迭代索引的同时改变集合的内容的时候，可能会造成意想不到的性能问题：如果集合是以写时复制 (就像标准库中的所有集合类型所做的一样) 来实现的话，这个对于集合的额外引用 将触发不必要的复制。

如果在为自定义集合提供另外的 Indices 类型作为替换的话，你不需要让它保持对原集合的引用，这样做可以带来性能上的提升。这对于那些计算索引时不依赖于集合本身的集合类型都是有效的，比如数组或者我们 的队列就是这样的例子。

## 索引

[Index](https://github.com/cp3hnu/Advanced-Swift/blob/master/Utils/Index.swift)

## 切片

如果你在通过集合类型的 indices 进行迭代时，修改了集合的内容，那么 indices 所持有的任何对原来集合类型的强引用都会破坏写时复制的性能优化，因为这会造成不必要的复制操作。如果集合的尺寸很大的话，这会对性能造成很大的影响。

要避免这件事情发生，你可以将 for 循环替换为 while 循环，然后手动在每次迭代的时候增加索引值，这样你就不会用到 indices 属性。当你这么做的时候，要记住一定要从 collection.startIndex 开始进行循环，而不要把 0 作为开始。

## 专门的集合类型

-   ***BidirectionalCollection*：**一个既支持前向又支持后向遍历的集合。
-   ***RandomAccessCollection*：**一个支持高效随机存取索引遍历的集合。
-   ***MutableCollection*：**一个支持下标赋值的集合。
-   ***RangeReplaceableCollection*：**一个支持将任意子范围的元素用别的集合中的元素进行替换的集合。

### BidirectionalCollection

```swift
protocol BidirectionalCollection {
  /// 获取前一个索引
  func index(before i: Self.Index) -> Self.Index
}

extension BidirectionalCollection {
  /// 最后一个元素
  var last: Self.Element? { 
    return isEmpty ? nil : self[index(before: endIndex)]
  }
  /// 返回集合中元素的逆序表示⽅方式似乎数组
  /// - 复杂度: O(1)
  public func reversed() -> ReversedCollection<Self> {
    return ReversedCollection(_base: self) 
  }
}
```

*ReverseCollection* 不会真的去将元素做逆序操作，而是会持有原来的集合，并且使用逆向的索引。

```swift
extension FIFOQueue: BidirectionalCollection {
  func index(before i: Int) -> Int {
    precondition(i > startIndex)
    return i - 1
  }
}
```

### RandomAccessCollection

*RandomAccessCollection* 提供了最高效的元素存取方式，它能够在常数时间内跳转到任意索引。满足该协议的类型必须能够

1.  以任意距离移动一个索引
2.  测量任意两个索引之间的距离，两者都需要是 **O(1)**  时间常数的操作

### MutableCollection

单个元素的下标访问方法 `subscript` 现在必须提供一个 `setter`

```swift
extension FIFOQueue: MutableCollection {
  public subscript(position: Int) -> Element { 
    get {
        precondition((0..<endIndex).contains(position), "Index out of bounds") 
        if position < left.endIndex {
          return left[left.count - position - 1] 
        } else {
          return right[position - left.count] 
        }
    } 
    set {
        precondition((0..<endIndex).contains(position), "Index out of bounds") 
        if position < left.endIndex {
          left[left.count - position - 1] = newValue 
        } else {
          return right[position - left.count] = newValue
        } 
     }
   }
}
```

注意编译器不让我们向一个已经存在的 *Collection* 中通过扩展添加下标 `setter` 方法

### RangeReplaceableCollection

```swift
protocol RangeReplaceableCollection {
  /// 一个空的初始化方法，在泛型函数中这很有用，因为它允许一个函数创建相同类型的新的空集合
  init()
  /// 它接受一个要替换的范围以及一个用来进行替换的集合
  mutating func replaceSubrange<C>(_ subrange: Range<Self.Index>, with newElements: C) where C : Collection, Self.Element == C.Element
}
```

遵守 *RangeReplaceableCollection* 协议，将自动获得以下功能

-   `append(_:)` 和 `append(contentsOf:)` 将 endIndex..<endIndex (也就是说末尾的空范围) 替换为单个或多个新的元素。
-   `remove(at:)` 和 `removeSubrange(_:)` 将 i...i 或者 subrange 替换为空集合。
-   `insert(at:)` 和 `insert(contentsOf:at:)` 将 i..<i (或者说在数组中某个位置的空范围)替换为单个或多个新的元素。
-   `removeAll` 将 startIndex..<endIndex 替换为空集合。

```swift
extension FIFOQueue: RangeReplaceableCollection {
  mutating func replaceSubrange<C: Collection>(_ subrange: Range<Int>, with newElements: C) where C.Element == Element {
    right = left.reversed() + right
    left.removeAll()
    right.replaceSubrange(subrange, with: newElements)
  }
}
```
