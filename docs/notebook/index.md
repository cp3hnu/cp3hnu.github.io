---
pageClass: index-page
title: Notebook
---
<template>
  <div class="pc-browser">
    <div class="note-list">
      <router-link
        v-for="item in books"
        :key="item.id"
        class="card book-link"
        :to="item.link">
        {{ item.name }}
      </router-link>
    </div>
  </div>
  <div class="mobile-browser">
    <div class="note-list">
      <router-link
        v-for="item in mobileBooks"
        :key="item.id"
        class="card book-link"
        :to="item.link">
        {{ item.name }}
      </router-link>
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
        ],
        mobileBooks: [
          {
            id: 1,
            name: 'WWDC',
            link: '/notebook/wwdc'
          },
          {
            id: 2,
            name: 'Advanced-Swift',
            link: '/notebook/advanced-swift'
          },
        ],
      }
    }
  }
</script>

<style scoped lang="stylus">
  .note-list {
    padding: 80px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
  }

  .card {
    width: 250px;
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 80px;
    border: 1px solid #333;
    border-radius: 10px;
  }

   .card:last-child {
     margin-right: 0;
     margin-bottom: 0;
   }

   .card:hover {
    transform: scale(1.1);
    border: 1px solid $accentColor;
    color: $accentColor;
    box-shadow: 0 0 10px $accentColor;
   }

  .book-link {
    font-size: 22px;
    font-weight: 500;
    text-decoration: none;
    color: inherit;
  }

  .book-link:hover {
    text-decoration: none !important;
    color: inherit;
  }

  .mobile-browser {
    display: none;
  }

  .pc-browser {
    display: block;
  }

  @media (max-width: $MQMobile) {
    .note-list {
      padding 40px 0;
      flex-direction column;
    }

    .card {
      max-width 80%;
      margin-right 0;
      margin-bottom 50px;
    }
    
    .mobile-browser {
      display: block;
    }
    
    .pc-browser {
      display: none;
    }
  }
</style>