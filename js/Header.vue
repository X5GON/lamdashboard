<template>
  <header class="x5gon-header">
    <img src="img/x5gon.svg" alt="X5GON" />
  </header>
</template>

<script>
    module.exports = {
        name: "Header",
    };
</script>

<style type="text/css">
  header.x5gon-header {
    background-color: #fff;
    display: flex;
    height: 67px;
    align-items: center;
    justify-content: center;
  }

  header.x5gon-header.overlay {
    background-color: #fffa;
    justify-content: left;
    background: linear-gradient(180deg, #fff -55%, #fff0 100%);
    padding-left: 20px;
    opacity: .7;
  }
</style>
