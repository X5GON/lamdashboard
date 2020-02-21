<template>
  <div class="view-neighbor-graph">
    <svg-container zoomable id="graph" viewbox="-50 -500 1000 1000">
      <rect x="0" y="0" width="1" height="100" stroke="#ff0" stroke-opacity="1" stroke-width=".1" fill="none"></rect>
      <rect x="0" y="0" width="100" height="1" stroke="#fff" stroke-opacity="1" stroke-width=".1" fill="none"></rect>
      <resource-representation v-for="item in filtered_neighbors"
                               :class="{ concept_related: is_concept_related(item) }"
                               class="highlightable"
                               :key="item.id"
                               :x="x_position(item)"
                               :y="y_position(item)"
                               :detailed_concepts="active_resource == item"
                               @resource_mouseover="on_mouseover(item)"
                               @resource_click="on_click(item)"
                               @resource_dblclick="on_dblclick(item)"
                               @concept_mouseover="on_concept_mouseover"
                               @concept_palette="concept_palette"
                               :item="item">
      </resource-representation>
      <resource-representation v-if="reference"
                               class="highlightable"
                               id="reference"
                               is_reference
                               detailed_concepts
                               :class="{ concept_related: is_concept_related(reference) }"
                               :x="x_position(reference)"
                               :y="y_position(reference)"
                               @resource_mouseover="on_mouseover(reference)"
                               @resource_click="on_click(reference)"
                               @resource_dblclick="on_dblclick(reference)"
                               @concept_mouseover="on_concept_mouseover"
                               @concept_palette="concept_palette"
                               :item="reference"></resource-representation>
      <path v-if="active_resource" :d="resource_link_path" stroke="#fff" stroke-width="1"></path>
    </svg-container>
    <div id="slider">
      <range-slider :min="5" v-model="max_neighbors"></range-slider>
    </div>
  </div>
</template>

<script>
    module.exports = {
        name: 'NeighborGraph',
        data: function () {
            return {
                active_resource: null,
                max_neighbors: 20,
            }
        },
        props: [ "reference", "neighbors", "highlight_concept", "concept_palette" ],
        methods: {
            on_mouseover: function (item) {
                this.active_resource = item;
                this.$emit("resource_mouseover", item);
            },
            on_click: function (item) {
                this.$emit("resource_click", item);
            },
            on_dblclick: function (item) {
                this.$emit("resource_dblclick", item);
            },
            on_concept_mouseover: function (concept) {
                this.$emit("concept_mouseover", concept);
            },
            is_concept_related: function (item) {
                // highlight_concept is the concept url
                return (this.highlight_concept && item.wikifier.map(t => t.url).indexOf(this.highlight_concept) != -1)
            },
            x_position: function (item) {
                return this.x_scale(item.projection[0]);
            },
            y_position: function (item) {
                return this.y_scale(item.projection[1]);
            },
        },
        computed: {
            filtered_neighbors: function () {
                return this.neighbors.slice(0, this.max_neighbors);
            },
            resource_link_path: function () {
                return `M ${this.x_position(this.reference)} ${this.y_position(this.reference)} L ${this.x_position(this.active_resource)} ${this.y_position(this.active_resource)}`;
            },
            x_extent: function () {
                return d3.extent(this.neighbors.map(n => n.projection[0]));
            },
            y_extent: function () {
                return d3.extent(this.neighbors.map(n => n.projection[1]));
            },
            x_scale: function () {
                let scale = d3.scaleLinear()
                    .domain(this.x_extent)
                    .range([ 0, 6000 ]); // pixels
                return scale;
            },
            y_scale: function () {
                let scale = d3.scaleLinear()
                    .domain(this.y_extent)
                    .range([ 0, 3000 ]); // pixels
                return scale;
            },
        }
    }
</script>

  <style scoped>
  .highlightable {
      opacity: .6;
  }
  .highlightable:hover {
      opacity: 1;
      border: 1px solid black;
  }
  .concept_related {
      opacity: 1;
  }
  #slider {
      position: fixed;
      top: 10px;
      left: 10px;
  }
</style>
