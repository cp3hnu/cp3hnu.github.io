# 第11章 协议

[[toc]]

协议允许我们进行动态派生，在运行时程序会根据消息接受者的类型去选择正确的方式实现。

普通的协议可以被当作类型约束使用，也可以当作独立的类型使用。带有关联类型或者 Self 约束的协议不能当作独立的类型使用。

在面向对象编程中，子类是在多个类之间共享代码的有效方式，Swift 面向协议的编程，通过协议和协议扩展来实现代码共享。

协议要求的方式是动态派发的，而仅定义在扩展中的方式是静态派发的。

## 类型抹消

### 方法1

1.  创建一个名为 AnyProtocolName 的结构体或者类。
2.  对于每个关联类型，我们添加一个泛型参数。
3.  对于协议的每个方法，我们将其实现存储在 AnyProtocolName 中的一个属性中。
4.  我们添加一个将想要抹消的具体类型泛型化的初始化方法，它的任务是在闭包中捕获我们传入的对象，并将闭包赋值给上面步骤中的属性。

```swift
// 实现任意迭代器
class AnyIterator<A>: IteratorProtocol { 
  var nextImpl: () -> A?
  init<I: IteratorProtocol>(_ iterator: I) where I.Element == A { 
    var iteratorCopy = iterator
    self.nextImpl = { iteratorCopy.next() }
  }

  func next() -> A? { 
    return nextImpl()
  } 
}

let iter: AnyIterator<Int> = AnyIterator<Int>(ConstantIterator())
```

### 方法2

使用类继承的方式，来把具体的迭代器类型隐藏在子类中，同事面向客户端的类仅仅只是对元素类型的泛型化类型。标准库也是采用这个策略。

```swift
// 实现任意迭代器
class IteratorBox<Element>: IteratorProtocol { 
  func next() -> Element? {
    fatalError("This method is abstract.") 
  }
}

class IteratorBoxHelper<I: IteratorProtocol>: IteratorBox<I.Element> { 
  var iterator: I
  init(_ iterator: I) {
    self.iterator = iterator 
  }
  
  override func next() -> I.Element? { 
    return iterator.next()
  }
}

let iter: IteratorBox<Int> = IteratorBoxHelper(ConstantIterator())
```

## 带有 Self 的协议

== 运算符被定义为了类型的静态函数。换句话说，它不是成员函数，对该函数的调用将被静态派发。

## 协议内幕

当我们通过协议类型创建一个变量的时候，这个变量会被包装到一个叫做**存在容器**的盒子中

```swift
func f<C: CustomStringConvertible>(_ x: C) -> Int { 
  return MemoryLayout.size(ofValue: x)
}

func g(_ x: CustomStringConvertible) -> Int {
  return MemoryLayout.size(ofValue: x) 
}
f(5) // 8 
g(5) // 40
```

因为 f 接受的是泛型参数，整数 5 会被直接传递给这个函数，而不需要经过任何包装。所以它的大小是 8 字节，也就是 64 位系统中 Int 的尺寸。

对于 g，整数会被封装到一个存在容器中。对于普通的协议 (也就是没有被约束为只能由 class 实现的协议)，会使用**不透明存在容器** (opaque existential container)。不透明存在容器中含有一个存储值的缓冲区 (大小为三个指针，也就是 24 字节)；一些元数据 (一个指针，8 字节)；以及若干个目击表 (0 个或者多个指针，每个 8 字节)。如果值无法放在缓冲区里，那么它将被存储到堆上，缓冲区里将变为存储引用，它将指向值在堆上的地址。元数据里包含关于类型的信息 (比如是否能够按条件进行类型转换等)。

目击表是让动态派发成为可能的关键。它为一个特定的类型将协议的实现进行编码：对于协议中的每个方法，表中会包含一个指向特定类型中的实现的入口。有时候这被称为 vtable。

如果方法不是协议定义的一部分 (或者说，它不是协议所要求实现的内容，而是扩展方法)，所以它也不在目击表中。因此，编译器除了静态地调用协议的默认实现以外，别无选择。

不透明存在容器的尺寸取决于目击表个数的多少，每个协议会对应一个目击表。举例来说， Any 是空协议的类型别名，所以它完全没有目击表

```swift
typealias Any = protocol<> 
MemoryLayout<Any>.size // 32
```

如果我们合并多个协议，每多加一个协议，就会多 8 字节的数据块。所以合并四个协议将增加 32 字节

```swift
protocol Prot { }
protocol Prot2 { }
protocol Prot3 { }
protocol Prot4 { }
typealias P = Prot & Prot2 & Prot3 & Prot4
MemoryLayout<P>.size // 64
```

对于只适用于类的协议 (也就是带有 SomeProtocol: class 或者 @objc 声明的协议)，会有一个叫做**类存在容器**的特殊存在容器，这个容器的尺寸只有两个字⻓ (以及每个额外的目击表增加一个字⻓)，一个用来存储元数据，另一个 (而不像普通存在容器中的三个) 用来存储指向这个类的一个引用

```swift
protocol ClassOnly: AnyObject {} 
MemoryLayout<ClassOnly>.size // 16
```

从 Objective-C 导入 Swift 的那些协议不需要额外的元数据。所以那些类型是 Objective-C 协议的变量不需要封装在存在容器中；它们在类型中只包含一个指向它们的类的指针

```swift
MemoryLayout<NSObjectProtocol>.size // 8 
```
