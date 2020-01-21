<template>
  <div class="view-neighbor-graph">
    <svg-container viewbox="-50 -500 1000 1000">
      <rect x="0" y="0" width="1" height="100" stroke="#ff0" stroke-opacity="1" stroke-width=".1" fill="none"></rect>
      <rect x="0" y="0" width="100" height="1" stroke="#fff" stroke-opacity="1" stroke-width=".1" fill="none"></rect>
      <g id="reference">
        <resource-representation :item="reference"></resource-representation>
      </g>
      <resource-representation v-for="item in neighbors"
                               :key="item.id"
                               :x="30000*item.reduction_coordinates[0]"
                               :y="30000*item.reduction_coordinates[1]"
                               :item="item">
      </resource-representation>
    </svg-container>
  </div>
</template>

<script>
    module.exports = {
        components: {
            'svg-container': httpVueLoader('js/SvgContainer.vue'),
            'resource-representation': httpVueLoader('js/ResourceRepresentation.vue'),
        },
        props: [ "reference", "neighbors" ]
    }
</script>

  <style scoped>
  svg {
    width: 95vw;
    height: 95vh;
  }
</style>
