<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->

<template>
  <div :class="`foot-alert ${type}`">
    {{ message }}
  </div>
</template>
<style>
  .foot-alert {
    position: fixed;
    bottom: -24px;
    left: 0;
    width: 100%;
    padding: 5px;
    z-index: 100;
    text-align: center;
    transition: bottom 0.7s;
    transition-property: bottom, background-color, border-color;
    background-color: rgba(93, 93, 93, 0.78);
    border-top: 2px solid rgba(142, 142, 142, 0.68);
    min-height: 24px;
  }
  .foot-alert.success {
    bottom: 0;
    background-color: rgba(48, 86, 25, 0.78);
    border-color: rgba(85, 152, 50, 0.68);
  }
  .foot-alert.error {
    bottom: 0;
    background-color: rgba(115, 38, 38, 0.78);
    border-color: rgba(179, 66, 66, 0.68);
  }
</style>
<script>
export default {
  name: 'Alert',
  data() { return {
    message: null,
    type: null,
    alertClearTimeout: null
  }},
  methods: {
    // Display an alert message, which can be of type "success" or "error" (default),
    // and will be visible for [duration] ms. If the message is null, hide the alert.
    alert(message, type, duration) {
      if (!message) {
        this.message = null;
        this.type = null;
      } else {
        type = type || 'error';
        if (type == 'error') {
          duration = 10000;
          console.error(message);
        } else {
          duration = 5000;
        }
        clearTimeout(this.alertClearTimeout); // Cancel the clearing of a previous message, if present
        this.message = message;
        this.type = type;
        this.alertClearTimeout = setTimeout(() => {
          this.message = null;
          this.type = null;
        }, duration);
      }
    }
  }
}
</script>
