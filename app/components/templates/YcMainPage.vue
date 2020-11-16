<template>
  <div
    :genre="genre"
  >
    <v-dialog
      v-model="dialog"
      scrollable
      max-width="350px"
      @click:outside="falseDialog"
    >
      <yc-search-option-modal
        @falseDialog="falseDialog"
        @reSearchVideos="reSearchVideos"
        :topic-definition="topicDefinition"
        :genre="genre"
        :dates.sync="dates"
        :topic-ids.sync="topicIds"
      />
    </v-dialog>


    <div
      id="youtube-parent"
      ref="youtubeParent"
      :style="{top: headerHeight + 'px'}"
      v-resize="calcSliderTop"
    >
      <youtube
        :video-id="videoId"
        fitParent
        resize
        @ready="calcSliderTop"
       />
    </div>

    <yc-cards-slider class="cards-slider"
      :style="{top: cardsSliderTop}"
      v-for="(infoMap, topicId) in videoInfoMap"
      :topicId="topicId"
      :topicCount="infoMap.topicCount"
      :videoInfoList="infoMap.videoInfoList"
      :start-date-obj="infoMap.startDateObj"
      :end-date-obj="infoMap.endDateObj"
      :topic-definition="topicDefinition"
      @onCardClicked="updateVideo"
      @getMoreVideos="getMoreVideos"
      v-if="!isTopic999(topicId)"
      v-show="infoMap.videoInfoList.length > 0"
    >
    <!-- かなり謎だが、以下の記述必要 -->
      {{topicId}}
    </yc-cards-slider>
  </div>
</template>

<script>
import formatDate from "~/plugins/format-date.js"
import {firestore, functions} from "~/plugins/firebase.js"
import YcCardsSlider from "~/components/organisms/YcCardsSlider"
import YcSearchOptionModal from "~/components/organisms/YcSearchOptionModal"

function getVideos(vm, request, topicId, topicCount){
  request.get()
    .then(function(querySnapshot){
      for(let index in querySnapshot.docs){
        let doc = querySnapshot.docs[index]
        let data = doc.data()

        let videoInfo = {
          videoTitle: data.title,
          channel: vm.channels[data.channelId].title,
          videoId: doc.id,
          viewCount: data.viewCount,
          publishedAt: data.publishedAt.seconds
        }

        let videoInfoList = vm.videoInfoMap[topicId].videoInfoList
        videoInfoList.push(videoInfo)
        let startDateObj = new Date(vm.startDate)
        let endDateObj   = new Date(Number(data.publishedAt.seconds + '000'))

        let infoMap = {videoInfoList: videoInfoList, startDateObj: startDateObj, endDateObj: endDateObj, topicCount: topicCount}
        vm.$set(vm.videoInfoMap, topicId, infoMap)

        vm.$set(vm.videoInfoMap, "999", {videoInfoList: [], startDateObj: null, endDateObj: null}) // 無理やりv-for 更新のため

        if(topicId === vm.topTopicId && index === "0"){
          console.log("Update: videoId")
          vm.videoId = doc.id
        }

      }

  })
}

function clearInfoMap(vm){
  for(let topicId in vm.topicDefinition){
    let infoMap = {
      videoInfoList: [],
      startDateObj: vm.startDateObj,
      endDateObj: vm.endDateObj,
      topicCount: 0,
    }

    vm.$set(vm.videoInfoMap, topicId, infoMap)
  }

}

