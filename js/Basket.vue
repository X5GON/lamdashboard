<template>
  <div class="view-basket" :class="{ fullscreen: is_fullscreen }">
    <x5gon-header class="overlay"></x5gon-header>
    <div class="basket-content">
      <h1>Basket</h1>
      <div class="basket-list">
        <item-detail v-for="item in items"
                     :item="item"
                     :key="item.url"
                     @mouseover="on_resource_mouseover"
                     miniature></item-detail>
      </div>
    </div>
    <x5gon-toolbar></x5gon-toolbar>
    <resource-information-panel v-if="active_resource"
                                :resource="active_resource"
                                :concept_palette="concept_palette"
                                :is_fullscreen="is_fullscreen">
    </resource-information-panel>
  </div>
</template>

<script>

  module.exports = {
      name: "Basket",
      data: function() {
          return {
              is_fullscreen: true,
              active_resource: null,
              palette: {},
          }
      },
      computed: {
          items: function () {
              return this.$store.state.basket
          }
      },
      methods: {
          on_resource_mouseover: function (item) {
              this.active_resource = item;
          },
          concept_palette: function (url) {
              let color = this.palette[url];
              if (! color) {
                  color = this.$constant.palette.concepts.find(col => ! Object.values(this.palette).includes(col)) || '#000d32';
                  this.palette[url] = color;
              }
              return color;
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
  .fullscreen .basket-content {
      height: calc(100vh - 170px);
  }
  .basket-list {
      margin: 0 10%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
  }
  .view-itemdetail {
      width: 5vw;
      height: 8vw;
      max-height: 300px;
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
