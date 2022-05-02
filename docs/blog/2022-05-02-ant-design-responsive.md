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





```css
@screen-xxl: 1600px;
@screen-xl: 1200px;
@screen-lg: 992px;
@screen-md: 768px;
@screen-sm: 576px;

// 
@media screen and (min-width: @screen-xxl) {
  width: 800px !important;
}
@media screen and (min-width: @screen-xl) and (max-width: @screen-xxl) {
  width: 700px !important;
}
@media screen and (min-width: @screen-lg) and (max-width: @screen-xl) {
  width: 600px !important;
}
@media screen and (min-width: @screen-md) and (max-width: @screen-lg) {
  width: 5000px !important;
}
@media screen and (min-width: @screen-sm) and (max-width: @screen-md) {
  width: 4000px !important;
}
@media screen and (max-width: @screen-sm) {
  width: 300px !important;
}
```







