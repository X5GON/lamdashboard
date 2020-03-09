<template>
  <div v-if="item" @mouseover="on_mouseover" class="view-itemdetail" :class="{ miniature: miniature }">
    <div class="itemdetail-representation">
      <svg-container :viewbox="legend ? '0 0 110 160' : '0 0 110 110'">
        <resource-representation :item="item"
                                 :max_width="40" :max_height="100"
                                 detailed_concepts
                                 :x="legend ? 70 : 55" :y="legend ? 70 : 50"
                                 :legend="legend"
                                 :title="representation_title"></resource-representation>
      </svg-container>
    </div>
    <div class="itemdetail-title">{{ item.title }}</div>
    <div class="itemdetail-provider">{{ item ? item.provider : "" }}</div>
    <div class="itemdetail-author">{{ item.authors ? item.authors.join(", ") : "" }}</div>
    <slot></slot>
  </div>
</template>

<script>
    module.exports = {
        name: "ItemDetail",
        props: {
            item: Object,
            legend: { type: Boolean,
                      default: false },
            miniature: { type: Boolean,
                         default: false },
        },
        computed: {
            representation_title: function () {
                return this.miniature ? '' : this.item.title;
            },
        },
        methods: {
            on_mouseover: function () {
                this.$emit("mouseover", this.item);
            }
        },
    };
</script>

<style scoped>
  .view-itemdetail {
    display: flex;
    position: relative;
    flex-direction: column;
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
      position: absolute;
      top: 1em;
      width: 100%;
  }
  .itemdetail-provider, .itemdetail-author {
      height: 1.2em;
      width: 100%;
      position: absolute;
      bottom: 4em;
      width: 100%;
  }
  .itemdetail-author {
      bottom: 2em;
  }

  .itemdetail-representation {
      width: 100%;
  }

  .view-itemdetail.miniature {
      text-align: center;
      overflow: hidden;
      padding: 5px;
  }
  .miniature .itemdetail-title {
      font-family: 'Roboto Mono';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      position: relative;
      text-align: center;
  }
  .miniature .itemdetail-provider,
  .miniature .itemdetail-author {
      display: none;
  }

</style>
