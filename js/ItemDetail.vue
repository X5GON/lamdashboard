<template>
  <div class="view-itemdetail">
    <div class="itemdetail-name">{{ item.name }}</div>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 100" preserveAspectRatio="xMidYMid">
      <defs>
        <radialGradient id="paint0_radial" cx="0" cy="0" r="100%" fx="0" fy="0" gradientUnits="objectBoundingBox" transform="translate(100%)" spreadMethod="pad">
      <stop stop-color="#ff9059" stop-opacity="1" offset="0"/>
      <stop stop-color="#ff9059" stop-opacity="0.2" offset="1"/>
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="50" height="100" stroke="black" stroke-opacity="1" stroke-width=".1" fill="none" />
      <g transform="translate(25, 75) scale(1,-1)">
        <circle id="circle" fill="url(#paint0_radial)" fill-opacity="1" fill-rule="nonzero" stroke="none" cx="0" cy="0" r="25"/>
        <path id="concept1" fill="none" stroke="#3e1966" stroke-linecap="round" stroke-opacity="1" stroke-width="5" d="M 0 0 L 0 15"/>
        <path id="concept2" fill="none" stroke="#933b50" stroke-linecap="round" stroke-opacity="1" stroke-width="5" d="M 0 15 L 0 20"/>
        <path id="concept3" fill="none" stroke="#be4b4d" stroke-linecap="round" stroke-opacity="1" stroke-width="5" d="M 0 20 L 0 30"/>
        <path id="concept4" fill="none" stroke="#e95c44" stroke-linecap="round" stroke-opacity="1" stroke-width="5" d="M 0 30 L 0 40"/>
        <path id="concept5" fill="none" stroke="#505973" stroke-linecap="round" stroke-opacity="1" stroke-width="5" d="M 0 40 L 0 45"/>
      </g>
    </svg>
  </div>
</template>

<script>
  module.exports = {
      data: function() {
          return {
          }
      },
      props: {
          item: Object
      }
      methods: {
      }
  }
</script>

<style scoped>
</style>
