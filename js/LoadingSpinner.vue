<template>
  <div v-if="loading_message" class="x5gon-loading-spinner">
    <letter-cube></letter-cube>
    <div class="x5gon-loading-spinner-text">{{ loading_message }}</div>
  </div>
</template>

<script>
    module.exports = {
        computed: {
            ...Vuex.mapState([ "loading_message" ]),
        }
    }
</script>

<style type="text/css">
  .x5gon-loading-spinner {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    background-color: #ffffff99;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
