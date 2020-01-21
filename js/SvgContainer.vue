<template>
  <svg xmlns="http://www.w3.org/2000/svg" :view-box.camel="viewbox" preserveAspectRatio="xMidYMid">
    <defs>
      <radialGradient id="paint0_radial">
        <stop stop-color="#ff9059" stop-opacity="1" offset="0"/>
        <stop stop-color="#ff9059" stop-opacity="0.2" offset="1"/>
      </radialGradient>
      <marker id="triangle" viewBox="0 0 20 20"
              refX="10" refY="10"
              markerWidth="20" markerHeight="20"
              orient="auto-start-reverse">
        <path d="M 0 0 l 10 10 l -10 10" stroke="#505973" fill="none" />
      </marker>
    </defs>
    <rect v-if="debug" x="0" y="0" width="100%" height="100%" stroke="#fff" stroke-opacity="1" stroke-width=".1" fill="none" />
    <rect v-if="debug" x="0" y="0" width="100" height="100" stroke="#ff0" stroke-opacity="1" stroke-width=".1" fill="none" />
    <slot></slot>
  </svg>
</template>

<script>
    module.exports = {
        props: {
            viewbox: {
                type: String,
                default: "0 0 110 130"
            },
            debug: {
                type: Boolean,
                default: true
            },
        }
    };
</script>

  <style scoped>
</style>
