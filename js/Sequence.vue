<template>
  <div class="view-sequence" :class="{ fullscreen: is_fullscreen }">
    <x5gon-header class="overlay"></x5gon-header>
    <div class="sequence-content">
      <h1>Sequence</h1>
      <svg-container class="svg-content" v-if="items.length > 0" :key="items.length" :viewbox="`0 0 ${Math.max(x_max,500)} 200`">

        <g transform="translate(0 100)">
          <g>
            <path v-for="(area, index) in distance_info"
                :key="`area${index}`"
                  stroke="none"
                  fill="#fff"
                  :fill-opacity="area.intensity"
                  :d="`M ${area.left.x} ${area.left.y} L ${area.left.x} ${-area.left.y} L ${area.right.x} ${-area.right.y} L ${area.right.x} ${area.right.y} Z`"></path>
          </g>
          <g>
            <resource-representation v-for="(item, index) in positioned_items"
                                     @resource_click="insert_resource(item)"
                                     @resource_mouseover="on_resource_mouseover"
                                     :x="item.x_position"
                                     :y="0"
                                     fill="#000D32"
                                     :is_suggested="item.is_suggested"
                                     detailed_concepts
                                     :key="`${index}-${item.url}`"
                                     :title="item.title"
                                     :item="item"></resource-representation>
          </g>
        </g>
      </svg-container>
    </div>

    <resource-information-panel v-if="active_resource"
                                :resource="active_resource"
                                :concept_palette="concept_palette"
                                :is_fullscreen="is_fullscreen">
    </resource-information-panel>
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
      data: function() {
          return {
              is_fullscreen: true,
              active_resource: null,
              palette: {},
          }
      },
      computed: {
          ...Vuex.mapState([ "sequence", "insertions", "sequence_distances" ]),
          items: function () {
              // FIXME: refactor to introduce an indirection level and
              // not pollute resources themselves with display info

              // Merge sequence and insertions
              if (this.insertions.length == 0) {
                  return this.sequence;
              };
              let res = [];
              for (let i = 0 ; i < this.sequence.length ; i++) {
                  res.push(this.sequence[i]);
                  if (this.insertions[i] !== null && typeof this.insertions[i] == 'object') {
                      this.insertions[i].is_suggested = true;
                      this.insertions[i].insert_after = i;
                      res.push(this.insertions[i]);
                  }
              }
              return res;
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
                  item.radius = width;
                  x = x + scale(item.duration) + 10;
                  return item;
              });
          },
          distance_info: function () {
              // Return a list of { left: {x, y}, right: {x, y}, distance } representing the distance zones to display
              return this.sequence_distances.map((distance, index) => ({
                  left: { x: this.positioned_items[index].x_position, y: this.positioned_items[index].radius },
                  right: { x: this.positioned_items[index+1].x_position, y: this.positioned_items[index+1].radius },
                  intensity: distance,
              }));
          },
          x_max: function () {
              return this.items.length > 0 ? this.positioned_items[this.items.length - 1].x_position + this.$constant.max_width : 500;
          },

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
          show_basket: function () {
              this.$router.push('/basket');
          },
          show_help: function () {
          },
          do_organize: function () {
          },
          do_addition: function () {
              this.$store.dispatch('suggest_insertions');
          },
          do_export: function () {
          },
          insert_resource: function (item) {
              if (! item.is_suggested) {
                  return;
              }
              this.$store.dispatch('validate_insertion', item.insert_after);
          },
      },
      mounted: function () {
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
  .fullscreen .sequence-content {
      height: calc(100vh - 170px);
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
      margin-left: 10px;
      width: calc(100% - 78px);
      max-height: 60vh;
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
