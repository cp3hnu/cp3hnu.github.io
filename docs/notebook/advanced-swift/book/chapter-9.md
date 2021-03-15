---
layout: NotebookLayout
pageClass: index-page
---
# 第9章 错误处理

```swift
enum ParseError: Error {
  case wrongEncoding
  case warning(line: Int, message: String)
}

do{
  let result = try parse(text: "{ \"message\": \"We come in peace\" }") 
  print(result)
} catch ParseError.wrongEncoding { 
  print("Wrong encoding")
} catch let ParseError.warning(line, message) { 
  print("Warning at line \(line): \(message)")
} catch { 
  // 其他
}
```

-   **CustomNSError:** provides a domain, error code, and user-info dictionary
-   **LocalizedError:** provides localized messages describing the error and why it occurred
-   **RecoverableError:** presents several potential recovery options to the user