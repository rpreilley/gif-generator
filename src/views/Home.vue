<template>
  <div v-if="loading">
    Loading...
  </div>
  <div v-else class="home">
    <h1>
      Gif Picker
    </h1>
    <div>
      <!-- <p>Random Gifs</p>
      <div v-for="(gif, index) in randomGifs" :key="index">
        <video autoplay loop>
          <source
            :src="gif.images.original_mp4.mp4"
            alt="Giphy Image" type="video/mp4"
            id="random-text"
          >
        </video>
        <div>
          <button type="button" @click="copyGiphyLink">Copy Link</button>
        </div>
      </div> -->
      <p>Searched Gifs</p>
      <!-- <form @submit.prevent="searchGiffy">
        <input v-model="searchText" class="uk-input" type="text" @input="searchGiffy">
      </form> -->
      <input v-model="searchText" class="uk-input" type="text" @input="debouncedGiphySearch()">
    </div>
    <div v-for="(gif, index) in searchedGifs" :key="index">
      <video autoplay loop>
        <source :src="gif.images.original_mp4.mp4" alt="Giphy Image" type="video/mp4">
      </video>
      <div>
        <input type="hidden" :id="`search-text${index}`" :value="gif.images.original_mp4.mp4">
        <button type="button" @click="copyGiphyLink(index)">Copy Link</button>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import CONSTANTS from '../constants/apiKeys';
import ENDPOINTS from '../constants/endpoints';
import ApiService from '../services/ApiService';

export default {
  name: 'home',
  data() {
    return {
      searchText: '',
      key: CONSTANTS.API_KEY.GIFFY,
      searchedGifs: [],
      randomGifs: [],
      loading: false
    };
  },
  components: {

  },
  mounted() {
    // this.getRandomGifs();
  },
  methods: {
    // Debounce function so it isn't called immediately after every keypress
    debouncedGiphySearch: _.debounce(function () { this.searchGiphy(); }, 750),
    async searchGiphy() {
      // Clear searchedGifs array if there are any before searching again
      if (this.searchedGifs.length > 0) {
        this.searchedGifs = [];
      }

      const url = ENDPOINTS.GIFFY.SEARCH;

      // Construct query and encode query parameters in the process
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

      const url = ENDPOINTS.GIFFY.RANDOM;
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
    },
    copyGiphyLink(id) {
      const linkToCopy = document.querySelector(`#search-text${id}`);
      linkToCopy.setAttribute('type', 'text');
      linkToCopy.select();

      try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'successful' : 'unsuccessful';
        console.log(`Testing code was copied ${msg}`);
        // Notify user giphy link has been copied
      } catch (err) {
        console.log('Oops, unable to copy');
      }

      /* unselect the range */
      linkToCopy.setAttribute('type', 'hidden');
      window.getSelection().removeAllRanges();
    }
  }
};
</script>
