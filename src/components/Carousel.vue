<template>
  <div v-if="gifs.length > 0" class="card-carousel-wrapper">
    <div class="card-carousel--nav__left" @click="moveCarousel(-1)" :disabled="atHeadOfList"></div>
    <div class="card-carousel">
      <div class="card-carousel--overflow-container">
        <div class="card-carousel-cards" :style="{ transform: 'translateX' + '(' + currentOffset + 'px' + ')'}">
          <div class="card-carousel--card" v-for="(gif, index) in gifs" :key="index">
            <a @click.prevent="copyGiphyLink(gif.id)">
              <video autoplay muted loop class="gif-item">
                <source :src="gif.images.original_mp4.mp4" alt="Giphy Image" type="video/mp4">
              </video>
            </a>
            <input type="hidden" :id="`search-text-${gif.id}`" :value="gif.images.original_mp4.mp4">
          </div>
        </div>
      </div>
    </div>
    <div class="card-carousel--nav__right" @click="moveCarousel(1)" :disabled="atEndOfList"></div>
  </div>
</template>

<script>

export default {
  name: 'Carousel',
  props: {
    gifs: {
      Type: Array,
      default: []
    }
  },
  data() {
    return {
      currentOffset: 0,
      windowSize: 3,
      paginationFactor: 220
    };
  },
  computed: {
    atEndOfList() {
      return this.currentOffset <= (this.paginationFactor * -1) * (this.gifs.length - this.windowSize);
    },
    atHeadOfList() {
      return this.currentOffset === 0;
    },
    gifsLength() {
      return (this.gifs.length > 3);
    }
  },
  watch: {
    // If there is any change to the search that causes this component to update, refresh the data object values
    gifs() {
      this.currentOffset = 0;
      this.windowSize = 3;
      this.paginationFactor = 220;
    }
  },
  methods: {
    moveCarousel(direction) {
      // Find a more elegant way to express the :style. consider using props to make it truly generic
      if (direction === 1 && !this.atEndOfList) {
        this.currentOffset -= this.paginationFactor;
      } else if (direction === -1 && !this.atHeadOfList) {
        this.currentOffset += this.paginationFactor;
      }
    },
    copyGiphyLink(id) {
      const linkToCopy = document.querySelector(`#search-text-${id}`);
      linkToCopy.setAttribute('type', 'text');
      linkToCopy.select();

      try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'successful' : 'unsuccessful';
        console.log(`Testing code was copied ${msg}`);

        // Get the snackbar DIV and notify user giphy link has been copied
        const x = document.getElementById('snackbar');
        x.innerHTML = 'Copied Gif to Keyboard';
        if (x.className === 'show') {
          // Do nothing
        } else {
          // Add the "show" class to DIV
          x.className = 'show';

          // After 3 seconds, remove the show class from DIV
          setTimeout(() => { x.className = x.className.replace('show', ''); }, 3000);
        }
      } catch (error) {
        console.log(error);
      }

      /* unselect the range */
      linkToCopy.setAttribute('type', 'hidden');
      window.getSelection().removeAllRanges();
    }
  }
};
</script>
