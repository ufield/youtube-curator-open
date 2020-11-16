<template>
  <v-card
    max-width="350"
    min-width="250"
    max-height="160"
    :video-id="videoId"
    :video-title="videoTitle"
    :channel="channel"
    :view-count="viewCount"
    :published-at="publishedAt"
    @click="onCardClicked"
  >
    <v-row style="margin: 0px">
      <v-col cols="7" style="padding: 3px">
        <v-img
          height="110px"
          :src="`https://i.ytimg.com/vi/${this.videoId}/mqdefault.jpg`"
        >
        </v-img>
      </v-col>
      <v-col cols="5" style="padding: 3px">
        <v-card-subtitle class="over-text" style="margin: 0px; padding: 3px; font-size:12px;">
          {{channel}}
        </v-card-subtitle>
        <v-card-text class="text--primary limit-three-line" style="padding: 3px">
          <!-- {{videoTitle}} -->
          {{videoTitle | trimTitle}}
        </v-card-text>
      </v-col>
    </v-row>
    <div>
        <v-card-subtitle style="display: inline; margin: 5px; padding: 3px; font-size:13px">
          {{publishedAt | publishedDateTime}}
        </v-card-subtitle>
      <!-- <p style="margin: 5px;display: inline;font-size:14px">{{publishedAt | publishedDateTime}}</p> -->
      <a
        :href="'https://www.youtube.com/watch?v='+ videoId"
        @click.stop="dummyEvent"
        target="_blank"
      >
        <v-icon class="youtube-icon">mdi-youtube</v-icon>
      </a>
    </div>
  </v-card>
</template>

<script>
import formatDate from "~/plugins/format-date.js"

export default {
  name: "YcCard",
  props:{
    videoId: {
      type: String,
      default: ''
    },
    videoTitle: {
      type: String,
      default: 'Title'
    },
    channel: {
      type: String,
      default: 'Channel'
    },
    viewCount: {
      type: Number,
      default: 0
    },
    publishedAt: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      imgUrl: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg'
    }
  },
  methods: {
    onCardClicked(){
      this.$emit('onCardClicked',  this.videoId)
    },
    dummyEvent(){ // Youtubeアイコンクリック時に、イベントがcard に伝搬するのを防ぐためのダミー関数
      console.log("dummy!")
    }
  },
  filters: {
    trimTitle(title){
      const maxLength = 26
      if(title.length > maxLength){
        return title.slice(0, maxLength - 1) + '…'
      }
      return title
    },
    publishedDateTime(publishedAt){
      let dateTime = new Date(Number(publishedAt + '000'))
      return formatDate(dateTime, 'yyyy-MM-dd HH:mm')
    }
  },

}
</script>

<style scoped>
.youtube-icon{
  font-size: 45px !important;
  height: 40px !important;
  top: -5px !important;
  margin-right: 5px !important;
  float: right;
  color: #FF0000 !important;
}

.text-flex {
  display: flex;
  align-items: center;
}

.over-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* .limit-three-line{
   display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
} */
</style>