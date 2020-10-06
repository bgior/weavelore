<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->

<template>
  <div class="row text-left justify-content-center">
    <div class="col-12 col-md-10 col-xl-8">
      <h1 class="my-4">My content<img src="@/assets/images/icons/menu/content.png" alt=""/></h1>
      <div class="my-4">
        <div class="sources-intro w-100">
          <span>
            You have {{ sources.length || 'no' }} content {{ sources.length == 1 ? 'source' : 'sources' }}.
          </span>
          <span class="no-shrink pb-3 pr-3">
            <strong class="source-amounts">
              <img src="@/assets/images/icons/menu/spells.png" style="filter: brightness(2.3)" title="Total amount of spells" alt=""> {{ app.spells.length }}
              <img src="@/assets/images/icons/menu/rules.png" class="ml-3" style="filter: brightness(2.0)" title="Total amount of rules" alt=""> {{ app.rules.length }}
            </strong>
          </span>
        </div>
        <div v-for="source in sources" class="source mb-3">
          <img src="@/assets/images/icons/misc/content.png" class="source-icon" alt="">
          <div class="source-info pl-2">
            <div class="source-head">
              <span class="source-title d-flex">
                <template v-if="sourceBeingEdited == source">
                  <input type="text" class="form-control font-weight-bold" v-model="source.name" maxlength="32"/>
                  <input type="number" class="form-control ml-2 d-none d-md-block" v-model.number="source.version" min="0" title="Version number for this source" style="width:70px"/>
                </template>
                <template v-else>{{ source.name }} <span v-if="source.version > 0" class="source-version badge ml-2">v{{ source.version }}</span></template>
              </span>
              <span class="source-amounts no-shrink ml-4">
                <img src="@/assets/images/icons/menu/spells.png" style="filter: brightness(1.8)" title="Amount of spells in this source" alt=""> {{ source.spells.length }}
                <img src="@/assets/images/icons/menu/rules.png" class="ml-3" style="filter: brightness(1.6)" title="Amount of rules in this source" alt=""> {{ source.rules.length }}
                <img src="@/assets/images/icons/misc/exportFile.png" class="source-action ml-3" @click="exportSource(source)" title="Export this source" alt=""/>
                <img src="@/assets/images/icons/misc/edition.png" :class="{'source-action ml-2': true, active: sourceBeingEdited == source}" @click="toggleSourceBeingEdited(source)" title="Edit this source" alt=""/>
                <img src="@/assets/images/icons/misc/close.png" class="source-action ml-2" @click="deleteSource(source)" title="Delete this source" alt=""/>
              </span>
            </div>
            <textarea v-if="sourceBeingEdited == source" class="form-control" v-model="source.description" maxlength="512"></textarea>
            <div v-else style="line-break: anywhere">{{ source.description }}</div>
          </div>
        </div>
      </div>
      <div class="row sources-actions">
        <div class="col-12 col-md-6 col-xl-4 mt-1">
          <button class="btn btn-primary w-100" @click="openFileSelector">
            <img src="@/assets/images/icons/misc/importFile.png" alt=""/>
            Import file
          </button>
          <input ref="uploader" type="file" @change="handleFileSelect" accept=".json" style="display:none" multiple/>
        </div>
        <div class="col-12 col-md-6 col-xl-4 mt-1">
          <button class="btn btn-primary w-100" v-b-modal.urlloader>
            <img src="@/assets/images/icons/misc/importLink.png" alt=""/>
            Import URL
          </button>
        </div>
        <div class="col-12 col-md-6 col-xl-4 mt-1">
          <button class="btn btn-primary w-100" @click="exportDatabase" :disabled="sources.length == 0">
            <img src="@/assets/images/icons/misc/exportFile.png" alt=""/>
            Export all
          </button>
          <a ref="downloadLink" href="#" class="d-none"></a>
        </div>
        <div class="col-12 col-md-6 col-xl-4 mt-1">
          <button class="btn btn-primary w-100" @click="loadSRD" :disabled="sources.some(s => s.name == 'SRD 5.1')">
            <img src="@/assets/images/icons/misc/srd.png" alt=""/>
            Load SRD
          </button>
        </div>
        <div class="col-12 col-md-6 col-xl-4 mt-1">
          <button class="btn btn-primary w-100" @click="addSource">
            <img src="@/assets/images/icons/misc/addSource.png" alt=""/>
            New source
          </button>
        </div>
        <div class="col-12 col-md-6 col-xl-4 mt-1">
          <button class="btn btn-primary w-100" @click="resetDatabase" :disabled="sources.length == 0">
            <img src="@/assets/images/icons/misc/trash.png" alt=""/>
            Delete all
          </button>
        </div>
        <div class="col-12 col-md-6 col-xl-4 mt-1">
          <button class="btn btn-primary w-100" @click="saveDatabase" :disabled="sources.length == 0">
            <img src="@/assets/images/icons/misc/save2.png" alt=""/>
            Save changes
          </button>
        </div>
        <div class="col-12 col-md-6 col-xl-4 mt-1">
          <button class="btn btn-primary w-100" @click="validateDatabase" :disabled="sources.length == 0" title="Check your content sources for any issues">
            <img src="@/assets/images/icons/misc/check.png" alt=""/>
            Validate
          </button>
        </div>
        <div class="col-12 col-md-6 col-xl-4 mt-1">
          <a class="btn btn-primary w-100" href="https://github.com/bgior/weavelore/wiki/Content-FAQ" target="_blank">
            <img src="@/assets/images/icons/misc/help.png" alt=""/>
            Help
          </a>
        </div>
      </div>
      <b-modal id="urlloader" title="Enter the URL of the file:" @ok="handleURLSelect">
        <input type="text" class="form-control" v-model="urlToImport"/>
      </b-modal>
    </div>
  </div>
