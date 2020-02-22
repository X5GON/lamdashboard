<template>
    <component v-bind:is="wrapper" :options="zoom_options" @init="panzoom_init" selector=".zoomable">
      <svg xmlns="http://www.w3.org/2000/svg" :view-box.camel="viewbox" :preserve-aspect-ratio.camel="preserve_aspect_ratio">
        <defs>
          <radialGradient id="paint0_radial">
            <stop stop-color="#ffffff" stop-opacity=".9" offset="0"/>
            <stop stop-color="#ffffff" stop-opacity=".4" offset="1"/>
          </radialGradient>
          <marker id="triangle" viewBox="0 0 20 20"
                  refX="10" refY="10"
                  markerWidth="20" markerHeight="20"
                  orient="auto-start-reverse">
            <path d="M 0 0 l 10 10 l -10 10" stroke="#505973" fill="none" />
          </marker>
        </defs>
        <g class="zoomable">
          <rect v-if="debug" x="0" y="0" width="100%" height="100%" stroke="#fff" stroke-opacity="1" stroke-width=".1" fill="none" />
          <rect v-if="debug" x="0" y="0" width="100" height="100" stroke="#ff0" stroke-opacity="1" stroke-width=".1" fill="none" />
          <slot></slot>
        </g>
      </svg>
    </component>
</template>

<script>
    module.exports = {
        name: "SvgContainer",
        state: function () {
            return {
                panzoom: null,
            }
        },
        props: {
            viewbox: {
                type: String,
                default: "0 0 110 130"
            },
            preserve_aspect_ratio: {
                type: String,
                default: "xMidYMid"
            },
            debug: {
                type: Boolean,
                default: false
            },
            zoomable: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            wrapper: function () {
                if (this.zoomable)
                    return "pan-zoom"
                else
                    return "div";
            },
            zoom_options: function () {
                if (this.zoomable)
                    return { minZoom: 0.2,
                             maxZoom: 10 }
                else
                    return null;
            },
        },
        methods: {
            panzoom_init: function (panzoom_instance, id) {
                console.log("Panzoom init", panzoom_instance, id);
                this.panzoom = panzoom_instance;
                this.panzoom.moveTo(0, -100);
            },
        }
    };
</script>

  <style scoped>
</style>
