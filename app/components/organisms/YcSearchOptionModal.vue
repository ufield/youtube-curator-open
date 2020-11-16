<template>
  <v-card
    :topic-definition="topicDefinition"
    :genre="genre"
    :dates="dates"
  >
    <v-card-title>検索オプションの変更</v-card-title>
    <v-divider></v-divider>
    <v-card-text style="height: 400px;">

    <p style="margin-top:10px">検索期間の変更</p>
    <v-text-field
      style="margin-top:10px"
      v-model="dateRangeText"
      label="Date range"
      prepend-icon="mdi-calendar"
      readonly
      @click="openDatepicker"
    ></v-text-field>

    <v-date-picker
      v-model="dates"
      dark
      range
      min="2020-01-01"
      v-show="showCalender"
      width="100%"
      @input="$emit('update:dates', dates)"
     >
      <v-spacer></v-spacer>
      <v-btn
        color="blue darken-1"
        @click="closeDatePicker"
      >
        Close
      </v-btn>
    </v-date-picker>

    <v-divider></v-divider>


    <p style="margin-top:10px">検索トピックの変更</p>
    <v-radio-group
      v-model="topicSelector"
      @change="onTopicsRadioChange"
    >
      <v-radio
        value="all"
        label="すべてのトピック"
      />
      <v-radio
        value="select"
        label="トピックを選択"
      />
    </v-radio-group>
      <!-- Topics .. -->
      <v-select
        multiple
        chips
        :loading="searchTopics.length <= 0"
        v-model="selectedTopics"
        :items = "searchTopics"
        :disabled="isSelectorDisabled"
        @change="topicToIds"
        placeholder="No Topics"
      />

    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn
        color="blue darken-1"
        @click="falseDialog"
        outlined
      >
        Close
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        color="red"
        @click="search"
        outlined
      >
        Search
      </v-btn>
    </v-card-actions>
  </v-card>

</template>

<script>
// import { mapGetters, mapActions } from 'vuex'

  function topicToIds(topics, topicDefinition){
    let ids=[]
    topics.forEach(function(topic){
      let id = Object.keys(topicDefinition).filter( (key) => {
        return topicDefinition[key] === topic
      })
      ids = ids.concat(id)
    })

    return ids;
  }



export default {
  props: {
    topicDefinition: {
      type: Object,
      default: {}
    },
    genre: {
      type: String,
      default: ''
    },
    dates: {
      type: Array,
      default: []
    },
  },
  data() {
    return {
      showCalender: false,
      selectedTopics: [],
      searchTopics: [],
      topicSelector: 'all',
      isSelectorDisabled: true,
    }
  },
  methods: {
    search(){
      this.$emit('falseDialog')
      this.$emit('reSearchVideos')
    },
    falseDialog() {
      this.$emit('falseDialog')
    },
    openDatepicker(){
      this.showCalender = true
    },
    closeDatePicker(){
      this.showCalender = false
    },
    onTopicsRadioChange(){
      // return this.topicSelector === 'all'
      if (this.topicSelector === 'all') {  // input type="radio"のvalueを取得して判定
        this.isSelectorDisabled = true
        this.$emit('update:topic-ids', Object.keys(this.topicDefinition))
      } else {
        this.isSelectorDisabled = false
        let selectedIds = topicToIds(this.selectedTopics, this.topicDefinition)
        this.$emit('update:topic-ids', selectedIds)
      }
    },
    topicToIds() {
      console.log(this.selectedTopics)
      let selectedIds = topicToIds(this.selectedTopics, this.topicDefinition)
      this.$emit('update:topic-ids', selectedIds)
    }
    // ...mapActions(['updateDates'])
  },
  computed: {
    dateRangeText () {
      return this.dates.join(' ~ ')
    },
    // isSelectorDisabled(){
    //   return this.topicSelector === 'all'
    // }
    // dates:{
    //   get() {
    //     return this.genreDates[this.genre]
    //   },
    //   set(val){
    //     console.log('dates ?' + val)
    //     let genre = this.genre
    //     this.updateDates({genre, val})
    //   }
    // },
    // ...mapGetters(['genreDates'])
  },
  mounted() {
    this.searchTopics = Object.values(this.topicDefinition)
  }
}
</script>

<style scoped>

v-card-title{
  color: gray;
}

</style>