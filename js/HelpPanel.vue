<template>
  <div v-if="show_help" class="x5gon-help">
    <slot></slot>
    <img class="close-help"
         src="img/help_close.svg"
         title="Close help"
         alt="Close"
         @click="close_help"></img>
  </div>
</template>

<script>
    module.exports = {
        name: "HelpPanel",
        computed: {
            ...Vuex.mapState([ "show_help" ]),
        },
        methods: {
            close_help: function () {
                console.log("close");
                this.$store.dispatch('hide_help');
            },
        },
    };
</script>

<style type="text/css">
  div.x5gon-help {
    background-color: #fff;
    position: fixed;
    top: 0;
    right: 0;
    left: 70%;
    bottom: 0;
    display: flex;
    flex-direction: column;
    font-family: Open Sans;
    font-size: 18px;
    padding: 40px 20px;
  }
  .x5gon-help h1 {
      margin-top: .5em;
      font-weight: 600;
      font-size: 24px;
  }
  .x5gon-help h2 {
      margin-top: .5em;
      font-weight: 600;
      font-size: 20px;
  }
  .x5gon-help p {
      margin-top: .5em;
  }
  .close-help {
      position: absolute;
      top: 6px;
      right: 6px;
      cursor: pointer;
  }
</style>
