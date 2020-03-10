<template>
  <div class="view-notification">
    <div v-for="m in messages" class="notification-box" :class="`notification-${m.type}`">
      {{ m.message }}
    </div>
  </div>
</template>

<script>
    module.exports = {
        name: "Notification",
        computed: {
            messages: function () {
                return this.$store.state.notification_messages;
            }
        }
    };
</script>

<style scoped>
  .view-notification {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #eee;
    font-family: IBM Plex Sans;
    font-size: 14px;
  }

  .notification-box {
      min-width: 20em;
      text-align: center;
      margin-top: 5px;
  }
  .view-notification:first-child {
      margin-top: 0;
  }
  .notification-info {
      background-color: #123456;
  }
  .notification-error {
      background-color: #deadbabe;
  }
  .notification-warning {
      background-color: yellow;
  }
</style>
