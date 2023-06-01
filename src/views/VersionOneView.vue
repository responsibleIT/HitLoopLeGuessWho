<script setup>
import { ref } from 'vue';

import BeatVersionOne from '@/components/BeatVersionOne.vue';
import { useToggle } from '@vueuse/core'

const playPause = ref(false);
const togglePlayPause = useToggle(playPause)

</script>

<template>
<main>
  <BeatVersionOne :playPause="playPause" />
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