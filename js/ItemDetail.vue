<template>
  <div v-if="item" class="view-itemdetail">
    <div class="itemdetail-title">{{ item ? item.title : "" }}</div>
    <div class="itemdetail-representation">
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 110 120" preserveAspectRatio="xMidYMid">
        <defs>
          <radialGradient id="paint0_radial">
            <stop stop-color="#ff9059" stop-opacity="1" offset="0"/>
            <stop stop-color="#ff9059" stop-opacity="0.2" offset="1"/>
          </radialGradient>
          <marker id="triangle" viewBox="0 0 20 20"
                  refX="10" refY="10"
                  markerWidth="20" markerHeight="20"
                  orient="auto-start-reverse">
            <path d="M 0 0 l 10 10 l -10 10" stroke="#505973" fill="none" />
          </marker>
        </defs>
        <g :transform="`translate(70, 75) scale(1,-1)`">
          <circle id="circle" fill="url(#paint0_radial)" fill-opacity="1" fill-rule="nonzero" stroke="none" cx="0" cy="0" :r="radius"/>
          <path id="concept5" fill="none" stroke="#505973" stroke-linecap="round" stroke-opacity="1" stroke-width="4" :d="`M 0 0 l 0 ${y[4]}`"/>
          <path id="concept4" fill="none" stroke="#e95c44" stroke-linecap="round" stroke-opacity="1" stroke-width="4" :d="`M 0 0 l 0 ${y[3]}`"/>
          <path id="concept3" fill="none" stroke="#be4b4d" stroke-linecap="round" stroke-opacity="1" stroke-width="4" :d="`M 0 0 l 0 ${y[2]}`"/>
          <path id="concept2" fill="none" stroke="#933b50" stroke-linecap="round" stroke-opacity="1" stroke-width="4" :d="`M 0 0 l 0 ${y[1]}`"/>
          <path id="concept1" fill="none" stroke="#3e1966" stroke-linecap="round" stroke-opacity="1" stroke-width="4" :d="`M 0 0 l 0 ${y[0]}`"/>
          <g id="difficulty_hint">
            <path fill="none" stroke="#505973" stroke-width=".15" stroke-dasharray=".5 1" :d="`M 0 ${bar_height} l -60 0`" />
            <path fill="none" stroke="#505973" stroke-width=".15" stroke-dasharray=".5 1" d="M 0 -2 l -60 0" />
            <path fill="none" stroke="#505973" stroke-width=".15" :d="`M -60 -2 l 0 ${bar_height}`" marker-start="url(#triangle)" marker-end="url(#triangle)" />
            <text :transform="`translate(-61, ${bar_height/2-10}) rotate(90) scale(1,-1)`" fill="#505973" font-family="Open Sans" font-size="3">DIFFICULTY</text>
          </g>
          <g id="length_hint">
            <path fill="none" stroke="#505973" stroke-width=".15" stroke-dasharray=".5 1" :d="`M -${radius} -2 l 0 -${radius+5}`" />
            <path fill="none" stroke="#505973" stroke-width=".15" stroke-dasharray=".5 1" :d="`M ${radius} -2 l 0 -${radius+5}`" />
            <path fill="none" stroke="#505973" stroke-width=".15" :d="`M -${radius} -${radius+5} l ${2*radius} 0`" marker-start="url(#triangle)" marker-end="url(#triangle)" />
            <text :transform="`translate(-6, -${radius+9}) scale(1,-1)`" fill="#505973" font-family="Open Sans" font-size="3">LENGTH</text>
          </g>
        </g>
      </svg>
    </div>
    <div class="itemdetail-provider">{{ item ? item.provider : "" }}</div>
    <div class="itemdetail-author">{{ item ? item.author : "" }}</div>

  </div>
</template>

<script>
    module.exports = {
        data: function() {
            return {
            }
        },
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
            }

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
                // Return an array with stacked heights.
                // 0 is concept 1 -> full height
                // 1 is concept 2 -> height - concept1 percentage
                //return [ .2, .4, .6, .7, 1].map(v => this.bar_height * v);
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
  .view-itemdetail {
    width: calc(100% - 70px);
    padding-left: 35px;
    padding-right: 35px;
  }
  .itemdetail-title {
      color: #fff;
      font-family: IBM Plex Serif;
      font-style: normal;
      font-weight: 500;
      font-size: 26px;
      line-height: 31px;
      height: 3em;
  }
  .itemdetail-provider, .itemdetail-author {
      height: 2em;
  }
  .itemdetail-representation {
    margin-left: 30%;
    width: 30%;
  }
</style>
