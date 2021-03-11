# 第7章 函数
[[toc]]
函数可以被赋值给变量

```swift
func printInt(i: Int) {
  print("you passed", i)
}

let funVar = printInt // 或者 let funVar = printInt(i:)
// 调用时不能包含参数标签
funVar(3)
```

函数可以捕获存在于它们作用范围之外的变量

```swift
func counterFunc() -> (Int) -> String { 
  var counter = 0
  func innerFunc(i: Int) -> String {
    counter += i // counter is captured
    return "running total: \(counter)" 
  }
  return innerFunc 
}
```

**counter 将存在于堆上而非栈上。**

一般来说，因为 counter 是一个 `counterFunc` 的局部变量，它在 return 语句执行之后应该离开作用域并被摧毁。但是因为 `innerFunc` 捕获了它，所以 Swift 运行时将为一直保证它存在，直到捕获它函数被销毁为止。

一个函数和它所捕获的变量环境组合起来被称为**闭包**。

{ } 来声明函数的被称为**闭包表达式**。

## 函数灵活性

[Function](https://github.com/cp3hnu/Advanced-Swift/blob/master/Utils/Fuction.swift)

`lexicographicallyPrecedes` 方法接受两个序列，并对它们执行一个电话簿方式的比较。

## inout 参数和可变方法

inout 参数将一个值传递给函数，函数可以改变这个值，然后将原来的值替换掉，并从函数中传出。				
inout 参数不能逃逸

```swift
func escapeIncrement(value: inout Int) -> () -> () { 
  func inc() {
    value += 1 
  }
  // error: 嵌套函数不能捕获 inout 参数
  return inc 
}
```

因为 inout 的值要在函数返回之前复制回去，那么要是我们可以在函数返回之后再去改变它，应该要怎么做呢？是说值应该在改变以后再复制吗？要是调用源已经不存在了怎么办？编译器必须对此进行验证，因为这对保证安全十分关键。

& 除了在将变量传递给 inout 以外， 还可以用来将变量转换为一个不安全的指针。

```swift
func incref(pointer: UnsafeMutablePointer<Int>) -> () -> Int {
  return {
    pointer.pointee += 1
    return pointer.pointee 
  }
}

var value = 5
let fun = incref(pointer: &value)
fun()
```

## 观察属性

属性观察者不是一个提供给类型用戶的工具，它是专⻔为类型的设计者而设计的；这和 Foundation 中的键值观察有本质的不同，键值观察通常是对象的消费者来观察对象内部变化的手段，而与类的设计者是否希望如此无关。

KVO 使用 Objective-C 的运行时特性， 它动态地在类的 `setter` 中添加观察者；Swift 的属性观察是一个纯粹的编译时特性。

## 延时属性

延迟属性会被自动声明为 var，因为它的初始值在初始化方法完成时是不会被设置的。

访问一个延迟属性是 mutating 操作，因为这个属性的初始值会在第一次访问时被设置。

当结构体包含一个延迟属性时，这个结构体的所有者如果想要访问该延迟属性的话，也需要将结构体声明为可变量，因为访问这个属性的同时，也会潜在地对这个属性的容器进行改变。

## 下标

[Dictionary subscript](https://github.com/cp3hnu/Advanced-Swift/blob/master/Utils/Dictionary.swift)

## 键路径

键路径表达式以一个反斜杠开头，比如 \String.count

### 双向数据绑定

[BidirectionBind](https://github.com/cp3hnu/Advanced-Swift/blob/master/Utils/BidirectionBind.swift)

### 类型

-   `AnyKeyPath` 和 (Any)->Any? 类型的函数相似
-   `PartialKeyPath<Source>` 和 (Source)->Any? 函数相似
-   `KeyPath<Source,Target> `和 (Source)->Target 函数相似
-   `WritableKeyPath<Source,Target>` 和 (Source)->Target 与 (inout Source, Target) -> () 这一对函数相似
-   `ReferenceWritableKeyPath<Source,Target> `和 (Source)->Target 与 (Source, Target) -> () 这一对函数相似。第二个函数可以用 Target 来更新 Source 的值， 且要求 Source 是一个引用类型。

对 WritableKeyPath 和 ReferenceWritableKeyPath 进行区分是必要的，前一个类型的 `setter` 要求它的参数是 inout 的，后一个要求 Source 是一个引用类型。

## 闭包

一个被保存在某个地方等待稍后 (比如函数返回以后) 再调用的闭包就叫做**逃逸闭包**。

默认非逃逸的规则只对函数参数，以及那些直接参数位置 (immediate parameter position) 的函数类型有效。也就是说，如果一个存储属性的类型是函数的话，那么它将会是逃逸的。出乎意料的是，对于那些使用闭包作为参数的函数，如果闭包被封装到像是多元组或者可选值等类型的话，这个闭包参数也是逃逸的。因为在这种情况下闭包不是直接参数，它将**自动变为逃逸闭包**。这样的结果是，你不能写出一个函数，使它接受的函数参数同时满足可选值和非逃逸。很多情况下，你可以通过为闭包提供一个默认值来避免可选值。如果这 样做行不通的话，可以通过重载函数，提供一个包含可选值 (逃逸) 的函数，以及一个不可选， 不逃逸的函数来绕过这个限制。

```swift
func transform(_ input: Int, with f: ((Int) -> Int)?) -> Int {
  print("使用可选值重载")
  guard let f = f else { return input }
  return f(input) 
}

func transform(_ input: Int, with f: (Int) -> Int) -> Int { 
  print("使⽤⾮可选值重载")
  return f(input) 
}
```

## withoutActuallyEscaping

你确实知道一个闭包不会逃逸，但是编译器无法证明这点，所以它会强制你添加 @escaping 标注。Swift 为这种情况提供了一个特例函数，那就是 `withoutActuallyEscaping`。它可以让你把一个非逃逸闭包传递给一个期待逃 逸闭包作为参数的函数。

```swift
extension Array {
  func all(matching predicate: (Element) -> Bool) -> Bool {
    return withoutActuallyEscaping(predicate) { escapablePredicate in 
      self.lazy.filter { !escapablePredicate($0) }.isEmpty
    } 
  }
}
```

注意，使用 `withoutActuallyEscaping` 后，你就进入了 Swift 中不安全的领域。让闭包的复制从`withoutActuallyEscaping` 调用的结果中逃逸的话，会造成不确定的行为。