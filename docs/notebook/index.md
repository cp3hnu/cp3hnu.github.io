---
pageClass: index-page
title: Notebook
---
<template>
  <div class="note-list">
    <div class="card" v-for="item in books" :key="item.id">
      <router-link class="book-link" :to="item.link">{{ item.name }}</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Notebook',
    data() {
      return {
        books: [
          {
            id: 1,
            name: 'WWDC',
            link: '/notebook/wwdc/2017/documents/220'
          },
          {
            id: 2,
            name: 'Advanced-Swift',
            link: '/notebook/advanced-swift/book/chapter-2'
          },
        ]
      }
    }
  }
</script>

<style scoped lang="stylus">
  .note-list {
    padding: 60px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
  }
  
  .card {
    width: 300px;
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 60px;
    border: 1px solid $accentColor;
    border-radius: 10px;
  }
  
   .card:last-child {
     margin-right: 0;
     margin-bottom: 0;
   }

  .book-link {
    font-size: 22px;
    font-weight: 500;
    text-decoration: none;
  }
  
  @media (max-width: $MQMobile)
    .note-list
      padding 40px 0
      flex-direction column
      
    .card 
      max-width 80%
      margin-right 0
      margin-bottom 50px
</style>