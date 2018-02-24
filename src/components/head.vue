<style lang="scss">
  header {
    position: fixed;
    top: 0; left: 0;
    width: 100%;
    color: #444;
    z-index: 9;
    height: .4rem;
    padding: 0 5%;
    font-size: .2rem;
    background: #fff;
    transition: box-shadow .5s;
    box-shadow: 0 1px #ddd;
    &:hover {
      box-shadow: 0 1px 6px rgba(0,0,0,.2);
    }
    & + main {
      margin-top: .4rem;
    }
    nav {
      height: 100%;
      a {
        display: inline-block;
        height: 100%;
        padding: 0 .5em;
        line-height: 2;
        color: #444;
        border-width: 0;
        transition: color .2s linear, border .1s linear;
      }
      .router-link-active {
        color: #0b8;
        border-bottom: 2px solid #0da;
      }
    }
  }
</style>

<template>
  <header>
    <nav>
      <router-link :to="{name: 'azurlane'}">Azurlane</router-link>
    </nav>
  </header>
</template>

<script>
  export default {}
</script>