<template>
  <svg-container viewbox="-3 -3 210 6" preserve_aspect_ratio="none">
    <g v-for="(item, index) in reversed_concepts"
       :id="`concept${concept_count-index}`">
      <path fill="none"
            stroke-linecap="round" stroke-opacity="1" stroke-width="5"
            :stroke="color_palette(index)"
            :d="`M 0 0 l ${x_concept[concept_count-index-1]} 0`"></path>
      <text :transform="`translate(${(x_concept[concept_count-index-2] || 0) + 5} 1)`"
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
        components: {
            'svg-container': httpVueLoader('js/SvgContainer.vue'),
        },
        methods: {
            color_palette: function (i) {
                return this.$constant.palette.concepts[i];
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
</style>
