<template>
  <nav class="filterbar">
    <ul class="filterbar">
      <li v-for="item in items" v-bind:key="item">{{ item }}</li>
    </ul>
  </nav>
</template>

<script>
    const items = [ "Provider", "Modality", "Language", "Culture", "Theme" ];

    module.exports = {
        data: function() {
            return {
                items: items
            }
        }
    }
</script>

<style type="text/css">

  .filterbar {
    margin: 0;
    padding: 0;
    padding-top: 9;
    color: #505973;
    list-style: none;
    display: flex;
    justify-content: space-between;
    font-family: Open Sans;
    font-size: 14px;
  }
  .filterbar li {
      display: inline-block;
      padding: .5em;
      width: 8em;
  }
  .filterbar li:hover {
      color: #fff;
      font-weight: 600;
  }
  .filterbar li:after {
      content: " V";
      # url("data:image/svg+xml; utf8; <svg viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
<path d='M15.0711 7.99999L8 15.0711L0.928932 7.99999' stroke='#505973' stroke-linecap='round' stroke-linejoin='round'/></svg>");
      display: block;
      width: 1em;
      height: 1em;
  }
</style>
