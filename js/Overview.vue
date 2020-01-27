<template>
  <div class="view-overview"
       :class="{ fullscreen: is_fullscreen }">
    <neighbor-graph class="neighbor-graph"
                    @resource_mouseover="on_mouseover"
                    :highlight_concept="highlighted_concept"
                    :reference="overview_reference"
                    :neighbors="overview_neighbors"></neighbor-graph>
    <div class="toolbar">
      <img class="toolbar-icon"
           title="Help"
           alt="?"
           @click="show_help"
           src="img/help.svg"></img>
      <count-overlay class="toolbar-icon-basket toolbar-icon"
                     :count="basket_count">
        <img class="toolbar-icon"
             title="Show basket"
             alt="Basket"
             @click="show_basket"
             src="img/basket.svg"></img>
      </count-overlay>
      <img class="toolbar-icon-debug toolbar-icon"
           title="Populate"
           @click="populate"
           src="img/debug_icon.svg"></img>
    </div>
    <div class="toolbar-left">
      <img class="toolbar-icon"
           title="Search"
           @click="show_search"
           src="img/search.svg"></img>
    </div>
    <div v-if="active_resource" class="resource-information">
      <div class="toolbar-fullscreen">
        <img class="toolbar-icon toolbar-icon-fullscreen"
             title="Toggle fullscreen"
             src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
             alt=" "
             @click="toggle_fullscreen"></img>
      </div>
      <div class="resource-metadata">
        <svg-container class="resource-representation">
          <resource-representation
            :x="70"
            :y="70"
            :item="active_resource"
            :title="active_resource.title"></resource-representation>
        </svg-container>
        <img @click="add_to_basket"
             alt="Add"
             title="Add resource to basket"
             class="add-to-basket-icon toolbar-icon"
             src="img/add_to_basket.svg"></img>
        <h2>Resource information</h2>
        <ul class="resource-metadata-list">
          <li v-for="info in active_resource_metadata" :key="info.id">
            <span class="resource-metadata-label">{{ info.label }}</span>
            <span class="resource-metadata-value">{{ info.value }}</span>
          </li>
        </ul>
      </div>
      <div class="resource-content">
        <div class="resource-content-titlebar">
          <h1>{{ active_resource.title }}</h1>
          <concept-bar
            class="resource-content-conceptbar"
            @concept_mouseover="on_bar_mouseover"
            @concept_mouseout="on_bar_mouseout"
            :concepts="active_resource_concepts"></concept-bar>
        </div>
        <p>Provider: {{ active_resource.provider }}</p>
        <p>Author: {{ active_resource.author ? active_resource.author.join(", ") : "" }}</p>
        <div class="resource-content-columns">
          <bar-legend class="resource-content-keywords"
                      title="Keywords"
                      :items="active_resource_keywords"></bar-legend>
          <div class="resource-content-content">
            <h2>Resource content</h2>
            <div class="resource-content-text">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    module.exports = {
        data: function () {
            return {
                active_resource: this.overview_reference,
                highlighted_concept: null,
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
            on_mouseover: function (item) {
                this.active_resource = item;
            },
            on_bar_mouseover: function (concept) {
                this.highlighted_concept = concept.url;
            },
            on_bar_mouseout: function (concept) {
                this.highlighted_concept = null;
            },
            toggle_fullscreen: function () {
                console.log("Toggle fullscreen", this.is_fullscreen);
                this.is_fullscreen = ! this.is_fullscreen;
            },
            add_to_basket: function () {
                if (this.active_resource) {
                    this.$store.dispatch('add_to_basket', this.active_resource);
                }
            },
            show_basket: function () {
                this.$router.push('/basket');
            },
            show_help: function () {
            },
            show_search: function () {
                this.$router.push({ path: '/search', query: { q: this.query }});
            },
            populate: function () {
              // Debug function
              this.$store.dispatch('populate_basket', 5);
          }

        },
        computed: {
            ...Vuex.mapState([ "overview_reference", "overview_neighbors", "query" ]),
            active_resource_metadata: function () {
                if (this.active_resource) {
                    return [ [ 'id', 'Identifier' ],
                             [ 'url', 'URL' ],
                             [ 'license', 'License' ],
                             [ 'length', 'Length' ],
                             [ 'orig_lang', 'Language' ],
                             [ 'type', 'Modality' ],
                             [ 'difficulty', 'Difficulty' ] ].map( ([id, label]) => ({
                                 id: id,
                                 label: label,
                                 value: this.active_resource[id]
                             }))
                } else {
                    return [];
                };
            },
            active_resource_keywords: function () {
                if (!this.active_resource)
                    return [];
                return this.active_resource
                    .keywords
                    .slice(0, 5)
                    .map( ([label, value], i) => ({ label, value,
                                                    width: value * 200,
                                                    color: this.$constant.palette.concepts[i]
                                                  }));
            },
            active_resource_concepts: function () {
                if (!this.active_resource)
                    return [];
                return this.active_resource
                    .wikifier
                    .slice(0, 5)
                    .map( ([label, url, ignore, value], i) => ({ label,
                                                                 value,
                                                                 url,
                                                                 color: this.$constant.palette.concepts[i]
                                                               }));
            },
            basket_count: function () {
                return this.$store.state.basket.length;
            }
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
  .resource-information {
      position: relative;
      background-color: #fff;
      display: flex;
      flex-direction: row;
      font-family: IBM Plex Serif;
      font-size: 12px;
      line-height: 18px;
      color: #000;
  }
  .resource-information h2 {
      font-size: 18px;
      font-weight: 600;
      margin-top: 18px;
  }
  .toolbar-fullscreen {
      position: absolute;
      top: 13px;
      left: 13px;
  }
  .toolbar-icon-fullscreen {
      pointer-events: all;
      box-sizing: border-box;
      background: url(../img/overview_fullscreen.svg) center center no-repeat;
  }
  .fullscreen .toolbar-icon-fullscreen {
      background: url(../img/overview_halfscreen.svg) center center no-repeat;
  }
  .resource-metadata {
      background: linear-gradient(180deg, #3E1966 0%, rgba(153, 159, 178, 0) 100%);
      height: 100%;
      width: 15%;
      overflow-y: hidden;
      color: #4f4f4f;
      padding: 12px;
  }
  .resource-metadata-list {
      list-style: none;
  }
  .resource-representation {
      width: 40%;
      margin: auto;
  }
  .resource-content {
      padding: 20px;
      width: calc(100% - 40px);
      font-size: 17px;
  }
  .resource-content h1 {
      font-size: 28px;
      line-height: 34px;
  }
  .fullscreen .resource-information {
      color: white;
      background-color: #000d32;
  }
  .fullscreen .resource-content-titlebar {
      height: 120px;
  }
  .fullscreen .resource-metadata {
      margin-top: 120px;
  }
  .resource-content-columns {
      display: flex;
      flex-direction: row;
  }
  .resource-content-keywords {
      margin-right: 20px;
      width: 210px;
  }
  .resource-content-text {
      font-size: 16px;
  }
  .resource-content-conceptbar svg {
      width: 80%;
      height: 30px;
  }
  .toolbar-icon {
      position: relative;
      width: 32px;
      height: 32px;
  }
  .toolbar-icon + .toolbar-icon {
      margin-top: 12px;
  }
  .toolbar {
      position: absolute;
      top: 30px;
      right: 22px;
      display: flex;
      flex-direction: column;
  }
  .toolbar-left {
      position: absolute;
      left: 22px;
      top: 120px;
      display: flex;
      flex-direction: column;
  }
</style>
