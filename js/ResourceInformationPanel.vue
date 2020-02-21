<template>
  <div class="resource-information" :class="{ fullscreen: is_fullscreen }">
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
          detailed_concepts
          :item="resource"
          is_reference></resource-representation>
      </svg-container>
      <h2>Resource information</h2>
      <ul class="resource-metadata-list">
        <li v-for="info in resource_metadata" :key="info.id">
          <span class="resource-metadata-label">{{ info.label }}</span>
          <span class="resource-metadata-value">{{ info.value }}</span>
        </li>
      </ul>
    </div>
    <div class="resource-content">
      <div class="resource-content-titlebar">
        <h1>{{ resource.title }}</h1>
        <concept-bar
          class="resource-content-conceptbar"
          @concept_mouseover="on_bar_mouseover"
          @concept_mouseout="on_bar_mouseout"
          :concepts="resource_concepts"></concept-bar>
        <concept-bar
          class="resource-content-conceptbar-small"
          @concept_mouseover="on_bar_mouseover"
          @concept_mouseout="on_bar_mouseout"
          :height="2"
          :concepts="reference_resource_concepts"></concept-bar>
      </div>
      <p>Provider: {{ resource.provider }}</p>
        <p>Author: {{ resource.author ? resource.author.join(", ") : "" }}</p>
        <div class="resource-content-columns">
          <bar-legend class="resource-content-keywords"
                      title="Keywords"
                      :items="resource_keywords"></bar-legend>
          <div class="resource-content-content">
            <h2>Resource content</h2>
            <div class="resource-content-description">
              {{ resource.description }}
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
    module.exports = {
        name: "ResourceInformationPanel",
        props: {
            resource: { type: Object,
                        default: null },
            concept_palette: { type: Function,
                               default: (u) => "#f00"
                             },
            is_fullscreen: { type: Boolean,
                             default: false },
        },
        methods: {
            on_bar_mouseover: function (concept) {
                this.$emit("concept_mouseover", concept.url);
            },
            on_bar_mouseout: function (concept) {
                this.$emit("concept_mouseout", concept.url);
            },
            toggle_fullscreen: function () {
                this.$emit("toggle_fullscreen");
            },
            colorized_concepts: function (concepts) {
                return concepts.map(concept => ({
                    ...concept,
                    color: this.concept_palette(concept.url)
                }));
            },
        },
        computed: {
            ...Vuex.mapState([ "overview_reference" ]),
            resource_metadata: function () {
                if (this.resource) {
                    return [ [ 'id', 'Identifier' ],
                             [ 'url', 'URL' ],
                             [ 'license', 'License' ],
                             [ 'length', 'Length' ],
                             [ 'orig_lang', 'Language' ],
                             [ 'type', 'Modality' ],
                             [ 'difficulty', 'Difficulty' ] ].map( ([id, label]) => ({
                                 id: id,
                                 label: label,
                                 value: this.resource[id]
                             }))
                } else {
                    return [];
                };
            },
            resource_keywords: function () {
                if (!this.resource)
                    return [];
                return this.resource
                    .keywords
                    .map( (kw, i) => ({ label: kw.label,
                                        value: kw.value,
                                        width: kw.value * 200,
                                        color: this.$constant.palette.blue_concepts[i]
                                      }));
            },
            resource_concepts: function () {
                return this.resource ? this.colorized_concepts(this.resource.common_wikifier) : [];
            },
            reference_resource_concepts: function () {
                return this.overview_reference ? this.colorized_concepts(this.overview_reference.common_wikifier) : [];
            },
        },
    }
</script>

<style type="text/css">
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
  .toolbar-icon {
      position: relative;
      width: 32px;
      height: 32px;
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
      background: #40CB76;
      height: 100%;
      width: 15%;
      overflow-y: hidden;
      color: #000;
      padding: 12px;
  }
  .resource-metadata-list {
      list-style: none;
  }
  .resource-representation {
      width: 90%;
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
  .fullscreen.resource-information {
      color: white;
      background-color: #343637;
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
  .resource-content-content h2 {
      font-family: IBM Plex Serif;
      font-size: 18px;
      font-weight: 600;
      padding-bottom: 6px;
  }
  .resource-content-description {
      font-family: Open Sans;
      font-size: 16px;
  }
  .resource-content-conceptbar svg {
      width: 80%;
      height: 30px;
  }
  .resource-content-conceptbar-small svg {
      width: 80%;
      height: 10px;
  }
</style>
