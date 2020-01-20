<template>
  <g :transform="`translate(70, ${130-50}) scale(1,-1)`">
    <circle id="circle" fill="url(#paint0_radial)" fill-opacity="1" fill-rule="nonzero" stroke="none" cx="0" cy="0" :r="radius"></circle>
    <path id="concept5" fill="none" stroke="#505973" stroke-linecap="round" stroke-opacity="1" stroke-width="4" :d="`M 0 0 l 0 ${y[4]}`"></path>
    <path id="concept4" fill="none" stroke="#e95c44" stroke-linecap="round" stroke-opacity="1" stroke-width="4" :d="`M 0 0 l 0 ${y[3]}`"></path>
    <path id="concept3" fill="none" stroke="#be4b4d" stroke-linecap="round" stroke-opacity="1" stroke-width="4" :d="`M 0 0 l 0 ${y[2]}`"></path>
    <path id="concept2" fill="none" stroke="#933b50" stroke-linecap="round" stroke-opacity="1" stroke-width="4" :d="`M 0 0 l 0 ${y[1]}`"></path>
    <path id="concept1" fill="none" stroke="#3e1966" stroke-linecap="round" stroke-opacity="1" stroke-width="4" :d="`M 0 0 l 0 ${y[0]}`"></path>
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
</template>

<script>
    module.exports = {
        props: {
            item: Object,
            max_duration: {
                type: Number,
                default: 1000
            },
            max_difficulty: {
                type: Number,
                default: 100
            },
            concept_count: {
                type: Number,
                default: 5
            },
            width: 400

        },
        computed: {
            duration_scale: function () {
                return d3.scaleLinear()
                    .domain([ 60, 100000 ]) // this.props.max_duration ])
                    .range([ 20, 50 ]);
            },
            difficulty_scale: function () {
                return d3.scaleLinear()
                    .domain([ 1, 40 ]) // this.props.max_difficulty ])
                    .range([ 40, 80 ]);
            },
            radius: function () {
                // FIXME: replace with item.duration when done
                return this.duration_scale(this.item.length);
            },
            bar_height: function () {
                return this.difficulty_scale(this.item.technicities);
            },
            y: function () {
                // Return an array with stacked lengths
                let count = 5;
                let concepts = this.item.wikifier.slice(0, count).map(c => c[3]);
                let total = concepts.reduce((a, b) => a+b);
                let h = this.bar_height;
                let s = 0;
                let heights = concepts.reduce((result, v) => { s = s + v / total;
                                                               result.push(s  * h);
                                                               return result }, []);
                return heights;
            }
        }
    };
</script>

<style scoped>
</style>
