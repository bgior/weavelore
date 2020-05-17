<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->

<template>
  <div class="row text-left justify-content-center">
    <div class="col-12 col-md-10 col-xl-8">
      <h1 class="my-4">Settings<img src="@/assets/images/icons/menu/settings.png" alt=""/></h1>
      <div class="row">
        <div class="col-12">
          <b-form-group label="Require a minimum query length?">
            <b-form-radio v-model="app.settings.minimumQueryLength" v-bind:value="0" @change="setDirty()">No, search always</b-form-radio>
            <b-form-radio v-model="app.settings.minimumQueryLength" v-bind:value="3" @change="setDirty()">Yes, don't search until I enter at least 3 characters or choose a filter<i>(faster)</i></b-form-radio>
          </b-form-group>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'SettingsPage',
    data() { return {
      dirty: false // Whether the user has made changes to the settings that haven't been persisted yet
    }},
    props: {
      app: Object
    },
    methods: {
      setDirty(dirty = true) {
        this.dirty = dirty;
      }
    },
    beforeDestroy() {
      // Whenever the user leaves this page, persist the new settings
      if (this.dirty) {
        this.app.settingsDatabase.saveToStorage();
      }
    },
    metaInfo: {
      title: "Settings - WeaveLore",
      meta: [
        { vmid: "description", name: "description", content: "Configure WeaveLore to match your preferences." },
        { vmid: "robots", name: "robots", content: "noindex" }
      ]
    }
  }
</script>
