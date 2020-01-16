<template>
  <div class="view-resultdrawer">
    <x5gon-header></x5gon-header>
    <div class="resultdrawer-content">
      <div class="result-search">
        <input v-model="query" placeholder="Recherche" type="search" @keydown.enter="search" />
      </div>
      <ul class="results" v-bind:class="{ has_active: has_active }">
        <li class="resultdrawer-item" v-for="res in results">
          <div class="resultdrawer-item-block"
               @mouseout="set_active(null)"
               @mouseover="set_active(res)"
               :class="{ active: active_resource == res }" >
            <div class="resultdrawer-item-line">
              <div class="resultdrawer-item-type">Title</div>
              <div class="resultdrawer-item-title">{{ res.title }}</div>
            </div>
            <div class="resultdrawer-item-line">
              <div class="resultdrawer-item-type">Provider</div>
              <div class="resultdrawer-item-provider">{{ res.provider }}</div>
            </div>
            <div class="resultdrawer-item-line">
              <div class="resultdrawer-item-type">Author</div>
              <div class="resultdrawer-item-author">{{ res.author }}</div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  module.exports = {
      components: {
          'x5gon-header': httpVueLoader('js/Header.vue')
      },
      props: {
          results: Array
      },
      data: function() {
          return {
              active_resource: null,
              query: null
          }
      },
      methods: {
          set_active: function (resource) {
              console.log("setActive", resource ? resource.title : null);
              this.active_resource = resource;
              this.$emit('active', resource);
          },
          search: function () {
              this.$store.dispatch('submit_query', this.query);
          }
      },
      computed: {
          has_active: function () {
              return this.active_resource !== null
          }
      }
    }
</script>

<style scoped>
  .resultdrawer-content {
    display: flex;
    flex-direction: column;
    width: calc(100% - 2em);
    margin-left: 1em;
  }
  .result-search {
      width: 100%;
  }
  .result-search input {
      width: 100%;
      font-family: IBM Plex Sans;
      font-style: normal;
      font-weight: 600;
      font-size: 22px;
      line-height: 29px;
  }
  .view-resultdrawer {
    background-color: #fff;
  }
  .results {
      margin: 0;
      padding: 0;
      padding-top: 2em;
      list-style: none;
  }
  .resultdrawer-item {
      border-bottom: 2px solid #000D32;
      padding-bottom: 1em;
      padding-top: .5em;
  }
  .resultdrawer-item-line {
      display: flex;
      flex-direction: row;
  }
  .resultdrawer-item-type {
      display: inline-block;
      width: 61px;
      text-transform: uppercase;
      font-family: Open Sans;
      font-size: 9px;
  }
  .resultdrawer-item-title {
      font-family: IBM Plex Serif;
      font-size: 22px;
      line-height: 26px;
  }
  .resultdrawer-item-provider, .resultdrawer-item-author {
      font-family: IBM Plex Serif;
      font-weight: 200;
      font-size: 18px;
      line-height: 20px;
  }

  .has_active .resultdrawer-item-block {
      opacity: .5;
  }
  .has_active .resultdrawer-item-block.active {
      opacity: 1;
  }
</style>
