<template>
  <g :transform="`translate(${x}, ${y}) scale(1,-1)`">
    <circle id="circle" fill="url(#paint0_radial)" fill-opacity="1" fill-rule="nonzero" stroke="none" cx="0" cy="0" :r="radius"></circle>
    <path v-for="(item, index) in reversed_concepts"
          :id="`concept${concept_count-index}`"
          fill="none"
          stroke-linecap="round" stroke-opacity="1" stroke-width="4"
          :stroke="color_palette(index)"
          :d="`M 0 0 l 0 ${y_concept[concept_count-index-1]}`"></path>
    <text v-if="title" :transform="`translate(-4, 0) rotate(90) scale(1,-1)`" fill="#fff" font-family="Open Sans" font-size="4">{{ title }}</text>
    <g v-if="legend" id="legend">
      <g id="difficulty_hint">
        <path fill="none" stroke="#505973" stroke-width=".15" stroke-dasharray=".5 1" :d="`M 0 ${bar_height+2} l -60 0`"></path>
        <path fill="none" stroke="#505973" stroke-width=".15" stroke-dasharray=".5 1" d="M 0 -2 l -60 0"></path>
        <path fill="none" stroke="#505973" stroke-width=".15" :d="`M -60 -2 l 0 ${bar_height+4}`" marker-start="url(#triangle)" marker-end="url(#triangle)"></path>
        <text :transform="`translate(-61, ${bar_height/2-10}) rotate(90) scale(1,-1)`" fill="#505973" font-family="Open Sans" font-size="3">DIFFICULTY</text>
      </g>
      <g id="length_hint">
        <path fill="none" stroke="#505973" stroke-width=".15" stroke-dasharray=".5 1" :d="`M -${radius} -2 l 0 -${radius+5}`"></path>
        <path fill="none" stroke="#505973" stroke-width=".15" stroke-dasharray=".5 1" :d="`M ${radius} -2 l 0 -${radius+5}`"></path>
        <path fill="none" stroke="#505973" stroke-width=".15" :d="`M -${radius} -${radius+5} l ${2*radius} 0`" marker-start="url(#triangle)" marker-end="url(#triangle)"></path>
        <text :transform="`translate(-6, -${radius+9}) scale(1,-1)`" fill="#505973" font-family="Open Sans" font-size="3">LENGTH</text>
      </g>
    </g>
  </g>
</template>

  <script>
    /*
      Representation of a resource. It expects to fit in a 0 0 110 120
      viewbox.
    */
    module.exports = {
        props: {
            item: Object,
            title: {
                type: String,
                default: null
            },
            legend: {
                type: Boolean,
                default: false
            },
            max_duration: {
                type: Number,
                default: 100000
            },
            max_difficulty: {
                type: Number,
                default: 40
            },
            concept_count: {
                type: Number,
                default: 5
            },
            x: {
                type: Number,
                default: 0
            },
            y: {
                type: Number,
                default: 0
            }
        },
        methods: {
            color_palette: function (i) {
                return this.$constant.palette.concepts[i];
            },
        },
        computed: {
            duration_scale: function () {
                return d3.scaleLinear()
                    .domain([ 60, this.max_duration ])
                    .range([ 20, 50 ]);
            },
            difficulty_scale: function () {
                return d3.scaleLinear()
                    .domain([ 1, this.max_difficulty ])
                    .range([ 40, 80 ]);
            },
            radius: function () {
                // FIXME: replace with item.duration when OK
                return this.duration_scale(this.item ? this.item.length : 0);
            },
            bar_height: function () {
                return this.difficulty_scale(this.item.technicities);
            },
            concepts: function () {
                let count = this.concept_count;
                return this.item ? this.item.wikifier.slice(0, count) : [];
            },
            reversed_concepts: function () {
                return this.concepts.slice().reverse();
            },
            y_concept: function () {
                // Return an array with stacked lengths
                let values = this.concepts.map(c => c[3]);
                let total = values.reduce((a, b) => a+b);
                let h = this.bar_height;
                let s = 0;
                let heights = values.reduce((result, v) => { s = s + v / total;
                                                             result.push(s  * h);
                                                             return result }, []);
                return heights;
            }
        }
    };
</script>

<style scoped>
</style>
