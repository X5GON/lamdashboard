<template>
  <div :data-count="count" class="counter-overlay">
    <slot></slot>
  </div>
</template>

<script>
  module.exports = {
      props: {
          count: {
              type: Number,
              default: 0
          }
      },
      methods: {
          on_click: function () {
              this.$emit("click");
          }
      }
  }
</script>

<style type="text/css">
  [data-count]::after {
      position: absolute;
      top: 0;
      left: 0;
      content: attr(data-count);
      height: 14px;
      color: #ffec09;
      background-color: #2f3169;
      display: block;
      border-radius: 14px;
      font-size: 14px;
      text-align: center;
      font-family: Open sans-serif;
  }
</style>