function searchVideosInitial(vm){
  vm.startDate = vm.dates[0]
  vm.endDate   = vm.dates[1]
  vm.startDateObj = new Date(vm.startDate)
  vm.endDateObj = new Date(vm.endDate)
  // 必ず +1 日して検索範囲にendDateを丸々含める
  vm.endDateObj.setDate(vm.endDateObj.getDate() + 1)


  clearInfoMap(vm)

  vm.topicIds.forEach((topicId) => {
    console.log("Get Topic ID: " + topicId)

    // topicごとのコレクションの件数を取得しておく
    let params = {genre: vm.genre, topicId: topicId, startDate: vm.startDate, endDate: vm.endDate}
    let call = functions.httpsCallable("getTopicCollectionCountCall")
    call(params).then((result)=>{

      let request = firestore.collection(vm.genre).doc('videos').collection(topicId).orderBy('publishedAt', 'desc')
      .startAt(vm.endDateObj).endBefore(vm.startDateObj).limit(vm.initialRequestLimit)

      let infoMap = {
        videoInfoList: [],
        startDateObj: vm.startDateObj,
        endDateObj: vm.endDateObj,
        topicCount: result.data.count,
      }

      vm.$set(vm.videoInfoMap, topicId, infoMap)
      getVideos(vm, request, topicId, result.data.count)

    }).catch((error) => {
      console.log(error)
    })


  })

}


export default {
  components: {
    YcCardsSlider,
    YcSearchOptionModal,
  },
  props: {
    genre: {
      type: String,
      default: ''
    },
    dialog:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      headerHeight: 52,
      isInitial: true,
      topicDefinition: {},
      initialRequestLimit: 3,
      channels: {},
      topTopicId: "1",
      dates: ['2020-07-01', '2020-08-01'],
      startDate: '',
      endDate: '',
      startDateObj: null,
      ebdDateObj: null,
      // videoId: '5odQCEJUPGw',
      videoId: '',
      videoInfoMap: {},
      cardsSliderTop: "0px",
      topicIds: []
    }
  },
  computed: {
    isTopic999 (){
      return function(topicId){
        return topicId === "999"
      }
    }
  },
  methods: {
    falseDialog(){
      this.$emit('falseDialog')
    },
    updateVideo(videoId){
      console.log('updateVideo!')
      this.videoId = videoId
    },
    calcSliderTop(){
      let vm = this
      if(this.isInitial){
        setTimeout(function(){
          let rect = vm.$refs.youtubeParent.getBoundingClientRect()
          let top    = rect.top
          let height = rect.height
          vm.cardsSliderTop = (vm.headerHeight + height) + "px"
          this.isInitial = false
        }, 1000) // TODO: 時間設定がアドホックなので、setInterval とか使って変更を見たほうがいいかも
      } else{
        let rect = this.$refs.youtubeParent.getBoundingClientRect()
        let top    = rect.top
        let height = rect.height
        this.cardsSliderTop = (this.headerHeight + height) + "px"
      }
    },
    getMoreVideos(topicId, startDateObj, endDateObj, limit){
      let vm = this

      let request = firestore.collection(this.genre).doc('videos').collection(topicId).orderBy('publishedAt', 'desc')
      .startAfter(endDateObj).endAt(startDateObj).limit(limit)

      getVideos(vm, request, topicId, vm.videoInfoMap[topicId].topicCount)
    },
    reSearchVideos(){
      searchVideosInitial(this)
    }

  },
  async mounted() {
    let vm = this
    await this.$axios.$get(`${location.origin}/json/${this.genre}_topic_def.json`)
      .then((response) => {
        console.log('response:')
        console.log(response)
        vm.topicDefinition = response
        vm.topicIds        = Object.keys(response)
      })
    // channelの変換
    let channelsRef = firestore.collection(this.genre).doc('channels');
    channelsRef.get().then(function(doc){
        vm.channels = doc.data();
      })
    .catch(function(error){
      console.log(error);
      })

    // initialize dates
    let today = new Date();
    let aMonthAgo = new Date();
    aMonthAgo.setMonth(aMonthAgo.getMonth() - 1)
    vm.dates = [formatDate(aMonthAgo, 'yyyy-MM-dd'), formatDate(today, 'yyyy-MM-dd')]

    searchVideosInitial(vm)

  }

}
</script>

<style scoped>
#youtube-parent{
  width: 100%;
  max-width: 650px;
  text-align: center;
  position: sticky;
  background-color: white;
}

.x-scroll-box{
  overflow-x: scroll;
  white-space: nowrap;

}

.float-left{
  margin: 5px;
  display: inline-block;
}

.cards-slider{
  position: sticky;
}
</style>