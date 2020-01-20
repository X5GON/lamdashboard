<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="svg_width()" viewBox="0 0 110 130" preserveAspectRatio="xMidYMid">
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
    <rect x="0" y="0" width="100%" height="100%" stroke="none" stroke-opacity="1" stroke-width=".1" fill="none" />
    <slot></slot>
  </svg>
</template>

<script>
    module.exports = {
        methods: {
            svg_width: function () {
                return this.$el.clientWidth;
            },
        },
    };
</script>

<style scoped>
</style>
