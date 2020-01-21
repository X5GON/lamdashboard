<template>
  <div class="view-search">
    <result-drawer class="left-drawer" :results="search_results" @active="set_active"></result-drawer>
    <div class="right-drawer">
      <item-detail :style="{ width: '70%' }" :item="active_resource" :key="active_resource_id"></item-detail>
      <bar-legend :style="{ width: '25%' }" title="Concepts" :items="active_resource_legend"></bar-legend>
    </div>
  </div>
</template>

<script>
    module.exports = {
        components: {
            'result-drawer': httpVueLoader('js/ResultDrawer.vue'),
            'item-detail': httpVueLoader('js/ItemDetail.vue'),
            'bar-legend': httpVueLoader('js/BarLegend.vue')
        },
        props: {
        },
        data: function() {
            return {
                active_resource: null
            }
        },
        methods: {
          set_active: function (resource) {
              this.active_resource = resource;
          }
        },
        mounted: function () {
            if (this.$route.query.q != this.$store.state.query) {
                this.$store.dispatch('submit_query', this.$route.query.q);
            }
        },
        computed: {
            ...Vuex.mapState([ "search_results" ]),
            active_resource_id: function () {
                return this.active_resource !== null ? this.active_resource.url : "null";
            },
            active_resource_legend: function () {
                // Get the 5 top concepts of the resource
                if (this.active_resource === null)
                    return null;
                return (this.active_resource.wikifier || []).slice(0, 5).map((t, i) => ({ label: t[0],
                                                                                  url: t[1],
                                                                                  value: t[3],
                                                                                  width: t[3] * 200,
                                                                                  color: [ "#3e1966", "#933b50", "#be4b4d", "#e95c44", "#505973" ][i]
                                                                                }));
            }
        }
    }
</script>

  <style type="text/css">
  .view-search {
    width: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
  }
  .left-drawer, .right-drawer {
      margin: 0;
      padding: 0;
      width: 50%;
  }
  .right-drawer {
      position: fixed;
      top: 0;
      bottom: 0;
      right: 0;
      display: flex;
      flex-direction: row;
      height: 100vh;
      align-items: center;
      justify-content: space-between;
  }
</style>
