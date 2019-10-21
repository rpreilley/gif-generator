<template>
  <div>
    <div v-for="(gif, index) in gifs" :key="index" class="gif-item">
      <video autoplay loop>
        <source :src="gif.images.original_mp4.mp4" alt="Giphy Image" type="video/mp4">
      </video>
      <div>
        <input type="hidden" :id="`search-text-${gif.id}`" :value="gif.images.original_mp4.mp4">
        <button type="button" @click="copyGiphyLink(gif.id)">Copy Gif</button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Gif',
  props: {
    gifs: {
      Type: Array,
      default: []
    }
  },
  data() {
    return {

    };
  },
  components: {

  },
  methods: {
    copyGiphyLink(id) {
      const linkToCopy = document.querySelector(`#search-text-${id}`);
      linkToCopy.setAttribute('type', 'text');
      linkToCopy.select();

      try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'successful' : 'unsuccessful';
        console.log(`Testing code was copied ${msg}`);
        // Notify user giphy link has been copied

        // Get the snackbar DIV
        const x = document.getElementById('snackbar');

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
