<template>
  <div class="home">
    <h1>
      Gif Picker
    </h1>
    <div>
      <p>Random Gifs</p>
      <div v-for="(gif, index) in randomGifs" :key="index">
        <video autoplay loop>
          <source :src="gif.images.original_mp4.mp4" alt="Giphy Image" type="video/mp4">
        </video>
        <div>
          <input type="hidden" id="search-text" :value="gif.images.original_mp4.mp4">
          <button type="button" @click="copyGiphyLink">Copy Link</button>
        </div>
      </div>
      <p>Searched Gifs</p>
      <form @submit.prevent="searchGiffy">
        <input v-model="searchText" class="uk-input" type="text">
        <button type="submit" @click.prevent="searchGiffy">Search</button>
      </form>
    </div>
    <div v-for="(gif, index) in searchedGifs" :key="index">
      <video autoplay loop>
        <source :src="gif.images.original_mp4.mp4" alt="Giphy Image" type="video/mp4">
      </video>
      <div>
        <input type="hidden" id="search-text" :value="gif.images.original_mp4.mp4">
        <button type="button" @click="copyGiphyLink">Copy Link</button>
      </div>
    </div>
  </div>
</template>

<script>
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
    this.getRandomGifs();
  },
  methods: {
    async searchGiffy() {
      // Clear searchedGifs array if there are any before searching again
      if (this.searchedGifs.length > 0) {
        this.searchedGifs = [];
      }

      const url = ENDPOINTS.GIFFY.SEARCH;

      // Construct query and encode query parameters in the process
      const query = `${url}?q=${encodeURIComponent(this.searchText)}&api_key=${this.key}&limit=20`;

      await ApiService.get(query)
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
    copyGiphyLink() {
      const linkToCopy = document.querySelector('#search-text');
      linkToCopy.setAttribute('type', 'text');
      linkToCopy.select();

      try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'successful' : 'unsuccessful';
        console.log(`Testing code was copied ${msg}`);
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
