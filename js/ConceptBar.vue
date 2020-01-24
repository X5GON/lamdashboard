<template>
  <svg-container viewbox="-3 -3 210 6" preserve_aspect_ratio="none">
    <g v-for="(item, index) in reversed_concepts"
       :class="concept_class(item)"
       :id="`concept${concept_count-index}`">
      <path fill="none"
            stroke-linecap="round" stroke-opacity="1" stroke-width="5"
            @mouseover="on_concept_mouseover(item)"
            :stroke="color_palette(index)"
            :d="`M 0 0 l ${x_concept[concept_count-index-1]} 0`"></path>
      <text :transform="`translate(${(x_concept[concept_count-index-2] || 0) + 5} 1)`"
            @mouseover="on_concept_mouseover(item)"
            fill="#fff"
            font-family="Open Sans"
            font-size="3">{{ item.label }}</text>
    </g>
  </svg-container>
</template>

  <script>
    module.exports = {
        props: {
            concepts: Array, // Array of { label, value } elements
        },
        methods: {
            color_palette: function (i) {
                return this.$constant.palette.concepts[i];
            },
            on_concept_mouseover: function (concept) {
                this.$emit("concept_mouseover", concept);
            },
            concept_class: function (c) {
                return [ "concept", `concept-${c.url.replace(/.*\//, '')}` ];
            }
        },
        computed: {
            concept_count: function () {
                return this.concepts.length;
            },
            scale: function () {
                return d3.scaleLinear()
                    .domain([ 0, 1 ])
                    .range([ 0, 200 ]);
            },
            reversed_concepts: function () {
                return this.concepts.slice().reverse();
            },
            x_concept: function () {
                // Return an array with stacked lengths
                let values = this.concepts.map(c => c.value);
                let total = values.reduce((a, b) => a+b);
                let s = 0;
                let lengths = values.reduce((result, v) => { s = s + v / total;
                                                             result.push(s  * 200);
                                                             return result }, []);
                return lengths;
            }
        }
    };
</script>

<style scoped>
    g.concept {
        pointer-events: bounding-box;
    }
    g.concept:hover text {
        font-weight: 800;
    }
</style>
