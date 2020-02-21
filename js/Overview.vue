<template>
  <div class="view-overview"
       :class="{ fullscreen: is_fullscreen }">
    <neighbor-graph class="neighbor-graph"
                    @resource_mouseover="on_mouseover"
                    @resource_click="on_resource_click"
                    :highlight_concept="highlighted_concept"
                    :concept_palette="concept_palette"
                    :reference="overview_reference"
                    :neighbors="overview_neighbors"></neighbor-graph>

    <x5gon-toolbar>
      <img class="toolbar-icon-debug toolbar-icon"
           title="Populate"
           @click="populate"
           src="img/debug_icon.svg"></img>
    </x5gon-toolbar>
    <resource-information-panel v-if="active_resource"
                                :resource="active_resource"
                                :concept_palette="concept_palette">
    </resource-information-panel>
  </div>
</template>

<script>
    module.exports = {
        name: "Overview",
        data: function () {
            return {
                active_resource: this.overview_reference,
                highlighted_concept: null,
                selection_lock: null,
                is_fullscreen: false,
            }
        },
        beforeRouteUpdate: function (to, from, next) {
            this.$store.dispatch('activate_overview_reference', to.params.id);
            next();
        },
        watch: {
            overview_reference: function (new_reference) {
                this.active_resource = new_reference;
            }
        },
        methods: {
            concept_palette: function (url) {
                // Return a color for the given concept
                return this.reference_palette[url] || "#eee";
            },
            on_mouseover: function (item) {
                if (this.selection_lock === null)
                    this.active_resource = item;
            },
            on_resource_click: function (item) {
                this.active_resource = item;
                if (this.selection_lock !== null) {
                    clearTimeout(this.selection_lock);
                }
                this.selection_lock = setTimeout(() => { this.selection_lock = null },
                                                 this.$constant.selection_lock_timeout);
            },
            add_to_basket: function () {
                if (this.active_resource) {
                    this.$store.dispatch('add_to_basket', this.active_resource);
                }
            },
            populate: function () {
              // Debug function
              this.$store.dispatch('populate_basket', 5);
            },
        },
        computed: {
            ...Vuex.mapState([ "overview_reference", "overview_neighbors", "query" ]),
            reference_palette: function () {
                // Return the palette with colors associated to the reference resource concepts
                return Object.fromEntries(this.overview_reference.common_wikifier
                                          .map((wk, i) => [ wk.url,
                                                            this.$constant.palette.concepts[i] ]));
            },
        },
        mounted: function () {
            if (this.$route.query.q) {
                this.$router.push({ path: '/search', query: { q: this.$route.query.q }});
            }
            if (this.$route.params.id) {
                this.$store.dispatch('activate_overview_reference', this.$route.params.id);
            }
        }
    }
</script>

<style type="text/css">
  .view-overview {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
  }
  .neighbor-graph svg {
      width: 99.9vw;
      height: 50vh;
  }
  .fullscreen .neighbor-graph svg {
      height: calc(100vh - 120px);
  }
</style>
