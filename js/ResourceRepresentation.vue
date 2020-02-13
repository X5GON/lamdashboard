<template>
  <g :class="concept_classes"
     @mouseover="on_mouseover"
     @click="on_click"
     @dblclick="on_dblclick"
     :transform="`translate(${x}, ${y}) scale(1,-1)`">

      <circle id="circle" fill="url(#paint0_radial)" :fill-opacity="is_reference ? 1 : 0" fill-rule="nonzero" :stroke="resource_stroke" stroke-width="2" cx="0" cy="0" :r="radius"></circle>

      <g v-if="detailed_concepts">
        <path v-for="(item, index) in concepts"
              :id="`concept${index}`"
              @mouseover="on_concept_mouseover(item)"
              fill="none"
              stroke-opacity="1" stroke-width="6"
              :stroke="color_palette(item, index)"
              :d="`M 0 ${y_concept[index-1] || bar_height} L 0 ${y_concept[index]}`"></path>
      </g>
      <g v-else>
        <path stroke-opacity="1" stroke-width="4"
              stroke="#ff7070"
              :d="`M 0 0 l 0 ${bar_height}`"></path>

      </g>

      <text v-if="title"
            transform="translate(-4, 0) rotate(90) scale(1,-1)"
            fill="#fff"
            font-family="Open Sans"
            font-size="4">
        {{ title }}
      </text>
      <g v-if="legend" id="legend">
        <g id="difficulty_legend">
          <path fill="none" stroke="#505973" stroke-width=".15" stroke-dasharray=".5 1"
                :d="`M 0 ${bar_height} l -${difficulty_legend_offset} 0`"></path>
          <path fill="none" stroke="#505973" stroke-width=".15" stroke-dasharray=".5 1"
                :d="`M 0 0 l -${difficulty_legend_offset} 0`"></path>
          <path fill="none" stroke="#505973" stroke-width=".15"
                :d="`M -${difficulty_legend_offset} 0 l 0 ${bar_height}`"
                marker-start="url(#triangle)"
                marker-end="url(#triangle)"></path>
          <text :transform="`translate(-${difficulty_legend_offset + 1}, ${bar_height/2-10}) rotate(90) scale(1,-1)`"
                fill="#505973"
                font-family="Open Sans"
                font-size="3">DIFFICULTY</text>
      </g>
        <g id="duration_legend">
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
                font-size="3">DURATION</text>
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
            is_reference: {
                type: Boolean,
                default: false
            },
            detailed_concepts: {
                type: Boolean,
                default: false
            },
            legend: {
                type: Boolean,
                default: false
            },
            max_duration: {
                type: Number,
                default: Vue.prototype.$constant.max_duration
            },
            max_difficulty: {
                type: Number,
                default: Vue.prototype.$constant.max_difficulty
            },
            max_width: {
                type: Number,
                default: Vue.prototype.$constant.max_width
            },
            max_height: {
                type: Number,
                default: Vue.prototype.$constant.max_height
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
            },
            concept_palette: {
                type: Function,
                default: null
            }
        },
        methods: {
            color_palette: function (concept, index) {
                return this.concept_palette !== null ? this.concept_palette(concept[1]) : this.$constant.palette.concepts[index];
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
                // Map difficulty (in w/s) to bar length (in px)
                return d3.scaleLinear()
                    .domain([ 1, this.max_difficulty ])
                    .range([ 30, this.max_height - this.max_width / 2 ]);
            },
            radius: function () {
                return this.duration_scale(this.item ? this.item.duration : 0);
            },
            bar_height: function () {
                return this.difficulty_scale(this.item.difficulty);
            },
            concepts: function () {
                let count = this.concept_count;
                return this.item ? this.item.wikifier.slice(0, count) : [];
            },
            difficulty_legend_offset: function () {
                return this.radius + 10;
            },
            duration_legend_offset: function () {
                return this.max_width / 2 + 10;
            },
            reversed_concepts: function () {
                return this.concepts.slice().reverse();
            },
            y_concept: function () {
                // Return an array with stacked lengths
                let values = this.concepts.map(c => c.value);
                let total = values.reduce((a, b) => a+b);
                let h = this.bar_height;
                let s = 0;
                let heights = values.reduce((result, v) => { s = s + v / total;
                                                             result.push(s * h);
                                                             return result }, []);
                // Since we draw the bar from the top (and the y axis is bottom-up)
                // let's reverse there the values
                return heights.map(h => this.bar_height - h);
            },
            concept_classes: function () {
                return this.concepts.map(c => `concept-${c.label.replace(/.*\//, '')}`)
            },
            resource_stroke: function () {
                if (this.is_reference) {
                    return 'none';
                } else if (this.detailed_concepts) {
                    return '#fff';
                } else {
                    return '#ff7070';
                }
            },
        }
    };
</script>

<style scoped>
</style>
