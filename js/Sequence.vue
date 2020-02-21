<template>
  <div class="view-sequence">
    <x5gon-header class="overlay"></x5gon-header>
    <h1>Sequence</h1>
    <svg-container class="svg-content" v-if="items.length > 0" :key="items.length" :viewbox="`0 0 ${x_max} 300`">
      <g>
        <resource-representation v-for="item in positioned_items"
                                 :x="item.x_position"
                                 :y="70"
                                 detailed_concepts
                                 :key="item.url"
                                 :title="item.title"
                                 :item="item"></resource-representation>
      </g>
    </svg-container>
    <div class="sequence-menu right-drawer-menu">
      <ul class="sequence-menu-list">
        <li @click="do_organize"><img alt="" src="img/icon_organize.svg">Organize</li>
        <li @click="do_addition"><img alt="" src="img/icon_addition.svg">Automatic addition of resources</li>
        <li @click="do_export"><img alt="" src="img/icon_export.svg">Export</li>
      </ul>
    </div>
    <x5gon-toolbar></x5gon-toolbar>
  </div>
</template>

<script>
  module.exports = {
      name: "Sequence",
      computed: {
          items: function () {
              return this.$store.state.sequence;
          },
          positioned_items: function () {
              // Return item list with x_position / y_position information added
              let x = 0;
              // This should be factorized somehow with the code in ResourceRepresentation
              let scale =  d3.scaleLinear()
                  .domain([ 60, this.$constant.max_duration ])
                  .range([ 10, this.$constant.max_width ]);
              return this.items.map(item => {
                  let width = scale(item.duration);
                  x = x + scale(item.duration);
                  item.x_position = x;
                  x = x + scale(item.duration) + 10;
                  return item;
              });
          },
          x_max: function () {
              return this.items.length > 0 ? this.positioned_items[this.items.length - 1].x_position + this.$constant.max_width : 0;
          },

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
      },
      mounted: function () {
          if (this.$route.query.q) {
              this.$store.dispatch('submit_query', this.$route.query.q);
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
  .svg-content {
      margin-top: 50px;
      width: calc(100% - 78px);
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
