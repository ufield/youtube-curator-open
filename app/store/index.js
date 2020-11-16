import { cloneDeep } from 'lodash'

function formatDate (date, format) {
  format = format.replace(/yyyy/g, date.getFullYear());
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2));
  format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
  format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3));
  return format;
};

const initialState = {
  genreDates: {'muscle': []},
  genreTopics: {'muscle': {}}
}

for(let genre in initialState.genreDates){
  let endDate = new Date()
  let startDate = new Date()
  startDate.setMonth(startDate.getMonth() - 1)
  let dates = [formatDate(startDate, 'yyyy-MM-dd'), formatDate(endDate, 'yyyy-MM-dd')]
  initialState.genreDates[genre] = dates
}

export const state = () => cloneDeep(initialState)

// export const state = () => ({
//   genreDates: {'muscle': []},
//   genreTopics: {'muscle': {}}
// })

export const getters = {
  // https://vuex.vuejs.org/ja/guide/getters.html // 引数つき
  genreDates: (state) => state.genreDates,
  // getDates: (state) => (genre) => {
  //   return state.genreDates[genre]
  // },
  genreTopics: (state) => state.genreTopics
}

export const mutations = {
  addDates(state, { genre, dates }) {
    state.genreDates[genre] = dates
  },
}

export const actions = {
  updateDates({ commit }, { genre, dates }){
    commit('addDates', { genre, dates})
  },
}
