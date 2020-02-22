<template>
  <div class="view-overview"
       :class="{ fullscreen: is_fullscreen }">
    <div class="main-content">
      <neighbor-graph class="neighbor-graph"
                      @resource_mouseover="on_mouseover"
                      @resource_click="on_resource_click"
                      :highlight_concept="highlighted_concept"
                      :concept_palette="concept_palette"
                      :reference="overview_reference"
                      :neighbors="overview_neighbors"></neighbor-graph>
      <img class="toolbar-icon-fullscreen"
           title="Toggle fullscreen"
           src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
           alt=" "
           @click="toggle_fullscreen"></img>
    </div>
    <x5gon-toolbar>
      <img class="toolbar-icon-debug toolbar-icon"
           title="Populate"
           @click="populate"
           src="img/debug_icon.svg"></img>
    </x5gon-toolbar>
    <resource-information-panel v-if="active_resource"
                                :resource="active_resource"
                                :reference_resource="overview_reference"
                                :concept_palette="concept_palette"
                                :is_fullscreen="is_fullscreen"
                                @concept_mouseover="on_concept_mouseover"
                                @concept_mouseout="on_concept_mouseout">
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
            toggle_fullscreen: function () {
                this.is_fullscreen = ! this.is_fullscreen;
            },
            populate: function () {
              // Debug function
              this.$store.dispatch('populate_basket', 5);
            },
            on_concept_mouseover: function (url) {
                this.highlighted_concept = url;
            },
            on_concept_mouseout: function (url) {
                this.highlighted_concept = null;
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
                if (! this.overview_reference
                    ||
                    this.overview_reference.id != Number(this.$route.params.id)) {
                this.$store.dispatch('activate_overview_reference', this.$route.params.id);
                }
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
  .main-content {
      position: relative;
  }
  .neighbor-graph svg {
      width: 99.9vw;
      height: 50vh;
  }
  .fullscreen .neighbor-graph svg {
      height: calc(100vh - 120px);
  }
  .toolbar-icon {
      position: relative;
      width: 32px;
      height: 32px;
  }
  .toolbar-icon-fullscreen {
      position: absolute;
      width: 32px;
      height: 32px;
      left: 16px;
      bottom: 8px;
      pointer-events: all;
      box-sizing: border-box;
      background: url(../img/overview_fullscreen.svg) center center no-repeat;
  }
  .fullscreen .toolbar-icon-fullscreen {
      background: url(../img/overview_halfscreen.svg) center center no-repeat;
  }
</style>
