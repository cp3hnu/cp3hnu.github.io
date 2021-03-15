---
layout: NotebookLayout
pageClass: index-page
---
# 第5章 结构体和类
[[toc]]
通过在结构体扩展中自定义初始化方法，我们就可以同时保留原来的初始化方法

`didSet` 对定义在全局的结构体变量也使用

```swift
struct Point {
  var x = 0
  var y = 0
}
var point = Point(x: 10, y: 10) {
  didSet {
    print("didSet")
  }
}
// 赋值的时候，didSet会被触发
point = Point(x: 20, y: 20) 
// 当我们只是改变深入结构体中的某个属性的时候，didSet也会被触发
point.x = 20
```

对结构体进行改变，在语义上来说，与重新 为它进行赋值是相同的。即使在一个更大的结构体上只有某一个属性被改变了，也等同于整个结构体被用一个新的值进行了替代。在一个嵌套的结构体的最深层的某个改变，将会一路向上反映到最外层的实例上，并且一路上触发所有它遇到的 `willSet` 和 `didSet`。

虽然语义上来说，我们将整个结构体替换为了新的结构体，但是一般来说这不会损失性能，编译器可以原地进行变更。由于这个结构体没有其他所有者，实际上我们没有必要进行复制。不过如果有多个持有者的话，重新赋值意味着发生复制。

因为Int 其实也是结构体，所以修改Int变量，`didSet` 也会被触发。

因为标准库中的集合类型是结构体，很自然地它们也遵循同样地工作方式。在数组中添加元素将会触发数组的 `didSet`，通过数组的下标对数组中的某个元素进行变更也同样会触发，更改数组中某个元素的某个属性值也同样会触发。

**VS class**

```swift
class Point {
  var x = 0
  var y = 0
  init(x: Int, y: Int) {
    self.x = x
    self.y = y
  }
}
var point = Point(x: 10, y: 10) {
  didSet {
    print("didSet")
  }
}
// didSet会触发
point = Point(x: 20, y: 20)
// didSet不会触发，point不会发生改变，只是point指向的对象发生了改变
point.x = 20
```

## mutating 的本质是 inout

**mutating **关键字将隐式的 self 参数变为可变的

**+=** 运算符需要左边的参数是 inout

```swift
extension Point {
  static func +=(lhs: inout Point, rhs: Point) {
    lhs = lhs + rhs
  }
}
```

### 使用值类型避免并行 Bug

```swift
class BinaryScanner { 
  var position: Int
  let data: Data 
  init(data: Data) {
    self.position = 0
    self.data = data 
  }
}

extension BinaryScanner { 
  func scanByte() -> UInt8? {
    guard position < data.endIndex else { return nil }
    position += 1
    return data[position-1]
  } 
}

func scanRemainingBytes(scanner: BinaryScanner) {
  while let byte = scanner.scanByte() {
    print(byte) 
  }
}


for _ in 0..<Int.max {
  let newScanner = BinaryScanner(data: Data("hi".utf8))
  DispatchQueue.global().async {
    // 引用相同的newScanner，下标访问可能会越界
    scanRemainingBytes(scanner: newScanner) 
  }
  // 引用相同的newScanner，下标访问可能会越界
  scanRemainingBytes(scanner: newScanner) 
}
```

如果 BinaryScanner 是一个结构体，而非类的话，每次 `scanRemainingBytes` 的调用都将获取它自己的 newScanner 的独立的复制。这样一来，这些调用将能够在数组上保持安全的迭代， 而不必担心结构体被另一个方法或者线程所改变。

## 写时复制

它的工作方式是，每当值被改变，它首先检查它对存储缓冲区的引用是否是唯一的，或者说，检查值本身是不是这块缓冲区的唯一拥有者。如果是，那么缓冲区可以进行原地变更，也不会有复制被进行。不过，如果缓冲区有一个以上的持有者，那么值就需要先进行复制，然后对复制的值进行变化，而保持其他的持有者不受影响。

作为一个结构体的作者，你并不能免费获得写时复制的行为，你需要自己进行实现。当你自己的类型内部含有一个或多个可变引用，同时你想要保持值语义时，你应该为其实现写时复制。为了维护值语义，通常都需要在每次变更时，都进行昂贵的复制操作，但是写时复制技术避免了在非必要的情况下的复制操作。

```swift
// Objective-C的类，isKnownUniquelyReferenced直接返回false，所以需要包装一下
final class Box<A> {
  var unbox: A
  init(_ value: A) { 
	self.unbox = value 
  }
}

struct MyData {
  private var _data: Box<NSMutableData> 
  var _dataForWriting: NSMutableData {
    mutating get {
      if !isKnownUniquelyReferenced(&_data) {
		_data = Box(_data.unbox.mutableCopy() as! NSMutableData) 
		print("Making a copy")
	  }
	  return _data.unbox
    }
  } 
  
  init() {
    _data = Box(NSMutableData()) 
  }
  
  init(_ data: NSData) {
    _data = Box(data.mutableCopy() as! NSMutableData)
  } 
}

extension MyData {
  mutating func append(_ byte: UInt8) {
    var mutableByte = byte
    _dataForWriting.append(&mutableByte, length: 1) 
  }
}
```

## 写时复制陷阱

```swift
final class Empty { } 
struct COWStruct {
  var ref = Empty()
  mutating func change() -> String {
    if isKnownUniquelyReferenced(&ref) {
      return "No copy" 
    } else {
        return "Copy" 
    }
  }
}

/* 
当我们将结构体放到数组中时，我们可以直接改变数组元素，且不需要进行复制。这是因为在使用数组下标访问元素时，我们是直接访问内存的位置
Array 通过使用地址器 (addressors) 的方式实现下标。地址器允许对内存进行直接访问。数组的下标并不是返回元素，而是返回一个元素的地址器。这样一来，元素的内存可以被原地改变，而不需要再进行不必要的复制。
*/
var array = [COWStruct()]
array[0].change() // No copy

/* 
现在字典也采用了和Array一样的处理方式
*/
var dict = ["key": COWStruct()] 
dict["key"]?.change() // No Copy

/*
当你在使用集合或者自己的结构体时，表现就不一样了。比如，我们可以创建一个储存某个值的简单地容器类型，通过直接访问存储的属性，或者间接地使用下标，都可以访问到这个值。
当我们直接访问它的时候，我们可以获取写时复制的优化，但是当我们用下标间接访问的时候，复制会发生:
*/
struct ContainerStruct<A> { 
var storage: A 
subscript(s: String) -> A {
  get { return storage }
  set { storage = newValue } }
}
var d = ContainerStruct(storage: COWStruct()) 
d.storage.change() // No copy 
d["test"].change() // Copy
```

## 闭包

函数也是引用类型

## 内存

值类型不会产生循环引用

```swift
struct Person {
  let name: String
  var parents: [Person]
}
var john = Person(name: "John", parents: [])
john.parents = [john]
john // John, parents:[John,parents:[]]
```

## unowned VS weak

非强引用对象拥有和强引用对象同样或者更⻓的生命周期的话， unowned 引用通常会更方便一些。