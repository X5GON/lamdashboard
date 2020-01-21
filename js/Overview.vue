<template>
  <div class="view-overview">
    <neighbor-graph :reference="overview_reference" :neighbors="overview_neighbors"></neighbor-graph>
  </div>
</template>

<script>
    module.exports = {
        components: {
            'neighbor-graph': httpVueLoader('js/NeighborGraph.vue'),
            'item-detail': httpVueLoader('js/ItemDetail.vue'),
        },
        computed: {
            ...Vuex.mapState([ "overview_reference", "overview_neighbors" ]),
        },
        mounted: function () {
            if (this.$route.query.q) {
                this.$store.dispatch('submit_query', this.$route.query.q);
            }
            if (this.$route.query.reference) {
                this.$store.dispatch('activate_reference', this.$route.query.reference);
            }
        }
    }
</script>

<style type="text/css">
  .view-overview {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
  }
</style>
