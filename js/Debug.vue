<template>
  <div class="view-debug">
    <strong>Debug</strong>
    <pre id="query-t">Query: {{ $route.query.t }}</pre>
    <pre id="hash">Hash: {{ $route.hash }}</pre>
    <div>v1: {{ v1 }}</div>
    <div>v2: {{ v2 }}</div>
    <span>userdata: {{ userdata }}</span>
    <input v-model="userdata">
    <button @click="doSomething" label="Do something" />
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
