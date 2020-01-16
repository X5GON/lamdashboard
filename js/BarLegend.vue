<template>
  <div class="view-barlegend">
    <h1 class="view-barlegend-title">{{ title }}</h1>
    <ul class="view-barlegend-list">
      <li v-for="item in items">
        <div class="view-barlegend-block">
          <div class="view-barlegend-label">{{ item.label }}</div>
          <div class="view-barlegend-value" :style="{ border: '8px solid ' + item.color,
                                                    width: item.width + 'px',
                                                    fill: item.color }" ></div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
    module.exports = {
        data: function() {
            return {
            }
        },
        props: {
            items: Array,
            width: { type: Number,
                     default: 200 },
            title: String
        },
        methods: {
        },
        computed: {
        }
    };
</script>

<style scoped>
  .view-barlegend, view-barlegend-block {
    display: flex;
    flex-direction: column;
  }
  .view-barlegend-list {
      list-style: none;
      padding: 0;
      margin: 0;
  }
  .view-barlegend-title {
      font-family: IBM Plex Serif;
      font-weight: 500;
      font-size: 18px;
      color: #505973;
      padding-bottom: 18px;
      margin-bottom: 18px;
      border-bottom: 1px solid #505973;
  }
  .view-barlegend-label {
      font-family: Open Sans;
      font-size: 12px;
      color: #505973;
      padding-top: 4px;
      padding-bottom: 4px;
  }
  .view-barlegend-value {
      height: 0px;
      border-radius: 10px;
  }
</style>
