<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->

<template>
  <div class="row text-left justify-content-center">
    <div class="col-12 col-md-10 col-xl-8 tips">
      <h1 class="my-4">Tips and tricks<img src="@/assets/images/icons/menu/tips.png" alt=""/></h1>
      <h2>Search syntax</h2>
      If you add a period to the start of your query, the text will be searched in spell descriptions in addition to their names.
      <h2>Mobile app</h2>
      You can download this web app so that it behaves like a native app, including:
      <ul>
        <li>Automatic fullscreen</li>
        <li>100% offline functionality</li>
        <li>Shortcut in your home screen/apps menu</li>
        <li>Separate window from your browser</li>
      </ul>
      To install, look for an "Add to home" button in your browser of choice.
      <h2>Editing spells</h2>
      You can create, edit and remove spells by entering <img src="@/assets/images/icons/misc/edition.png" style="width: 20px" alt=""/> <span class="highlight ml-1">Edition mode</span>.
      <ul>
        <li><img src="@/assets/images/icons/misc/save1.png" style="width: 20px" alt=""/> <span class="highlight ml-1">Save</span> often (this makes your changes persist after refreshing/closing your browser).</li>
        <li>Keep backups by <router-link to="/content">exporting your database</router-link>. This way you can restore everything after clearing your browser history.</li>
        <li>Avoid making changes to the default content, because the SRD database may be periodically updated and your changes will be overwritten.</li>
        <li>Long text fields support some HTML. Use <span class="highlight">&lt;p&gt;</span> tags to mark paragraphs. The following tags are also supported: <span class="highlight">&lt;b&gt;</span>, <span class="highlight">&lt;i&gt;</span>, <span class="highlight">&lt;ul&gt;</span>, <span class="highlight">&lt;li&gt;</span>, <span class="highlight">&lt;table&gt;</span> and table sub-tags.</li>
        <li>Check out the <a href="https://github.com/bgior/weavelore/wiki/WLC-Format" target="_blank">documentation</a> for more information.</li>
      </ul>
    </div>
  </div>
</template>
<style>
.tips > h2 {
  margin-top: 20px;
}
.tips .highlight {
  color: #fea357;
}
</style>
<script>
export default {
  name: 'TipsPage',
  props: {
    app: Object
  },
  metaInfo: {
    title: "Tips - WeaveLore",
    meta: [
      { vmid: "description", name: "description", content: "Learn tips and tricks to take full advantage of the features of WeaveLore, a free and open-source web application to browse D&D 5e spells." }
    ]
  }
}
</script>
