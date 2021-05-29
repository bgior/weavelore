<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->

<template>
  <div class="row text-left justify-content-center">
    <div class="col-12 col-md-10 col-xl-8">
      <h1 class="my-4">About OGL<img src="@/assets/images/icons/menu/ogl.png" alt=""/></h1>
      <p>The default application data is Open Game Content from the <b>SRD</b> (System Reference Document) 5.1, released under the terms of the <b>OGL</b> (Open Game License). A copy of the license text is included below in accordance to the terms:</p>
      <div v-html="licenseText" class="license-text my-4">
      </div>
      <p>The SRD can be found <a href="https://dnd.wizards.com/articles/features/systems-reference-document-srd">here</a>.</p>
    </div>
  </div>
</template>
<style>

</style>
<script>
export default {
  name: 'OGLPage',
  props: {
    app: Object
  },
  data() { return {
    licenseText: "Loading..."
  }},
  created() {
    fetch('/ogl.txt').then(res => res.text()).then(text => {
      this.licenseText = text.replace(/\n/g, "<br/>");
    }).catch(error => {
      this.licenseText = "Sorry, we could not load the license text.";
      console.error(error);
    });
  },
  metaInfo: {
    title: "OGL - WeaveLore",
    meta: [
      { vmid: "description", name: "description", content: "Learn more about how WeaveLore uses content from the SRD (System Reference Document) 5.1, released under the OGL (Open Game License)." }
    ]
  }
}
</script>
<style>
  .license-text {
    max-height: 300px;
    overflow-y: scroll;
    scrollbar-color: #282828 #1b1b1b;
    padding: 5px;
    font-size: 0.8rem;
    border: 2px solid #292929;
    border-radius: 5px;
  }
</style>
