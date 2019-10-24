<template>
  <div id="main">
    <!-- Snackbar -->
    <div id="snackbar">Copied Gif to Keyboard</div>
    <h1 class="title">
      Gif Picker
    </h1>
    <div>
      <Carousel :gifs="randomGifs"/>
      <div class="description-wrapper">
        <p class="description">Choose one of our pre-selected gifs above, or start typing below to begin your search.</p>
        <p class="description">Click <a href="" @click.prevent="getMoreRandomGifs()">here</a> to get 3 new random gifs.</p>
        <br>
        <p class="description">Click a gif to copy it for re-use in your favorite chat room.</p>
        <input v-model="searchText" placeholder="Search for a gif..." id="inp" class="input" type="text" @input="debouncedGiphySearch()" autofocus>
      </div>
    </div>
    <div>
      <Carousel :gifs="searchedGifs"/>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import CONSTANTS from '../constants/apiKeys';
import ENDPOINTS from '../constants/endpoints';
import ApiService from '../services/ApiService';
import Carousel from '../components/Carousel.vue';

export default {
  name: 'home',
  data() {
    return {
      searchText: '',
      key: CONSTANTS.API_KEY.GIPHY,
      searchedGifs: [],
      randomGifs: [],
      loading: false,
      giphyLimit: '30',
      count: 0
    };
  },
  components: {
    Carousel
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
      const limit = parseInt(this.giphyLimit, 10);

      // Construct query and encode query parameters
      const query = `${url}?q=${encodeURIComponent(this.searchText)}&api_key=${this.key}&limit=${limit}`;

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
      const url = ENDPOINTS.GIPHY.RANDOM;
      const query = `${url}?api_key=${this.key}&limit=20`;

      await ApiService.get(query)
        .then((response) => {
          if (response && response.status === 200) {
            const item = response.data.data;

            // Push items containing an mp4 format option to a randomGifs array
            if (item.images && item.images.original_mp4 && this.count < 3) {
              this.randomGifs.push(item);

              // Recursively call itself until count is equal to 3
              this.count += 1;
              this.getRandomGifs();
            } else {
              // Reset count
              this.count = 0;
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
    getMoreRandomGifs() {
      // Reset count and re-call random gif function
      this.getRandomGifs();
      this.count = 0;
    }
  }
};
</script>