</template>
<style>
.source {
  display: flex;
  background-color: #212121;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 1px 1px 3px #121212;
}
.source-head, .sources-intro {
  display: flex;
  justify-content: space-between;
}
.source-info {
  flex-grow: 1;
}
.source-title {
  font-size: 120%;
  font-weight: bold;
  width: 100%;
  overflow-x: hidden;
}
.source-icon {
  height: 48px;
}
.source-version {
  background-color: #3d5368;
  color: white;
  font-size: 60% !important;
  height: 16px;
  margin-top: 6px;
}
.no-shrink {
  flex-shrink: 0;
}
.source-amounts > img {
  height: 20px;
}
.source-action {
  filter: saturate(0);
  opacity: 0.5;
  cursor: pointer;
  transition: filter, opacity 0.3s;
}
.source-action:hover, .source-action.active {
  filter: saturate(1);
  opacity: 1;
}
.sources-actions img {
  height: 24px;
  margin-right: 2px;
}
.sources-actions button:disabled img {
  opacity: 0.1;
}
</style>
<script>
function getLines(file) {
  return new Promise(function(resolve) {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result.split("\n"));
    }
    reader.readAsText(file);
  });
}
export default {
  name: 'ContentPage',
  props: {
    app: Object
  },
  data() { return {
    urlToImport: 'https://',
    sourceBeingEdited: null
  }},
  computed: {
    sources() {
      return this.app.contentDatabase.data.sources;
    }
  },
  methods: {
    loadSRD() {
      this.urlToImport = "/srd.json";
      this.handleURLSelect();
    },
    addSource() {
      const newSource = {
        name: "New source",
        description: "Edit me!",
        version: 0,
        spells: [],
        rules: []
      };
      const sources = this.app.contentDatabase.data.sources;
      // If a spell named "New spell" already exists, append numbers until necessary
      while(sources.some(src => src.name == newSource.name)) {
        const number = (newSource.name.match(/ (\d+)$/) || [])[1]; // Grab the number from the current source name
        if (number) {
          newSource.name = "New source " + (parseInt(number) + 1);
        } else {
          newSource.name = "New source 2";
        }
      }
      this.app.contentDatabase.data.sources.push(newSource);
    },
    // Enable the edition controls of the given source, or disable them if the source is already being edited
    toggleSourceBeingEdited(source) {
      this.sourceBeingEdited = this.sourceBeingEdited == source ? null : source;
    },
    openFileSelector() {
      this.$refs.uploader.click();
    },
    handleFileSelect(evt) {
      for (let file of evt.target.files) {
        getLines(file).then(lines => {
          try {
            this.app.contentDatabase.loadJSON(JSON.parse(lines.join('')));
            this.app.reloadDatabase();
            this.app.alert(null);
          } catch (e) {
            this.showError(e);
          }
        });
      }
    },
    handleURLSelect() {
      this.app.contentDatabase.loadURL(this.urlToImport).then(() => {
        this.app.reloadDatabase();
        this.app.alert(null);
      }).catch(e => {
        this.showError(e);
      });
    },
    exportDatabase() {
      this.download(`WeaveLoreExport-${this.app.contentDatabase.data.sources.length}c-${this.app.spells.length}s-${this.app.rules.length}r.json`, this.app.contentDatabase.export());
    },
    download(name, text) {
      const link = this.$refs.downloadLink;
      const file = new Blob([text], {type: 'application/json'});
      link.href = URL.createObjectURL(file);
      link.download = name;
      link.click();
    },
    resetDatabase() {
      if (confirm("Are you sure you want to delete all your content sources?")) {
        this.app.contentDatabase.deleteAllSources();
        this.app.reloadDatabase();
      }
    },
    deleteSource(source) {
      if (source.name == "SRD 5.1" || (source.spells.length == 0 && source.rules.length == 0) ||
        confirm(`Delete all spells and rules in source '${source.name}'?`)) {
        this.app.contentDatabase.deleteSource(source);
        this.app.reloadDatabase();
      }
    },
    exportSource(source) {
      this.download(source.name + '.json', this.app.contentDatabase.export(source.name));
    },
    saveDatabase() {
      try {
        this.app.contentDatabase.validate();
        this.app.contentDatabase.saveToStorage();
        this.app.alert("Content saved", "success");
      } catch (error) {
        this.showError(error);
      }
    },
    validateDatabase() {
      try {
        this.app.contentDatabase.validate();
      } catch (error) {
        this.showError(error);
        return;
      }
      this.app.alert("All your content sources are valid.", "success");
    },
    showError(error) {
      let message;
      if (error.name == "ValidationError") {
        message = "Validation error: " + error.message;
      } else if (typeof(error) == "string") {
        message = error;
      } else {
        message = "Sorry, an unexpected error occurred. See the console for details.";
        console.error(error.message || error);
      }
      this.app.alert(message);
    }
  },
  metaInfo: {
    title: "Content - WeaveLore",
    meta: [
      { vmid: "description", name: "description", content: "Manage your WeaveLore content sources from this page." },
      { vmid: "robots", name: "robots", content: "noindex" }
    ]
  }
}
</script>
