---
sidebar: false
pageClass: index-page
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
            link: '/notebook/wwdc/'
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

<style scoped>
  .note-list {
    padding: 30px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .card {
    width: 400px;
    height: 329px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url("/assets/img/board.png");
    margin-right: 30px;
  }
  
   .card:last-child {
     margin-right: 0;
   }

  .book-link {
    font-size: 22px;
    color: white;
    font-weight: 500;
    text-decoration: none;
  }
</style>