<template>
  <div class="view-sequence">
    <x5gon-header class="overlay"></x5gon-header>
    <h1>Sequence</h1>
    <div class="sequence-list">
      <item-detail v-for="item in items"
                   :key="item.url"
                   class="miniature"
                   :item="item"></item-detail>
    </div>
    <div class="sequence-menu right-drawer-menu">
      <ul class="sequence-menu-list">
        <li @click="do_organize"><img alt="" src="img/icon_organize.svg">Organize</li>
        <li @click="do_addition"><img alt="" src="img/icon_addition.svg">Automatic addition of resources</li>
        <li @click="do_export"><img alt="" src="img/icon_export.svg">Export</li>
      </ul>
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
           @click="show_basket"
           src="img/basket.svg"></img>
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
          show_basket: function () {
              this.$router.push('/basket');
          },
          show_help: function () {
          },
          do_organize: function () {
          },
          do_addition: function () {
          },
          do_export: function () {
          }
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
  .right-drawer-menu {
      position: fixed;
      top: 0;
      bottom: 0;
      right: 0;
      width: 78px;
      padding-top: 180px;
      background-color: #505973;
      color: #fff;
  }
  .right-drawer-menu:hover {
      width: 300px;
  }
  .sequence-menu-list {
      list-style: none;
      display: none;
  }
  .sequence-menu:hover .sequence-menu-list {
      display: block;
      margin-left: 4px;
      font-family: Open Sans;
      font-weight: 600;
      font-size: 14px;
      line-height: 18px;
      color: #000D32;
  }
  .sequence-menu-list li:hover {
      border: 1px solid #000D3299;
  }
</style>
