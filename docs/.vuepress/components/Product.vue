<template>
  <div class="product-container">
    <img class="logo-image" :src="logoUrl"/>
    <div class="product-title">{{ title }}</div>
    <div class="product-detail">{{ detail }}</div>
  </div>
</template>

<script>
  export default {
    name: 'product',
    props: ['logoUrl', 'title', 'detail']
  }
</script>

<style scoped>
  .product-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-bottom: 50px;
  }

  .product-title {
    margin-top: 20px;
    font-size: 22px;
    color: #000;
  }

  .product-detail {
    margin-top: 10px;
    font-size: 16px;
    color: #666;
  }

  .logo-image {
    width: 120px;
    height: 120px;
  }
</style>