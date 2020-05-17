<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->

<template>
  <div class="row text-left justify-content-center">
    <div class="col-12 col-md-10 col-xl-8">
      <h1 class="my-4">News <img src="@/assets/images/icons/menu/news.png" alt=""/></h1>
      <div v-if="message">{{ message }}</div>
      <div v-for="item in news" :key="item.title">
        <div class="news-item">
          <div class="news-head">
            <h2>{{ item.title }}</h2>
            <span>{{ prettyDate(item.date) }}</span>
          </div>
          <div v-html="prettyDescription(item.description)" @click="handleDescriptionClick"></div>
        </div>
        <hr/>
      </div>
    </div>
  </div>
</template>
<style>
.news-item {
  padding: 10px;
}
.news-head {
  display: flex;
  justify-content: space-between;
}
.news-head > span {
  margin-top: 5px;
  border-bottom: 1px solid #333;
  border-radius: 3px;
}
</style>
<script>
import TextBeautifier from '@/util/textBeautifier.js';
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export default {
  name: 'NewsPage',
  props: {
    app: Object
  },
  data() { return {
    message: "Loading...",
    news: null
  }},
  methods: {
    prettyDate(dateString) {
      const date = new Date(dateString);
      return date ? `${months[date.getUTCMonth()]} ${date.getUTCDate()}` : '';
    },
    prettyDescription(description){
      return TextBeautifier.beautify(description);
    },
    handleDescriptionClick(evt) {
      if (evt.target.className == 'dynamic-link') {
        this.$router.push('/rules/' + evt.target.innerText.replace(/ /g, "-"));
      }
    }
  },
  created() {
    fetch('/news.json').then(res => res.json()).then(news => {
      this.news = news;
      this.message = null;
    }).catch(error => {
      this.message = "Sorry, we could not load the latest news.";
      console.error(error);
    });
  },
  metaInfo: {
    title: "News - WeaveLore",
    meta: [
      { vmid: "description", name: "description", content: "View the latest major events and news concerning WeaveLore development. Check out the subreddit too for more detailed information." }
    ]
  }
}
</script>
