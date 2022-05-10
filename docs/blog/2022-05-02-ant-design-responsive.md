---
pageClass: blog-page
title: Ant Design 响应式布局
tags: 
  - web
  - react
  - ant design
date: 2022-05-02
author: cp3hnu
location: ChangSha
summary: 学习 Ant Design 响应式布局以及根据 Ant Design 响应式布局实现响应式 Drawer 组件
---

# Ant Design 响应式布局

响应式布局就是根据不同设备类型、屏幕尺寸实现不同的界面布局，比如电脑和手机的界面布局一般都是不一样的。实现响应式布局的方式有很多（[Responsive Web Design](https://learn.shayhowe.com/advanced-html-css/responsive-web-design/)），本文主要介绍通过 [Media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries)  来实现实现响应式布局。

## Ant Design 断点

Ant Design [Grid 栅格断点 ](https://3x.ant.design/components/grid-cn/#Col)扩展自 [BootStrap 4 的规则](https://getbootstrap.com/docs/4.0/layout/overview/#responsive-breakpoints)，定义了 6 个断点

> 和 [BootStrap 5 的断点](https://getbootstrap.com/docs/5.0/layout/breakpoints/) 类似

| 断点 | 像素点    |
| ---- | --------- |
| xs   | < 576px   |
| sm   | >= 576px  |
| md   | >= 768px  |
| lg   | >= 992px  |
| xl   | >= 1200px |
| xxl  | >= 1600px |

Ant Design 也定义了这些断点的变量

> Ant Design 使用 less，样式变量在 [这里](https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less) 可以找到

```less
// Media queries breakpoints
// @screen-xs and @screen-xs-min is not used in Grid
// smallest break point is @screen-md
@screen-xs: 480px;
@screen-xs-min: @screen-xs;
// 👆 Extra small screen / phone

// 👇 Small screen / tablet
@screen-sm: 576px;
@screen-sm-min: @screen-sm;

// Medium screen / desktop
@screen-md: 768px;
@screen-md-min: @screen-md;

// Large screen / wide desktop
@screen-lg: 992px;
@screen-lg-min: @screen-lg;

// Extra large screen / full hd
@screen-xl: 1200px;
@screen-xl-min: @screen-xl;

// Extra extra large screen / large desktop
@screen-xxl: 1600px;
@screen-xxl-min: @screen-xxl;

// provide a maximum
@screen-xs-max: (@screen-sm-min - 1px);
@screen-sm-max: (@screen-md-min - 1px);
@screen-md-max: (@screen-lg-min - 1px);
@screen-lg-max: (@screen-xl-min - 1px);
@screen-xl-max: (@screen-xxl-min - 1px);
```

## 实现响应式 Drawer 组件

一些 Ant Design 组件实现了响应式，比如 [`Row / Col`](https://ant.design/components/grid-cn/), [` Form`](https://ant.design/components/form-cn/) 等，可以通过 `{ xs: 8, sm: 16, md: 24}` 实现响应式布局，然而 [`Drawer`](https://ant.design/components/drawer-cn/) 只有一个 `width` 属性，不支持响应式设计。我们可以通过  [Media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries)  和 Ant Design 定义的断点来实现响应式 Drawer 组件。

### Demo

```js
// use scss
import './app.scss';
// use less
import styles from './app.less';
import { Button, Drawer, Space } from 'antd';
import React, { useState } from 'react';

function App() {
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };
  return (
    <div className="App">
      <Button type="primary" onClick={showDrawer} className="app-button">
          Open
        </Button>
        <Drawer
          className="app-drawer"
          title="Drawer with extra actions"
          placement={"right"}
          onClose={onClose}
          visible={visible}
          extra={
            <Space>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="primary" onClick={onClose}>
                OK
              </Button>
            </Space>
          }
        >
        <div className='app-drawer-content'></div>
      </Drawer>
    </div>
  );
}

export default App;
```

### Use Sass/Scss

> 使用 `!important`，是因为 `Drawer` 有一个 `style: {width : 378px}`

> 如果你使用 Create-React-App，使用 Sass/Scss，请参考 [添加 Sass 样式表](https://www.html.cn/create-react-app/docs/adding-a-sass-stylesheet/)

```scss
$screen-xxl-min: 1600px;
$screen-xl-min: 1200px;
$screen-lg-min: 992px;
$screen-md-min: 768px;
$screen-sm-min: 576px;

$screen-xs-max: ($screen-sm-min - 1px);
$screen-sm-max: ($screen-md-min - 1px);
$screen-md-max: ($screen-lg-min - 1px);
$screen-lg-max: ($screen-xl-min - 1px);
$screen-xl-max: ($screen-xxl-min - 1px);

.app-drawer {
  .ant-drawer-content-wrapper {
    @media screen and (min-width: $screen-xxl-min) {
      width: 800px !important;
    }
    @media screen and (min-width: $screen-xl-min) and (max-width: $screen-xl-max) {
      width: 700px !important;
    }
    @media screen and (min-width: $screen-lg-min) and (max-width: $screen-lg-max) {
      width: 600px !important;
    }
    @media screen and (min-width: $screen-md-min) and (max-width: $screen-md-max) {
      width: 500px !important;
    }
    @media screen and (min-width: $screen-sm-min) and (max-width: $screen-sm-max) {
      width: 400px !important;
    }
    @media screen and (max-width: $screen-xs-max) {
      width: 300px !important;
    }
  }
}
```

### Use Less

> 如果你使用 Create-React-App 5+，使用 Less，请参考 https://stackoverflow.com/questions/57749719/using-less-files-with-react#answer-64370773

```less
@screen-xxl-min: 1600px;
@screen-xl-min: 1200px;
@screen-lg-min: 992px;
@screen-md-min: 768px;
@screen-sm-min: 576px;

@screen-xs-max: (@screen-sm-min - 1px);
@screen-sm-max: (@screen-md-min - 1px);
@screen-md-max: (@screen-lg-min - 1px);
@screen-lg-max: (@screen-xl-min - 1px);
@screen-xl-max: (@screen-xxl-min - 1px);

.app_drawer {
  :global {
    .ant-drawer-content-wrapper {
      @media screen and (min-width: @screen-xxl-min) {
        width: 800px !important;
      }
      @media screen and (min-width: @screen-xl-min) and (max-width: @screen-xl-max) {
        width: 700px !important;
      }
      @media screen and (min-width: @screen-lg-min) and (max-width: @screen-lg-max) {
        width: 600px !important;
      }
      @media screen and (min-width: @screen-md-min) and (max-width: @screen-md-max) {
        width: 5000px !important;
      }
      @media screen and (min-width: @screen-sm-min) and (max-width: @screen-sm-max) {
        width: 4000px !important;
      }
      @media screen and (max-width: @screen-xs-max) {
        width: 300px !important;
      }
    }
  }
}
```

## References

- [Responsive Web Design](https://learn.shayhowe.com/advanced-html-css/responsive-web-design/)
- [Media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries)
- [Using media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries)
-  [Ant Design]( https://ant.design/)

