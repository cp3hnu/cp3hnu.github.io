<template>
  <layout>
    <div class="background-image-div">
      <g-image class="background-image" src="~/asset/background.jpg" />
      <div class="mask">
        <div class="aphorism">知之者不如好之者，好之者不如乐之者</div>
      </div>
    </div>
    <div>
      <div class="product-list">
        <g-link class="product-link" v-for="product in products" :key="product.id" :to="product.route">
          <product :logoUrl="product.logo" :title="product.title" :detail="product.detail"></product>
        </g-link>
      </div>
    </div>
  </layout>
</template>

<script>
  import Product from '~/components/Product'
  import wordCardLogo from '~/products/wordCard/logo.png'
  import starryLogo from '~/asset/starry_logo.png'

  export default {
    metaInfo: {
      title: 'Joy Learn'
    },
    components: { Product } ,
    data() {
      return {
        products: [
          {
            id: 1,
            logo: wordCardLogo,
            title: '英语单词卡',
            detail: '专为3~8岁儿童打造的一款英语启蒙学习软件，从日常生活中学习英语',
            route: '/word-card'
          },
          {
            id: 2,
            logo: starryLogo,
            title: 'Starry',
            detail: 'Group, manage and read your starred repositories on GitHub',
            route: '/starry'
          },
        ],
      }
    }
  }
</script>

<style>
  .home-links a {
    margin-right: 1rem;
  }
  .background-image-div {
    width: 100%;
    height: min(20rem, 50vw);
    overflow: hidden;
    position: relative;
    background-color: #153C47;
  }
  .background-image {
    width: 100%;
  }
  .mask {
    background-color: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .aphorism {
    font-size: clamp(16px, 3vw, 32px);
    color: white;
    padding: 0 50px;
  }
  .product-list {
    width: 100%;
    margin-top: 50px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
  }
  .product-list a {
    text-decoration: none;
  }
  .product-link {
    width: 30%;
    min-width: 300px;
  }
</style>
