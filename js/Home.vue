<template>
  <div class="view-home">
    <x5gon-header></x5gon-header>
    <div class="content">
      <div class="filteredinput">
        <input v-model="query" id="q" placeholder="Recherche" @keydown.enter="search" type="search" />
        <x5gon-filterbar></x5gon-filterbar>
      </div>
    </div>
  </div>
</template>

<script>
  module.exports = {
      components: {
          'x5gon-filterbar': httpVueLoader('js/Filterbar.vue'),
          'x5gon-header': httpVueLoader('js/Header.vue')
      },
      data: function() {
          return {
              query: this.$route.query.q
          }
      },
      methods: {
          search: function () {
              this.$store.dispatch('submit_query', this.query);
          }
      },
      mounted: function () {
          if (this.$route.query.q) {
              this.$store.dispatch('submit_query', this.$route.query.q);
          }
      }

    }
</script>

<style scoped>
  .content {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #q {
      width: 100%;
      max-width: 60em;
      height: 40px;
      margin-top: 30%;
  }
</style>
