<template>
  <div id="vuepress-theme-blog__post-layout">
    <article
      class="vuepress-blog-theme-content"
      itemscope
      itemtype="https://schema.org/BlogPosting"
    >
      <Content itemprop="articleBody" />
      <footer>
        <Newsletter v-if="$service.email.enabled" />
        <hr />
        <Comment />
      </footer>
    </article>
    <Toc />
  </div>
</template>

<script>
  import Toc from '@theme/components/Toc.vue'
  import { Comment } from '@vuepress/plugin-blog/lib/client/components'

  export default {
    components: {
      Toc,
      Comment,
      Newsletter: () => import('@theme/components/Newsletter.vue'),
    },
  }
</script>

<style lang="stylus">
  @require '~@parent-theme/styles/wrapper.styl'

  .vuepress-blog-theme-content
    @extend $wrapper
    font-size 16px
    letter-spacing 0px
    font-family PT Serif, Serif
    color $textColor
    position relative
    max-width none

  @media (max-width: $MQMobile)
    .vuepress-blog-theme-content
      padding-top 4.0rem
</style>
