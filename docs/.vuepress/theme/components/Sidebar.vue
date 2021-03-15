<template>
  <aside class="sidebar">
    <slot name="top" />

    <SidebarLinks
      :depth="0"
      :items="items"
    />
    <slot name="bottom" />
  </aside>
</template>

<script>
import SidebarLinks from '@theme/components/SidebarLinks.vue'

export default {
  name: 'Sidebar',

  components: { SidebarLinks },

  props: ['items']
}
</script>

<style lang="stylus">
  .sidebar
    font-size 16px
    background-color #fff
    width $sidebarWidth
    position fixed
    z-index 10
    margin 0
    top $navbarHeight + 1.0rem
    left 0
    bottom 0
    box-sizing border-box
    border-right 1px solid $borderColor
    overflow-y auto
    display none

.sidebar
  ul
    padding 0
    margin 0
    list-style-type none
  a
    display inline-block
    text-decoration none
  .nav-links
    display none
    border-bottom 1px solid $borderColor
    padding 0.5rem 0 0.75rem 0
    a
      font-weight 600
    .nav-item, .repo-link
      display block
      line-height 1.25rem
      font-size 1.1em
      padding 0.5rem 0 0.5rem 1.5rem
  & > .sidebar-links
    padding 1.5rem 0
    & > li > a.sidebar-link
      font-size 1.1em
      line-height 1.7
      font-weight bold
    & > li:not(:first-child)
      margin-top .75rem
</style>
