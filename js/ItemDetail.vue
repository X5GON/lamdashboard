<template>
  <div v-if="item" class="view-itemdetail">
    <div class="itemdetail-title">{{ item ? item.title : "" }}</div>
    <div class="itemdetail-representation">
      <svg-container>
        <resource-representation :item="item"
                                 :max_width="30" :max_height="100"
                                 :x="70" :y="70"
                                 :legend="legend"
                                 :title="item.title"></resource-representation>
      </svg-container>
    </div>
    <div class="itemdetail-provider">{{ item ? item.provider : "" }}</div>
    <div class="itemdetail-author">{{ item.author ? item.author.join(", ") : "" }}</div>
  </div>
</template>

<script>
    module.exports = {
        props: {
            item: Object,
            legend: {
                type: Boolean,
                default: false
            }
        },
    };
</script>

<style scoped>
  .view-itemdetail {
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
      height: 1.2em;
  }
  .itemdetail-representation {
      margin: auto;
      margin-top: 20%;
  }
  .miniature .itemdetail-title {
      font-style: 12px;
  }
</style>
