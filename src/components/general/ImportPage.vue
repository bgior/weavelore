<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->

<template>
  <div class="row justify-content-center">
    <div class="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
      <div class="welcome">
          <img :src="require('@/assets/images/logo/logo_large.jpg')" alt="" style="max-height: 256px"/>
          <h1>WeaveLore</h1>
          <template v-if="app.spells.length > 0">
            <p>You have {{ app.spells.length }} spells.</p>

          </template>
          <p v-else>Choose your content source to get started.</p>
          <button class="btn btn-primary" @click="loadSRD">Load standard content</button>
          <button class="btn btn-primary load-file" @click="openFileSelector">Load from file</button>
          <input ref="uploader" type="file" @change="handleFileSelect" accept=".json" style="display:none"/>
          <button class="btn btn-primary load-url" v-b-modal.urlloader>Load from URL</button>
          <button class="btn btn-danger" @click="resetDatabase" v-if="app.spells.length > 1">Reset database</button>
          <b-modal id="urlloader" title="Enter the URL of the file:" @ok="handleURLSelect">
            <input type="text" class="form-control" v-model="urlToImport"/>
          </b-modal>
      </div>
    </div>
  </div>

</template>

<script>
  function getLines(file) {
    return new Promise(function(resolve, reject) {
        const reader = new FileReader();
        reader.onload = (event) => {
            resolve(reader.result.split("\n"));
        }
        reader.readAsText(file);
    });
  }
  export default {
    name: 'ImportPage',
    data: () => { return {
      urlToImport: null // The user-provided URL of a SBS file to be imported
    }},
    props: {
      app: Object
    },
    methods: {
      loadSRD: function() {
        this.urlToImport = "/srd.json";
        this.handleURLSelect();
      },
      openFileSelector: function() {
        this.$refs.uploader.click();
      },
      handleFileSelect: function(evt) {
        getLines(evt.target.files[0]).then(lines => {
          try {
            this.app.contentDatabase.loadJSON(lines.join(''));
            this.$router.push("/");
          } catch (e) {
            alert("Sorry, the file could not be loaded.");
            console.error(e);
          }
        });
      },
      handleURLSelect: function() {
        try {
          this.app.contentDatabase.loadURL(this.urlToImport,
            () => {
              this.app.spells = this.app.contentDatabase.getSpells();
              this.$router.push("/");
            }
          );
        } catch (e) {
          alert("Sorry, the URL could not be loaded.");
          console.error(e);
        }
      },
      resetDatabase: function() {
        if (confirm("Are you sure?")) {
          this.app.contentDatabase.deleteFromStorage();
          this.app.spells = [];
        }
      }
    },
    created: function() {
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
  .welcome .btn {
    width: 100%;
  }
</style>
