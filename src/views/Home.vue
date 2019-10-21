<template>
  <div class="container">
    <!-- Snackbar -->
    <div id="snackbar">Copied Gif to Keyboard</div>
    <h1 class="title">
      Gif Picker
    </h1>
    <div>
      <p>Random Gifs</p>
      <Gif :gifs="randomGifs"/>
      <p class="description">To find some gifs, start typing in what you'd like to find.</p>
      <input v-model="searchText" class="uk-input" type="text" @input="debouncedGiphySearch()">
    </div>
    <div class="gif-container">
      <Gif :gifs="searchedGifs"/>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import CONSTANTS from '../constants/apiKeys';
import ENDPOINTS from '../constants/endpoints';
import ApiService from '../services/ApiService';
import Gif from '../components/Gif.vue';

export default {
  name: 'home',
  data() {
    return {
      searchText: '',
      key: CONSTANTS.API_KEY.GIPHY,
      searchedGifs: [],
      randomGifs: [],
      loading: false
    };
  },
  components: {
    Gif
  },
  mounted() {
    this.getRandomGifs();
  },
  methods: {
    // Debounce function so searchGiphy isn't called immediately after every keypress
    debouncedGiphySearch: _.debounce(function () {
      this.searchGiphy();
    }, 750),
    async searchGiphy() {
      // Clear searchedGifs array if there are any before searching again
      if (this.searchedGifs.length > 0) {
        this.searchedGifs = [];
      }

      const url = ENDPOINTS.GIPHY.SEARCH;

      // Construct query and encode query parameters
      const query = `${url}?q=${encodeURIComponent(this.searchText)}&api_key=${this.key}&limit=20`;

      return ApiService.get(query)
        .then((response) => {
          if (response && response.status === 200) {
            // Iterate through array and remove any objects that don't contain an mp4 file
            for (let i = 0; i < response.data.data.length; i += 1) {
              const item = response.data.data[i];

              // Push items containing an mp4 format option to a searchedGifs array
              if (item.images && item.images.original_mp4) {
                this.searchedGifs.push(item);
              }
            }
          } else {
            console.log(response);
            debugger;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getRandomGifs() {
      // Clear randomGifs array if there are any before searching again
      if (this.randomGifs.length > 0) {
        this.randomGifs = [];
      }

      const url = ENDPOINTS.GIPHY.RANDOM;
      const query = `${url}?api_key=${this.key}&limit=20`;

      await ApiService.get(query)
        .then((response) => {
          if (response && response.status === 200) {
            const item = response.data.data;

            // Push items containing an mp4 format option to a randomGifs array
            if (item.images && item.images.original_mp4) {
              this.randomGifs.push(item);
            }
          } else {
            console.log(response);
            debugger;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
};
</script>
