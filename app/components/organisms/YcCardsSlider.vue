<template>
  <div
    :topic-id="topicId"
    :video-info-list="videoInfoList"
    :start-date-obj="startDateObj"
    :end-date-obj="endDateObj"
    :topic-count="topicCount"
    :topic-defenition="topicDefenition"
  >
    <div class="slider-header">
      {{`${topic}   (${topicCount})`}}
    </div>
    <div class="x-scroll-box">
      <yc-card class="card-block"
        v-for="videoInfo in videoInfoList"
        :video-id="videoInfo.videoId"
        :video-title="videoInfo.videoTitle"
        :view-count="videoInfo.viewCount"
        :channel="videoInfo.channel"
        :published-at="videoInfo.publishedAt"
        @onCardClicked="onCardClicked"
      />
      <!-- <div v-show="true" class="card-block"> -->
      <v-btn
        v-show="existsMoreVideos"
        class="card-block get-more-btn"
        fab
        @click="onMoreBtnClick"
        color="primary"
      >
        <v-icon style="color:white;font-size:36px">mdi-arrow-right-bold</v-icon>
      </v-btn>
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
import YcCard from "~/components/molecules/YcCard"
// import topicDef from '~/assets/topic_def.json'

const limit = 10

export default {
  name: "YcCardsSlider",
  components: {
    YcCard
  },
  props: {
    topicId: {
      type: String,
      default: ""
    },
    topicCount: {
      type: Number,
      default: 0
    },
    videoInfoList: {
      type: Array,
      default: []
    },
    startDateObj: {
      type: Date,
      default: new Date()
    },
    endDateObj: {
      type: Date,
      default: new Date()
    },
    topicDefinition: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      topicDefenition: {},
    }
  },
  computed: {
    existsMoreVideos(){
      return this.videoInfoList.length < this.topicCount
    },
    topic(){
      return this.topicDefinition[this.topicId]
    }
  },

  methods: {
    onCardClicked(videoId){
      this.$emit('onCardClicked',  videoId)

    },
    onMoreBtnClick(){
      // ひとまずここで試す
      this.$emit('getMoreVideos', this.topicId, this.startDateObj, this.endDateObj, limit)
    }

  }
}
</script>

<style scoped>
.slider-header{
  color: white;
  font-weight: bold;
  /* background-color: #e0ffff; */
  background: linear-gradient(90deg, #0c56d2, #ffffff);
  /* background: linear-gradient(90deg, orange, #ffffff); */
  border-top: solid 2px #183463;
  border-left: solid 10px #183463;
  border-bottom: solid 2px #183463;
  /* border-right: solid 2px #183463; */
  padding-left: 10px;
}

.x-scroll-box{
  overflow-x: scroll;
  white-space: nowrap;
  background-color: white;
}

.card-block{
  /* float: left; */
  margin: 5px;
  display: inline-block;
}

.get-more-btn{
  top: -50px;
  margin-right: 20px;
}
</style>