<template>
  <svg-container :viewbox="`-3 -3 ${width} 6`" preserve_aspect_ratio="none">
    <g v-for="(item, index) in concepts"
       :class="concept_class(item)"
       :id="`concept${index+1}`">
      <path fill="none"
            stroke-opacity="1" stroke-width="5"
            @mouseover="on_concept_mouseover(item)"
            @mouseout="on_concept_mouseout(item)"
            :stroke="item.color"
            :d="`M ${x_concept[index-1] || 0} 0 L ${width-10} 0`"></path>
      <text :transform="`translate(${(x_concept[index-1] || 0) + 2} 1)`"
            @mouseover="on_concept_mouseover(item)"
            fill="#000"
            font-family="Open Sans"
            font-size="3">{{ item.label.toUpperCase() }}</text>
    </g>
  </svg-container>
</template>

  <script>
    module.exports = {
        props: {
            concepts: Array, // Array of { label, value, url, color } elements
            width: {
                type: Number,
                default: 210
            }
        },
        methods: {
            on_concept_mouseover: function (concept) {
                this.$emit("concept_mouseover", concept);
            },
            on_concept_mouseout: function (concept) {
                this.$emit("concept_mouseout", concept);
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
                    .range([ 0, this.width - 10 ]);
            },
            x_concept: function () {
                // Return an array with stacked lengths
                let values = this.concepts.map(c => c.value);
                let total = values.reduce((a, b) => a+b);
                let s = 0;
                let lengths = values.reduce((result, v) => { s = s + v / total;
                                                             result.push(s  * (this.width - 10));
                                                             return result }, []);
                return lengths;
            }
        }
    };
</script>

<style scoped>
    g.concept {
        pointer-events: all;
    }
    g.concept:hover text {
        font-weight: 800;
    }
</style>
