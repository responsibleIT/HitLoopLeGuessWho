<script setup>
import { ref } from 'vue'

import BeatVersionOne from '@/components/BeatVersionOne.vue'
import { useToggle } from '@vueuse/core'
import StepSequencer from '@/components/StepSequencer.vue'
import StepSequencerVersionTwo from '../components/StepSequencerVersionTwo.vue';

const playPause = ref(false)
// const togglePlayPause = useToggle(playPause)
</script>

<template>
  <main>
    <!-- <StepSequencer /> -->
    <!-- <BeatVersionOne/> -->
    <StepSequencerVersionTwo/>

    <!-- <div>{{ playPause }}</div>
  <div>
    <button v-if="!playPause" @click="togglePlayPause()">play</button>
    <button v-else @click="togglePlayPause()">pause</button>
  </div> -->
  </main>
</template>
a
<style scoped>
main {
  margin-inline: auto;
}
</style>
