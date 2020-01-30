<template>
    <div class="toolbar toolbar-right">
      <img class="toolbar-icon"
           title="Help"
           alt="?"
           @click="show_help"
           src="img/help.svg"></img>
      <img class="toolbar-icon toolbar-icon-search"
           title="Search"
           @click="show_search"
           src="img/search.svg"></img>
      <img class="toolbar-icon toolbar-icon-overview"
           title="Overview"
           alt="Overview"
           @click="show_overview"
           src="img/overview_icon.svg"></img>
      <count-overlay class="toolbar-icon toolbar-icon-basket"
                     :count="basket_count">
        <img class="toolbar-icon"
             title="Show basket"
             alt="Basket"
             @click="show_basket"
             src="img/basket.svg"></img>
      </count-overlay>
      <img class="toolbar-icon toolbar-icon-sequence"
           title="Organize sequence"
           alt="Sequence"
           @click="show_sequence"
           src="img/sequence_icon.svg"></img>
      <slot></slot>
    </div>
</template>

<script>

  module.exports = {
      computed: {
          basket_count: function () {
              return this.$store.state.basket.length;
          }
      },
      methods: {
          show_search: function () {
              this.$router.push({ path: '/search', query: { q: this.$store.state.query }});
          },
          show_overview: function () {
              this.$router.push(this.$store.state.overview_reference ? `/overview/${this.$store.state.overview_reference.id}` : '/overview' );
          },
          show_basket: function () {
              this.$router.push('/basket');
          },
          show_sequence: function () {
              this.$store.dispatch('sort_basket');
              this.$router.push('/sequence');
          },
          show_help: function () {
          },
      }
  }
</script>

<style type="text/css">
  .toolbar {
      position: absolute;
      top: 30px;
      right: 22px;
      display: flex;
      flex-direction: column;
  }
  .toolbar-icon {
      position: relative;
      width: 32px;
      height: 32px;
  }
  .toolbar-icon + .toolbar-icon {
      margin-top: 12px;
  }
  .view-overview .toolbar-icon-overview {
      display: none;
  }
  .view-basket .toolbar-icon-basket {
      display: none;
  }
  .view-sequence .toolbar-icon-sequence {
      display: none;
  }

</style>
