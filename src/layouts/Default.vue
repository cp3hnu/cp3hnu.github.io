<template>
  <div class="layout">
    <header class="header">
      <nav class="nav">
        <g-link class="nav__link" to="/">Home</g-link>
        <g-link class="nav__link" to="/notebook">Notebook</g-link>
        <a class="nav__link" href="https://github.com/cp3hnu" target="_blank">GitHub</a>
        <g-link class="nav__link" to="/about">About</g-link>
      </nav>
    </header>
    <slot/>
  </div>
</template>

<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>

<style>
body {
  font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  margin:0;
  padding:0;
  line-height: 1.5;
}

.layout {
  width: 100%;
}

.header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 20px 30px 20px 20px;
  background-color: #153C47;
}

.nav {

}

.nav__link {
  margin-left: 20px;
  color: white;
}
</style>
