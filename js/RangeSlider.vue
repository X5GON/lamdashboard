<template>
  <input :value="value" @input="updateValue($event.target.value)" type="range" name="value" :min="min" :max="max"></input>
</template>

<script>
    module.exports = {
        name: "RangeSlider",
        data: function() {
            return {
                is_moving: false,
            }
        },
        props: {
            value: { type: Number,
                     default: 0 },
            min: { type: Number,
                   default: 0 },
            max: { type: Number,
                   default: 100 },
            initial: { type: Number,
                       default: 50 },
        },
        methods: {
            updateValue: function (value) {
                this.$emit('input', Number(value))
            }
        },
        computed: {
        }
    };
</script>

<style scoped>
  input[type=range] {
    -webkit-appearance: none;
    margin: 10px 0;
    width: 100%;
    background-color: #000d32;
  }
  input[type=range]:focus {
      outline: none;
  }
  input[type=range]::-webkit-slider-runnable-track {
      width: 100%;
      height: 1px;
      cursor: pointer;
      animate: 0.2s;
      box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
      background: #fff;
      border-radius: 0px;
      border: none;
  }
  input[type=range]::-moz-range-track {
      width: 100%;
      height: 1px;
      cursor: pointer;
      animate: 0.2s;
      box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
      background: #fff;
      border-radius: 0px;
      border: none;
  }
  input[type=range]::-webkit-slider-thumb {
      border: none;
      height: 17px;
      width: 17px;
      border-radius: 8px;
      background: #fff;
      cursor: pointer;
      -webkit-appearance: none;
      margin-top: -8px;
  }
  input[type=range]::-moz-range-thumb {
      border: none;
      height: 17px;
      width: 17px;
      border-radius: 8px;
      background: #fff;
      cursor: pointer;
      -webkit-appearance: none;
      margin-top: -8px;
  }

  input[type=range]:focus::-webkit-slider-runnable-track {
      background: #fff;
  }
</style>
