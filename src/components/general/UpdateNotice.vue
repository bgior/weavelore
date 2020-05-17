<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->

<!-- Notification shown on the corner of the screen when there's an app update awaiting installation. -->
<template>
  <router-link to="/updates" class="app-update-notice" title="New version available">
    <img src="@/assets/images/icons/misc/upgrade.png" alt="Update"/>
  </router-link>
</template>
<style>
.app-update-notice {
  position: fixed;
  right: -2px;
  bottom: -2px;
  padding: 5px;
  background-color: #2b2b2b;
  border-top-left-radius: 50%;
  border: 1px solid #a6b9e0;
  box-shadow: 0px 0px 4px #7f9be0;
  transition: background-color 0.5s;
  cursor: pointer;
  outline: 0;
}
.app-update-notice:hover {
  background-color: #333;
  box-shadow: 0px 0px 6px #7f9be0;
}
.app-update-notice > img {
  height: 32px;
}
</style>
