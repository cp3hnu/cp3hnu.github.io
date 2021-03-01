<template>
  <Layout>
    <div class="note-list">
      <a class="notebook-item" href="http://www.joylearn123.com/WWDC/" target="_blank">WWDC</a>
      <a class="notebook-item" href="http://www.joylearn123.com/Advanced-Swift/" target="_blank">Advanced Swift</a>
    </div>
  </Layout>
</template>

<script>
  export default {
    name: 'Notebook'
  }
</script>

<style scoped>
  .note-list {
    padding-left: 30px;
    padding-top: 30px ;
  }
  .notebook-item {
    display: block;
    font-size: 1.5em;
    color: #159957;
  }
</style>