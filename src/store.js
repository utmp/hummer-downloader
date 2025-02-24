// filepath: /c:/Users/noob/Desktop/yt-dwn/vue-vite-tw/src/store.js
import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      val1: 'hi mom',
      videoData: null
    }
  },
  getters: {
    getVal1: (state) => state.val1,
    getVideoData: (state) => state.videoData
  },
  mutations: {
        setVideoData(state, data) {
      state.videoData = {
        ...data.res,          
        url: data.url,
        formatEntries: data.formatEntries  // contains available formats
      }
    }
  },
  actions: {
    async fetchVideoData({ commit }, url) {
      try {
        const res = await fetch('http://localhost:3002/getInfo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ msg: url })
        })
        const data = await res.json()
        commit('setVideoData', data)
      } catch (error) {
        console.error('Error fetching video data:', error)
      }
    }
  }
})

export default store