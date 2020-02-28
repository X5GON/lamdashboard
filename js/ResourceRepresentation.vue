<template>
  <g :class="concept_classes"
     @mouseover="on_mouseover"
     @click="on_click"
     @dblclick="on_dblclick"
     :transform="`translate(${x}, ${y}) scale(1,-1)`">

    <circle v-if="legend" id="circle_legend_demiheure" fill="none" stroke="#fff" stroke-width=".1" stroke-dasharray=".2 1" cx="0" cy="0" :r="duration_scale(30*60)"></circle>
    <circle v-if="legend" id="circle_legend_heure" fill="none" stroke="#fff" stroke-width=".1" stroke-dasharray=".2 1" cx="0" cy="0" :r="duration_scale(60*60)"></circle>

    <circle id="circle" :fill="circle_fill_color" fill-rule="nonzero" :stroke="resource_stroke" stroke-width="2" cx="0" cy="0" :r="radius"></circle>

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
        <text :transform="`translate(0, -${radius+9}) scale(1,-1)`"
              text-anchor="middle"
              fill="#505973"
              font-family="Open Sans"
              font-size="3">{{ duration_label }}</text>
      </g>
    </g>

    <g v-if="is_suggested">
      <circle id="circle" fill="#fff" fill-rule="nonzero" cx="0" cy="0" :r="radius"></circle>
      <path d="M -10 0 L 10 0 M 0 -10 L 0 10" stroke="#000D32" stroke-width="2" stroke-linecap="round"/>
    </g>

    <transition appear
                enter-active-class="flash"
                leave-active-class="flash"
                :duration="500">
      <g v-if="is_added">
        <circle id="circle" fill="#fff" fill-rule="nonzero" cx="0" cy="0" :r="radius"></circle>
      </g>
    </transition>

    <g id="resource-menu" :transform="`scale(1 -1) translate(${radius+5} -24)`">
      <slot></slot>
    </g>

  </g>
</template>

  <script>
    /*
      Representation of a resource. It expects to fit in a 0 0 110 120
      viewbox.
    */
    module.exports = {
        name: "ResourceRepresentation",
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
            is_suggested: {
                type: Boolean,
                default: false
            },
            is_added: {
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
            },
            fill: {
                type: String,
                default: "none"
            },
        },
        methods: {
            color_palette: function (concept, index) {
                return this.concept_palette !== null ? this.concept_palette(concept.url) : this.$constant.palette.concepts[index];
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
                    .domain([ 0, this.max_difficulty ])
                    .range([ 30, this.max_height - this.max_width / 2 ]);
            },
            duration_label: function () {
                if (!this.item)
                    return "";
                return `DURATION: ${$constant.format_duration(this.item.duration)}`;
            },
            radius: function () {
                return this.duration_scale(this.item ? this.item.duration : 0);
            },
            bar_height: function () {
                return this.difficulty_scale(this.item.difficulty);
            },
            concepts: function () {
                return this.item ? this.item.wikifier : [];
            },
            difficulty_legend_offset: function () {
                return this.radius + 10;
            },
            duration_legend_offset: function () {
                return this.max_width / 2 + 10;
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
            circle_fill_color: function () {
                if (this.fill != "none")
                    return this.fill;
                if (this.is_reference) {
                    return "url(#paint0_radial)";
                }
                return "none";
            }
        }
    };
</script>

<style scoped>
@-webkit-keyframes flash {
	0%, 50%, 100% {opacity: 0;}
	25%, 75% {opacity: .8;}
}
</style>
