<template>
  <div class="view-debug">
    <strong>Debug</strong>
    <pre id="query-t">Query: {{ $route.query.t }}</pre>
    <pre id="hash">Hash: {{ $route.hash }}</pre>
    <div v-touch-pan="handler">v1: {{ v1 }}</div>
    <div v-touch-swipe="handler">v2: {{ v2 }}</div>
    <span>userdata: {{ userdata }}</span>
    <div v-ripple>Click me. I got ripples.
    </div>
    <input v-model="userdata">
    <div>
      <q-btn @click="doSomething" label="Do something" />
    </div>
</template>

<script>

  module.exports = {
      data: function () {
          return {
              v1: "var1",
              v2: "var2",
              userdata: "",
          }
      },
      methods: {
          handler: function (e) { console.log("handler", e, this.$event);
                                  this.v2 += " handler"; },
          doSomething: function (e) { console.log("doSomething", e, this.$event);
                                      this.v1 += " something";
                                    },
      },
  }
</script>

<style>
</style>
