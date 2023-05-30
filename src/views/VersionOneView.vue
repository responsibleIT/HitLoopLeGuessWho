<script setup>
import { ref } from 'vue';
import BaseButton from '../components/BaseButton.vue';
import BeatVersionOne from '@/components/BeatVersionOne.vue';
import { useToggle } from '@vueuse/core'

let data = ref('hallo')
const playPause = ref(false);
const togglePlayPause = useToggle(playPause)

</script>

<template>
<main>
  <BeatVersionOne />
  <div>{{ playPause }}</div>
  <div>
    <button v-if="!playPause" @click="togglePlayPause()">play</button>
    <button v-else @click="togglePlayPause()">pause</button>
  </div>
</main>
</template>
a
<style scoped>
main {
  margin-inline: auto;

}
</style> 