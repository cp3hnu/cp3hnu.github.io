<template>
  <div id="vuepress-theme-blog__global-layout">
    <Header />
    <MobileHeader
      :is-open="isMobileHeaderOpen"
      @toggle-sidebar="isMobileHeaderOpen = !isMobileHeaderOpen"
    />
    <div :class="['content-wrapper', $page.frontmatter.pageClass]" @click="isMobileHeaderOpen = false">
      <DefaultGlobalLayout />
    </div>
  </div>
</template>

<script>
  import GlobalLayout from '@app/components/GlobalLayout.vue'
  import Header from '@theme/components/Header.vue'
  import MobileHeader from '@theme/components/MobileHeader.vue'

  export default {
    components: {
      DefaultGlobalLayout: GlobalLayout,
      Header,
      MobileHeader
    },

    data() {
      return {
        isMobileHeaderOpen: false,
      }
    },

    mounted() {
      this.$router.afterEach(() => {
        this.isMobileHeaderOpen = false
      })
    },
  }
</script>

<style lang="stylus">
  #vuepress-theme-blog__global-layout
    word-wrap break-word

  .content-wrapper
    padding 120px 15px 40px
    min-height calc(100vh - 160px)
    max-width $contentWidth
    margin 0 auto

    @media (max-width: $MQMobile)
      &
        padding 100px 15px 20px 15px
        min-height calc(100vh - 20px - 60px - 100px)
</style>
