<template>
  <div class="all-page">
    <header>
      <v-app-bar
        dense
        elevation="6"
        dark
        color="#0c56d2"
      >
        <!-- app -->
        <v-toolbar-title>
          YouTube キュレーター
        </v-toolbar-title>
        <v-spacer></v-spacer>

        <v-btn icon @click="openGenreSwitchDialog">
          <v-icon>mdi-movie</v-icon>
        </v-btn>
        <v-btn icon @click.stop="trueDialog">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

      </v-app-bar>
    </header>

    <!-- Dialog -->
    <v-dialog
      v-model="genreSwitchDialog"
      scrollable
      max-width="350px"
      @click:outside="closeGenreSwitchDialog"
    >
      <v-card>
        <v-card-title>ジャンルの変更</v-card-title>
        <v-divider></v-divider>
        <v-radio-group
          v-model="selectedGenre"
          style="margin:10px"
        >
          <v-radio
            v-for="genre in genres"
            :value="genre"
            :label="genreToLabel[genre]"
            />
        </v-radio-group>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn
            color="blue darken-1"
            @click="closeGenreSwitchDialog"
            outlined
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>



    <div class="main">
      <yc-main-page
        v-for="genre in genres"
        :genre="genre"
        :dialog="dialog"
        :key="activeGenre"
        v-if="isActiveGenre(genre)"
        @falseDialog="falseDialog"
      >
      </yc-main-page>
        <!-- v-if="isShogi" -->
    </div>
  </div>
</template>

<script>
import YcMainPage from '~/components/templates/YcMainPage'

export default {
  components: {
    YcMainPage
  },
  data () {
    return {
      dialog: false,
      genreSwitchDialog: false,
      isShogi: false,
      genres: ['muscle', 'shogi'],
      genreToLabel: {muscle: '筋トレ', shogi: '将棋'},
      activeGenre: 'muscle',
      selectedGenre: 'muscle'
    }
  },
  methods: {
    trueDialog(){
      this.dialog = true
    },
    falseDialog(){
      this.dialog = false
    },
    toShogi(){
      this.$nextTick(() => {this.activeGenre = "shogi"})
    },
    openGenreSwitchDialog(){
      this.genreSwitchDialog = true
    },
    closeGenreSwitchDialog(){
      this.genreSwitchDialog = false
      this.activeGenre       = this.selectedGenre
    }
  },
  computed: {
    isActiveGenre() {
      return (genre) => {
        return this.activeGenre === genre
      }
    }
  }

}
</script>

<style scoped>
header{
  position: sticky;
  top: 0;
  height: 52px;
}

.all-page{
  background:lavender;
  /* background: #fafad2; */
}

v-toolbar-title{
  font-family: "MS Pゴシック",sans-serif;
}

.main{
  width: 95%;
  /* margin-left: 10px; */
  /* margin-right: 10px; */
  margin-left: auto;
  margin-right: auto;
  max-width: 650px;
  /* border-left: solid 0.5px ;
  border-right: solid 0.5px gray; */
  box-shadow: 0px 20px 40px rgba(0,0,0,0.4);
}

</style>