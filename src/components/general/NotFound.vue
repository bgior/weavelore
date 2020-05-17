<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->

<template>
  <div class="text-center">
    <div style="font-size: 200px">?</div>
    The requested page was not found.
  </div>
</template>
<script>
export default {
  name: 'NotFound',
  metaInfo: {
    title: "404 - WeaveLore",
    meta: [
      { vmid: "description", name: "description", content: "The requested page was not found." },
      { vmid: "robots", name: "robots", content: "noindex" }
    ]
  }
}
</script>
