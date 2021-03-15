---
layout: NotebookLayout
pageClass: index-page
---
# 第10章 泛型

[[toc]]

非通用方法优先通用方法

当使用操作符重载时，编译器会表现出一些奇怪的行为。即使泛型版本应该是更好的选择的时候，类型检查器也还是会去选择那些非泛型的重载，而不去选择泛型重载。

```swift
precedencegroup ExponentiationPrecedence {
  associativity: left
  higherThan: MultiplicationPrecedence
}

infix operator **: ExponentiationPrecedence
func **(lhs: Double, rhs: Double) -> Double {
  return pow(lhs, rhs)
}

func **(lhs: Float, rhs: Float) -> Float {
  return powf(lhs, rhs)
}

func **<I: BinaryInteger>(lhs: I, rhs: I) -> I {
  let result = Double(Int64(lhs)) ** Double(Int64(rhs))
  return I(result)
}

let intResult =2 ** 3 // 报错
let intResult: Int = 2 ** 3 // 8
```

编译器忽略了整数的泛型重载，因此它无法确定是去调用 Double 的重载还是 Float 的重载，因为两者对于整数字面量输入来说，具有相同的优先级 (Swift 编译器会将整数字面量在需要时自动向上转换为 Double 或者 Float)，所 以编译器报错说存在歧义。要让编译器选择正确的重载，我们需要至少将一个参数显式地声明为整数类型，或者明确提供返回值的类型。

这种编译器行为只对运算符生效。BinaryInteger 泛型重载的函数可以正确工作。

## 使用泛型约束进行重载

### 二分法

```swift
extension RandomAccessCollection where Index == Int, IndexDistance == Int { 
  public func binarySearch(for value: Element, areInIncreasingOrder: (Element, Element) -> Bool) -> Index? {
    var left = 0 // bug-1
    var right = count - 1 
    while left <= right {
      let mid = (left + right) / 2 // bug-2
      let candidate = self[mid]
      if areInIncreasingOrder(candidate,value) {
        left = mid + 1
      } else if areInIncreasingOrder(value,candidate) {
        right = mid - 1 
      } else {
        // 由于 isOrderedBefore 的要求，如果两个元素互⽆无顺序关系，那么它们⼀一定相等
        return mid
      }
    }
    // 未找到
    return nil
  }
}
```

这里存在两个 Bug，

1.  RandomAccessCollection，以整数为索引的集合其索引值其实并一定从 0 开始，比如 `arr[3.<5]`，`startIndex` 是 3。
2.  在数组非常大的情况下，表达式 `(left+right)/2`，可能会造成溢出

正确的方法见 [Generic](https://github.com/cp3hnu/Advanced-Swift/blob/master/Utils/Generic.swift)

### shuffle

```swift
extension BinaryInteger {
  static func arc4random_uniform(_ upper_bound: Self) -> Self {
    precondition(upper_bound > 0 && UInt32(upper_bound) < UInt32.max, "arc4random_uniform only callable up to \(UInt32.max)")
    return Self(Darwin.arc4random_uniform(UInt32(upper_bound))) 
  }
}

extension MutableCollection where Self: RandomAccessCollection { 
  mutating func shuffle() {
    var i = startIndex
    let beforeEndIndex = index(before: endIndex) 
    while i < beforeEndIndex { // 1
      let dist = distance(from: i, to: endIndex)
      let randomDistance = IndexDistance.arc4random_uniform(dist) 
      let j = index(i, offsetBy: randomDistance)
      self.swapAt(i, j)
      formIndex(after: &i)
    } 
  }
}

extension Sequence {
  func shuffled() -> [Element] { // 2
    var clone = Array(self) 
    clone.shuffle()
    return clone
  } 
}
```

注意点

1.  我们从 `for` 循环切换为了 `while` 循环，这是因为如果使用 `for i in indices.dropLast()` 来迭代索引的话，可能 会有性能问题：如果 `indices` 属性持有了对集合的引用，那么在遍历 `indices` 的同时更改集合内容，将会让我们失去写时复制的优化，因为集合需要进行不必要的复制操作。

2. 非变更 `shuffled` 方法，没有扩展 *MutableCollection*。这其实也是一个标准库中经常能够⻅到的模式 — 比如，当你对一个 ContiguousArray 进行排序操作时，你得到的是一个 Array 返回，而不是 ContiguousArray。

    在这里，原因是我们的不可变版本是依赖于复制集合并对它进行原地操作这一系列步骤的。进一步说，它依赖的是集合的值语义。但是并不是所有集合类型都具有值语义。要是 NSMutableArray 也满 MutableCollection 的话，那么 `shuffl􏰁ed` 和 `shuffl􏰁e` 的效果将是一样的。这是因为如果 NSMutableArray 是引用，那么 `var clone = self` 仅只是复制了一份引用，这样一来，接下来的 `clone.shuffl􏰁e` 调用将会作用在 self 上，显然这可能并不是用戶所期望的行为。所以，我们可以将这个集合中的元素完全复制到一个数组里，对它进行随机排列， 然后返回。

可以稍微让步，你可以定义一个 `shuffl􏰁e` 版本，只要它操作的集合也支持 *RangeReplaceableCollection*，就让它返回和它所随机的内容同样类型的集合

```swift
extension MutableCollection where Self: RandomAccessCollection, Self: RangeReplaceableCollection
{
  func shuffled() -> Self {
    var clone = Self() 
    clone.append(contentsOf: self) 
    clone.shuffle()
    return clone
  } 
}
```

这个实现依赖了 *RangeReplaceableCollection* 的两个特性：

1.  可以创建一个新的空集合 (`init`)
2.  可以将任意序列添加到空集合的后面 (`append`)。

## 使用泛型进行代码设计

```swift
struct Resource<A> { 
  let path: String
  let parse: (Any) -> A?
}

extension Resource {
  func loadSynchronously(callback: (A?) -> ()) {
    let resourceURL = webserviceURL.appendingPathComponent(path) 
    let data = try? Data(contentsOf: resourceURL)
    let json = data.flatMap {
      try? JSONSerialization.jsonObject(with: $0, options: []) 
    }
    callback(json.flatMap(parse))
  }
  
  func loadAsynchronously(callback: @escaping (A?) -> ()) {
    let resourceURL = webserviceURL.appendingPathComponent(path) 
    let session = URLSession.shared
    session.dataTask(with: resourceURL) { data, response, error in
    let json = data.flatMap {
      try? JSONSerialization.jsonObject(with: $0, options: [])
	}
	callback(json.flatMap(self.parse)) }.resume()
  }
}

let usersResource: Resource<[User]> = Resource(path: "/users", parse: jsonArray(User.init))
let postsResource: Resource<[BlogPost]> = Resource(path: "/posts", parse: jsonArray(BlogPost.init))
```
