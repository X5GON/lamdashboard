<template>
  <div class="view-basket">
    <x5gon-header class="overlay"></x5gon-header>
    <h1>Basket</h1>
    <div class="basket-list">
      <item-detail v-for="item in items"
                   :item="item"
                   :key="item.url"
                   miniature></item-detail>
    </div>
    <x5gon-toolbar></x5gon-toolbar>
  </div>
</template>

<script>

  module.exports = {
      name: "Basket",
      data: function() {
          return {
          }
      },
      computed: {
          items: function () {
              return this.$store.state.basket
          }
      },
      methods: {
      }
    }
</script>

  <style scoped>
  h1 {
    font-family: IBM Plex Serif;
    font-weight: 500;
    font-size: 38px;
    line-height: 26px;
    color: #fff;
  }
  .basket-list {
      margin: 0 10%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
  }
  .view-itemdetail {
      width: 10vw;
      margin: 1vw;
  }
  .toolbar-icon {
      width: 32px;
      height: 32px;
  }
  .toolbar-icon + .toolbar-icon {
      margin-top: 12px;
  }
  .toolbar {
      position: absolute;
      top: 30px;
      right: 22px;
      display: flex;
      flex-direction: column;
  }
</style>
