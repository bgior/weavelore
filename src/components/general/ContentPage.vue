<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->

<template>
  <div class="row text-left justify-content-center">
    <div class="col-12 col-md-10 col-xl-8">
      <h1 class="my-4">My content</h1>
      <div class="my-4">
        <div class="sources-intro w-100">
          <span>
            You have {{ sources.length || 'no' }} content {{ sources.length == 1 ? 'source' : 'sources' }}.
          </span>
          <span class="no-shrink pb-3 pr-3">
            <strong class="source-amounts">
              <img :src="require('@/assets/images/icons/menu/spells.png')" style="filter: brightness(2.3)" title="Amount of spells in this source" alt="Spells"> {{ app.spells.length }}
              <img :src="require('@/assets/images/icons/menu/rules.png')" class="ml-3" style="filter: brightness(2.0)" title="Amount of rules in this source" alt="Rules"> {{ 0 }}
            </strong>
          </span>
        </div>
        <div v-for="source in sources" :key="source.name" class="source mb-3">
          <img :src="require('@/assets/images/icons/misc/content.png')" class="source-icon" alt="">
          <div class="source-info pl-2">
            <div class="source-head">
              <span class="source-title">{{ source.name }} <span class="source-version badge ml-2">v{{ source.version }}</span></span>

              <span class="source-amounts no-shrink ml-4">
                <img :src="require('@/assets/images/icons/menu/spells.png')" style="filter: brightness(1.8)" title="Amount of spells in this source" alt="Spells"> {{ source.spells.length }}
                <img :src="require('@/assets/images/icons/menu/rules.png')" class="ml-3" style="filter: brightness(1.6)" title="Amount of rules in this source" alt="Rules"> {{ source.rules.length }}
                <img :src="require('@/assets/images/icons/misc/close.png')" class="source-delete ml-2" @click="deleteSource(source)" />
              </span>
            </div>
            {{ source.description }}
          </div>
        </div>
      </div>
      <div class="row sources-actions">
        <div class="col-12 col-md-6 col-xl-4">
          <button class="btn btn-primary w-100" @click="loadSRD" :disabled="sources.some(s => s.name == 'SRD 5.1')">
            <img :src="require('@/assets/images/icons/misc/srd.png')"/>
            Load SRD
          </button>
        </div>
        <div class="col-12 col-md-6 col-xl-4">
          <button class="btn btn-primary w-100" @click="openFileSelector">
            <img :src="require('@/assets/images/icons/misc/importFile.png')"/>
            Import file
          </button>
          <input ref="uploader" type="file" @change="handleFileSelect" accept=".json" style="display:none"/>
        </div>
        <div class="col-12 col-md-6 col-xl-4">
          <button class="btn btn-primary w-100" v-b-modal.urlloader>
            <img :src="require('@/assets/images/icons/misc/importLink.png')"/>
            Import URL
          </button>
        </div>
        <div class="col-12 col-md-6 col-xl-4">
          <button class="btn btn-primary w-100" @click="exportDatabase" :disabled="sources.length == 0">
            <img :src="require('@/assets/images/icons/misc/exportFile.png')"/>
            Export all
          </button>
          <a ref="downloadLink" href="#" class="d-none"></a>
        </div>
        <div class="col-12 col-md-6 col-xl-4">
          <button class="btn btn-primary w-100" @click="resetDatabase" :disabled="sources.length == 0">
            <img :src="require('@/assets/images/icons/misc/trash.png')"/>
            Delete all
          </button>
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
}
.source-icon {
  height: 48px;
}
.source-version {
  background-color: #3d5368;
  color: white;
  font-size: 60% !important;
}
.no-shrink {
  flex-shrink: 0;
}
.source-amounts > img {
  height: 20px;
}
.source-delete {
  filter: contrast(0.6) brightness(0.5);
  cursor: pointer;
  transition: filter 0.3s;
}
.source-delete:hover {
  filter: contrast(1) brightness(1);
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
    urlToImport: 'https://'
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
    openFileSelector() {
      this.$refs.uploader.click();
    },
    handleFileSelect(evt) {
      getLines(evt.target.files[0]).then(lines => {
        try {
          this.app.contentDatabase.loadJSON(JSON.parse(lines.join('')));
          this.app.spells = this.app.contentDatabase.getSpells();
          this.app.alert(null);
        } catch (e) {
          this.showError(e);
        }
      });
    },
    handleURLSelect() {
      try {
        this.app.contentDatabase.loadURL(this.urlToImport,
          () => {
            this.app.spells = this.app.contentDatabase.getSpells();
            this.app.alert(null);
          },
          this.showError
        );
      } catch (e) {
        this.showError(e);
      }
    },
    exportDatabase() {
      this.download('WeaveLoreExport.json', JSON.stringify(this.app.contentDatabase.data));
    },
    download(name, text) {
      const link = this.$refs.downloadLink;
      const file = new Blob([text], {type: 'application/json'});
      link.href = URL.createObjectURL(file);
      link.download = name;
      link.click();
    },
    resetDatabase() {
      if (confirm("Are you sure?")) {
        this.app.contentDatabase.deleteAllSources();
        this.app.spells = [];
      }
    },
    deleteSource(source) {
      this.app.contentDatabase.deleteSource(source);
      this.app.spells = this.app.contentDatabase.getSpells();
    },
    showError(error) {
      let message;
      if (error.name == "ValidationError") {
        message = "The file is not valid. Reason: " + error.message;
      } else {
        message = "Sorry, the file could not be loaded. Open the console for details.";
        console.error(error.message || error);
      }
      this.app.alert(message);
    }
  }
}
</script>
