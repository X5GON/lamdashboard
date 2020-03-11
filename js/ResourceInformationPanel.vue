<template>
  <div class="resource-information" :class="{ fullscreen: is_fullscreen }">
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
        <li v-for="info in resource_metadata"
            class="resource-metadata-item"
            :key="info.id">
          <span class="resource-metadata-label">{{ info.label }}</span>
          <a v-if="info.url"
             target="_blank"
             :href="info.url"
             class="resource-metadata-value">{{ info.value }}</a>
          <span v-else
                class="resource-metadata-value">{{ info.value }}</span>
        </li>
      </ul>
    </div>
    <div class="resource-content">
      <div class="resource-content-titlebar">
        <h1>{{ resource.title }}</h1>
        <concept-bar
          class="resource-content-conceptbar"
          :style="{ marginLeft: '-16px' }"
          @concept_mouseover="on_bar_mouseover"
          @concept_mouseout="on_bar_mouseout"
          :concepts="resource_concepts"></concept-bar>
        <concept-bar
          class="resource-content-conceptbar-small"
          :style="{ marginLeft: '-16px' }"
          @concept_mouseover="on_bar_mouseover"
          @concept_mouseout="on_bar_mouseout"
          :height="2"
          :concepts="reference_resource_concepts"></concept-bar>
      </div>
      <p>Provider: {{ resource.provider }}</p>
        <p>Author: {{ resource.authors ? resource.authors.join(", ") : "" }}</p>
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
            reference_resource: { type: Object,
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
            colorized_concepts: function (concepts) {
                return concepts.map(concept => ({
                    ...concept,
                    color: this.concept_palette(concept.url)
                }));
            },
        },
        computed: {
            resource_metadata: function () {
                if (this.resource) {
                    return [ [ 'type', 'Modality' ],
                             [ 'id', 'Identifier' ],
                             [ 'duration', 'Duration' ],
                             [ 'url', 'URL' ],
                             [ 'license', 'License' ],
                             [ 'orig_lang', 'Language' ],
                             [ 'difficulty', 'Difficulty' ] ].map( ([id, label]) => ({
                                 id: id,
                                 label: label,
                                 value: id == 'duration' ? this.$constant.format_duration(this.resource[id]) : this.resource[id],
                                 url: (typeof this.resource[id] == 'string' && this.resource[id].match(/^https?:/)) ? this.resource[id] : undefined,
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
                return this.resource ? this.colorized_concepts(this.resource.common_wikifier || this.resource.wikifier) : [];
            },
            reference_resource_concepts: function () {
                return this.reference_resource ? this.colorized_concepts(this.reference_resource.common_wikifier || this.reference_resource.wikifier) : [];
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
  .resource-metadata-item {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
