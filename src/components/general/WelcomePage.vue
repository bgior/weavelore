<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->

<template>
  <div class="row justify-content-center">
    <div class="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
      <div class="welcome">
        <img :src="require('@/assets/images/logo/logo_large.jpg')" alt="" style="max-height: 256px"/>
        <h1>WeaveLore</h1>
        <p>Choose your content source to get started.</p>
        <button class="btn btn-glow w-100" @click="loadSRD">Standard content (SRD)</button>
        <router-link class="btn btn-glow w-100" to="/content">Custom content</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'WelcomePage',
    props: {
      app: Object
    },
    methods: {
      loadSRD() {
        try {
          this.app.contentDatabase.loadURL('/srd.json',
            () => {
              this.app.reloadDatabase();
              this.$router.push("/");
            },
            (err) => this.showError(err)
          );
        } catch (err) {
          this.showError(err);
        }
      },
      showError(error) {
        this.app.alert("Sorry, an error occurred when loading the content. Open the console for details.");
        console.error(error);
      }
    },
    created() {
      // If action=updateSRD is passed as a query param, automatically load the SRD
      if (new URLSearchParams(window.location.search).get('action') == 'updateSRD') {
        this.loadSRD();
        this.$forceUpdate();
      }
    }
  }
</script>

<style>
  .welcome {
    margin-top: 20px;
    text-align: center;
  }
</style>
