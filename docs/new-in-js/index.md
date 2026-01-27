---
pageClass: index-page
title: What's New in ECMAScript
summary: What's New in ECMAScript
---

<template>
  <div class="page-container">
    <div class="logo-div" style="margin-top: 30px;">
      <img src="./logo.png" width="80" />
      <div class="product-title">New in JS</div>
    </div>
    <div class="description-div" style="margin-top: 10px;">
      <div>A collection of new features in ECMAScript.</div>
      <div style="margin-top: 30px;">
       <a href="https://new-in-ecmascript.vercel.app/" target="_blank">Online</a>
        <a style="margin-left: 10px;" href="https://cp3hnu.github.io/2022/04/09/what-s-new-ecmascript/" target="_blank">Document</a>
      </div>
    </div>
    <div class="image-container">
      <div class="screenshot-div">
        <img class="screenshot-image" src="./screenshot.png" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    metaInfo: {
      title: "What's New in ECMAScript"
    },
    name: "What's New in ECMAScript"
  }
</script>

<style scoped>
  .logo-div {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
  }
  .product-title {
    margin-left: 15px;
    font-size: 22px;
    color: #000;
    font-weight: 500;
  }

  .description-div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .image-container {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 40px;
  }
   .screenshot-div {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
  }
  .screenshot-image {
    width: 800px;
    max-width: 70%;
  }
 
</style>
