<template>
  <div v-if="item" class="view-itemdetail">
    <div class="itemdetail-title">{{ item ? item.title : "" }}</div>
    <div class="itemdetail-representation">
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
        <resource-representation :item="item"></resource-representation>
      </svg>
    </div>
    <div class="itemdetail-provider">{{ item ? item.provider : "" }}</div>
    <div class="itemdetail-author">{{ item ? item.author : "" }}</div>
  </div>
</template>

<script>
    module.exports = {
        props: {
            item: Object,
        },
        components: {
            'resource-representation': httpVueLoader('js/ResourceRepresentation.vue'),
        },
        methods: {
            svg_width: function () {
                return this.$el.clientWidth * .8;
            },
        },
    };
</script>

<style scoped>
  .view-itemdetail {
    width: 100%;
    height: 100%;
    padding-left: 35px;
    padding-right: 35px;
  }
  .itemdetail-title {
      color: #fff;
      font-family: IBM Plex Serif;
      font-style: normal;
      font-weight: 500;
      font-size: 26px;
      line-height: 31px;
      height: 3em;
      margin-top: 1em;
  }
  .itemdetail-provider, .itemdetail-author {
      height: 2em;
  }
  .itemdetail-representation {
      margin: auto;
      margin-top: 20%;
  }
</style>
