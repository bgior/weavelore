<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->
<!-- A simple checkbox-like component. -->

<template>
  <div :class="`toggler ${checked ? '' : 'absent'}`" @click="$emit('toggle')">
    <img :src="icon" class="toggler-icon clickable"/> {{ text }}
  </div>
</template>
<style>
  .toggler {
    text-transform: capitalize;
    padding: 2px 4px;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .toggler.absent {
    opacity: 0.25;
  }
  .toggler.absent:hover {
    opacity: 0.4;
  }
  .toggler-icon {
    height: 26px;
  }
</style>
<script>
  export default {
    name: 'Toggler',
    props: {
      checked: Boolean,
      text: String,
      icon: String
    }
  }
</script>
