<template>
  <g @mouseover="on_mouseover" @click="on_click" @dblclick="on_dblclick"
     :transform="`translate(${x}, ${y}) scale(1,-1)`">
    <circle id="circle" fill="url(#paint0_radial)" fill-opacity="1" fill-rule="nonzero" stroke="none" cx="0" cy="0" :r="radius"></circle>
    <path v-for="(item, index) in reversed_concepts"
          :id="`concept${concept_count-index}`"
          @mouseover="on_concept_mouseover(item)"
          fill="none"
          stroke-linecap="round" stroke-opacity="1" stroke-width="4"
          :stroke="color_palette(index)"
          :d="`M 0 0 l 0 ${y_concept[concept_count-index-1]}`"></path>
    <text v-if="title" :transform="`translate(-4, 0) rotate(90) scale(1,-1)`" fill="#fff" font-family="Open Sans" font-size="4">{{ title }}</text>
    <g v-if="legend" id="legend">
      <g id="difficulty_hint">
        <path fill="none" stroke="#505973" stroke-width=".15" stroke-dasharray=".5 1"
              :d="`M 0 ${bar_height+2} l -${difficulty_legend_offset} 0`"></path>
        <path fill="none" stroke="#505973" stroke-width=".15" stroke-dasharray=".5 1"
              :d="`M 0 -2 l -${difficulty_legend_offset} 0`"></path>
        <path fill="none" stroke="#505973" stroke-width=".15"
              :d="`M -${difficulty_legend_offset} -2 l 0 ${bar_height+4}`"
              marker-start="url(#triangle)"
              marker-end="url(#triangle)"></path>
        <text :transform="`translate(-${difficulty_legend_offset + 1}, ${bar_height/2-10}) rotate(90) scale(1,-1)`"
              fill="#505973"
              font-family="Open Sans"
              font-size="3">DIFFICULTY</text>
      </g>
      <g id="length_hint">
        <path fill="none" stroke="#505973" stroke-width=".15" stroke-dasharray=".5 1"
              :d="`M -${radius} -2 l 0 -${radius+5}`"></path>
        <path fill="none" stroke="#505973" stroke-width=".15" stroke-dasharray=".5 1"
              :d="`M ${radius} -2 l 0 -${radius+5}`"></path>
        <path fill="none" stroke="#505973" stroke-width=".15"
              :d="`M -${radius} -${radius+5} l ${2*radius} 0`"
              marker-start="url(#triangle)"
              marker-end="url(#triangle)"></path>
        <text :transform="`translate(-6, -${radius+9}) scale(1,-1)`"
              fill="#505973"
              font-family="Open Sans"
              font-size="3">LENGTH</text>
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
            max_width: {
                type: Number,
                default: 50
            },
            max_height: {
                type: Number,
                default: 105
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
            on_mouseover: function () {
                this.$emit("resource_mouseover", this.item);
            },
            on_click: function () {
                this.$emit("resource_click", this.item);
            },
            on_dblclick: function () {
                this.$emit("resource_dblclick", this.item);
            },
            on_concept_mouseover: function (concept) {
                this.$emit("concept_mouseover", concept);
            },
        },
        computed: {
            duration_scale: function () {
                // Map duration (in s) to radius (in px)
                return d3.scaleLinear()
                    .domain([ 60, this.max_duration ])
                    .range([ 10, this.legend ? this.max_width + 30 : this.max_width ]);
            },
            difficulty_scale: function () {
                // Map length (in w/s) to bar length (in px)
                return d3.scaleLinear()
                    .domain([ 1, this.max_difficulty ])
                    .range([ 30, this.max_height - this.max_width / 2 ]);
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
            difficulty_legend_offset: function () {
                return this.max_width + 10;
            },
            length_legend_offset: function () {
                return this.max_width / 2 + 10;
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
