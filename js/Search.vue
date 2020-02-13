<template>
  <div class="view-search">
    <result-drawer class="left-drawer" :results="search_results" @active="set_active"></result-drawer>
    <div class="right-drawer">
      <item-detail :item="active_resource"
                   :style="{ width: '70%' }"
                   legend
                   :key="active_resource_id"></item-detail>
      <bar-legend :items="active_resource_legend"
                  title="Concepts"
                  :style="{ width: '25%' }"></bar-legend>
    </div>
  </div>
</template>

<script>
    module.exports = {
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
                if (this.active_resource === null)
                    return null;
                return Object.values(this.active_resource.wikifier).map((concept, i) => ({ label: concept.label,
                                                                                           url: concept.url,
                                                                                           value: concept.value,
                                                                                           width: concept.value * 200, // FIXME: remove constanat
                                                                                           color: this.$constant.palette.concepts[i]
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
