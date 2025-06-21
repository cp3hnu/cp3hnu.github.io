<template>
  <div id="vuepress-theme-blog__post-layout">
    <Sidebar :items="sidebarItems"></Sidebar>
    <RouterLink class="back-to-list" :to="listUrl" :exact="true">
      <img src="/assets/img/back.png" width="20"> 返回列表
    </RouterLink>
    <article
      class="vuepress-blog-theme-sidebar-content"
      itemscope
      itemtype="https://schema.org/BlogPosting"
    >
      <Content itemprop="articleBody" />
    </article>
    <Toc />
  </div>
</template>

<script>
  import Toc from '@theme/components/Toc.vue'
  import Sidebar from '@theme/components/Sidebar.vue'
  import { resolveSidebarItems } from '../util'

  export default {
    components: {
      Toc,
      Sidebar
    },
    data () {
      return {
      }
    },

    computed: {
      sidebarItems () {
        return resolveSidebarItems(
          this.$page,
          this.$page.regularPath,
          this.$site,
          this.$localePath
        )
      },
      listUrl () {
        if (Array.isArray(this.sidebarItems) && this.sidebarItems.length > 0) {
          return this.sidebarItems[0].path || '/'
        }

        return  '/'
      }
    },

    mounted () {
      console.log(this.$site)
      console.log(this.$page)
      console.log(this.sidebarItems)
    },

    methods: {

    }
  }
</script>

<style lang="stylus">

  .vuepress-blog-theme-sidebar-content
    font-size 16px
    letter-spacing 0px
    font-family PT Serif, Serif
    color $textColor
    position relative
    max-width none
    margin 0 auto
    background-color $bgColor
    padding-top 2rem
    padding-bottom 2rem
    padding-left 400px
    padding-right 400px

  @media (max-width: $MQMobile)
    .vuepress-blog-theme-sidebar-content
      padding-top 4.0rem
      padding-left 16px
      padding-right 16px

  .back-to-list
    font-size 16px
    color #666
    margin-left: 2.0rem
    margin-top 2.0rem
    text-decoration none
    display none

    @media (max-width: $MQMobile)
      display block
</style>
