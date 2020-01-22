<template>
  <div class="view-basket">
    <p>Basket</p>
    <img class="toolbar-icon"
         title="Back to overview"
         alt="Back"
         @click="show_overview"
         src="img/overview_icon.svg"></img>
  </div>
</template>

<script>
  module.exports = {
      components: {
      },
      data: function() {
          return {
          }
      },
      methods: {
          show_overview: function () {
              this.$router.push('/overview');
          },
      }
    }
</script>

<style type="text/css">
</style>
