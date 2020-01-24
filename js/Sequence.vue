<template>
  <div class="view-sequence">
    <x5gon-header class="overlay"></x5gon-header>
    <h1>Sequence</h1>
    <div class="sequence-list">
      <item-detail v-for="item in items"
                   class="miniature"
                   :item="item"></item-detail>
    </div>
    <div class="toolbar">
      <img class="toolbar-icon"
           title="Help"
           alt="?"
           @click="show_help"
           src="img/help.svg"></img>
      <img class="toolbar-icon"
           title="Back to basket"
           alt="Basket"
           @click="show_basker"
           src="img/basket_icon.svg"></img>
    </div>
  </div>
</template>

<script>
  module.exports = {
      computed: {
          items: function () {
              return this.$store.state.sequence
          }
      },
      methods: {
          show_overview: function () {
              this.$router.push('/basket');
          },
          show_help: function () {
          },
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
  .sequence-list {
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
