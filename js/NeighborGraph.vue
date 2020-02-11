<template>
  <div class="view-neighbor-graph">
    <svg-container zoomable id="graph" viewbox="-50 -500 1000 1000">
      <rect x="0" y="0" width="1" height="100" stroke="#ff0" stroke-opacity="1" stroke-width=".1" fill="none"></rect>
      <rect x="0" y="0" width="100" height="1" stroke="#fff" stroke-opacity="1" stroke-width=".1" fill="none"></rect>
      <resource-representation v-for="item in neighbors"
                               :class="{ active: is_active(item) }"
                               class="highlightable"
                               :key="item.id"
                               :x="30000*item.reduction_coordinates[0]"
                               :y="30000*item.reduction_coordinates[1]"
                               @resource_mouseover="on_mouseover(item)"
                               @resource_click="on_click(item)"
                               @resource_dblclick="on_dblclick(item)"
                               @concept_mouseover="on_concept_mouseover"
                               @concept_palette="concept_palette"
                               :title="item.title"
                               :item="item">
      </resource-representation>
      <resource-representation v-if="reference"
                               class="highlightable"
                               id="reference"
                               is_reference
                               :class="{ active: is_active(reference) }"
                               :x="30000*reference.reduction_coordinates[0]"
                               :y="30000*reference.reduction_coordinates[1]"
                               @resource_mouseover="on_mouseover(reference)"
                               @resource_click="on_click(reference)"
                                 @resource_dblclick="on_dblclick(reference)"
                               @concept_mouseover="on_concept_mouseover"
                               @concept_palette="concept_palette"
                               :title="reference.title"
                               :item="reference"></resource-representation>
    </svg-container>
  </div>
</template>

<script>
    module.exports = {
        props: [ "reference", "neighbors", "highlight_concept", "concept_palette" ],
        methods: {
            on_mouseover: function (item) {
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
            is_active: function (item) {
                // highlight_concept is the concept url
                return (this.highlight_concept && item.wikifier.map(t => t[1]).indexOf(this.highlight_concept) != -1)
            }
        }
    }
</script>

  <style scoped>
  .highlightable {
      opacity: .5;
  }
  .highlightable:hover {
      opacity: 1;
      border: 1px solid black;
  }
  .active {
      opacity: 1;
  }
</style>
