<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->

<template>
  <header>
    <b-navbar toggleable="sm" type="dark" variant="primary">
      <b-navbar-brand href="#">
        <router-link to="/">
          <img :src="require('@/assets/images/logo/logo64.png')" alt="" style="width:32px">
          WeaveLore
        </router-link>
      </b-navbar-brand>

      <template v-if="app.spells.length > 0">
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item to="/spells"><img :src="require('@/assets/images/icons/menu/spells.png')"/> Spells</b-nav-item>
            <b-nav-item to="/rules"><img :src="require('@/assets/images/icons/menu/rules.png')"/> Rules</b-nav-item>
            <b-nav-item-dropdown :html="`<img src='${require('@/assets/images/icons/menu/settings.png')}'/> More`">
              <b-dropdown-item to="/import"><img :src="require('@/assets/images/icons/menu/import.png')"/> Import</b-dropdown-item>
              <b-dropdown-item to="/stats"><img :src="require('@/assets/images/icons/menu/stats.png')"/> Stats</b-dropdown-item>
              <b-dropdown-item to="/areas"><img :src="require('@/assets/images/icons/menu/areas.png')"/> Areas</b-dropdown-item>
              <b-dropdown-item to="/tips"><img :src="require('@/assets/images/icons/menu/tips.png')"/> Tips</b-dropdown-item>
              <b-dropdown-item to="/settings"><img :src="require('@/assets/images/icons/menu/settings.png')"/> Settings</b-dropdown-item>
              <b-dropdown-item to="/ogl"><img :src="require('@/assets/images/icons/menu/ogl.png')"/> OGL</b-dropdown-item>
              <b-dropdown-item to="/about"><img :src="require('@/assets/images/logo/logo64.png')" style="filter: contrast(0) brightness(1.4)"/> About</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </template>
    </b-navbar>
  </header>
</template>
<script>
export default {
  name: 'navbar',
  props: {
    app: Object
  }
}
</script>
<style>
  nav {
    min-height: 42px;
  }
  nav.bg-primary {
    background-color: #292929 !important;
  }
  .navbar-expand-sm {
    padding: 0px 10px !important;
    box-shadow: 0px 0px 3px #d8d8d8;
    margin-bottom: 4px;
    /* font-family: 'Marcellus SC', 'Ubuntu', sans-serif; */
  }
  .navbar-toggler {
    border: 0 !important;
  }
  .navbar-brand img {
    filter: contrast(0) brightness(0.8);
    transition: filter 0.4s, transform 0.4s;
  }
  .navbar-brand {
    padding: 0 !important;
  }
  .navbar-brand > a {
    color: #7b7b7b !important;
    transition: color 0.4s;
    padding: 10px 20px 10px 0px; /* Make link easier to click on mobile */
  }
  .navbar-brand:hover a {
    color: #eee !important;
  }
  .navbar-brand:hover img {
    transform: scale(1.12);
    filter: contrast(1) brightness(1.0);
  }
  .nav-link img {
    height: 26px;
    transition: filter 0.4s;
  }
  .nav-link:hover img, .nav-item.show img {
    filter: brightness(1.6);
  }
  .dropdown-menu {
    background-color: #2c2c2c !important;
  }
  .dropdown-item {
    color: #ddd !important;
    background-color: #2c2c2c !important;
  }
  .dropdown-item:hover, .dropdown-item:focus, .dropdown-item:active {
    background-color: #2f2f2f !important;
  }
  .dropdown-item img {
    height: 20px;
    margin-right: 4px;
  }
  /* Increase spacing between menus */
  .nav-link {
    padding: 0.5rem 20px !important;
    transition: background-color 0.2s, color 0.2s;
  }
  /* Make the hamburger toggle a bit bigger in mobile */
  @media(max-width: 767px) {
    .navbar-toggler-icon {
      width: 1.8em !important;
      height: 1.8em !important;
    }
  }
  .nav-link:hover {
    background-color: #2f2e2e;
  }
  .navbar a {
    outline: 0;
  }
  /* Hide the triangle icon on dropdown menus */
  .dropdown-toggle::after {
    display: none !important;
  }
  /* Add separator lines between dropdown menu items */
  .dropdown-menu > li:not(:first-child) {
      border-top: 1px solid #232323;
  }
  .dropdown-item {
    padding: 0.5rem 1.5rem;
  }
  .dropdown-menu {
    padding: 0;
  }
</style>
