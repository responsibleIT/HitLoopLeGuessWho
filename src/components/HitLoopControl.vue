<script setup>
import {
  ref,
  reactive,
  watch,
  onMounted,
  onUnmounted,
  TransitionGroup,
  Transition,
  computed
} from 'vue'
import { storeToRefs } from 'pinia'
import * as Tone from 'tone'

import { useSequenceStore } from '@/stores/sequence.js'

import BaseIcon from '@/components/BaseIcon.vue'
import BaseButton from '@/components/BaseButton.vue'

const store = useSequenceStore()
const {
  availableNotes,
  activeNotes,
  currentStepIndex,
  sequenceData,
  sampleData,
  isPlaying,
  columns,
  getSequenceData,
  sampleObject,
  bpm,
} = storeToRefs(store)
const { toggleStep, updateSequenceURL, addSequence, togglePlayPause, setCurrentStepIndex } = store

defineProps({
  togglePlay: Function,
  secuence: Function
})
</script>

<template>
  <div class="controlls">
    <div>
      <label for="bpm"
        >BPM:
        <input id="bpm" type="slider" min="20" max="300" v-model.number="bpm" />
      </label>
    </div>
    <BaseButton v-if="!isPlaying" @click="togglePlay(sequence)" icon="play_arrow" />
    <BaseButton v-else @click="togglePlay(sequence)" icon="pause" />
  </div>
</template>

<style lang="scss" scoped>
.controlls {
  padding: 0.5em;
  display: flex;
  align-items: center;
  gap: 1em;
  position: fixed;
  bottom: 0;
  justify-content: center;
  justify-items: center;
  // margin: 0 auto;
  left: 0;
  right: 0;
  border-top: 1px solid var(--color-border);
}

button {
  border: 0;
}
</style>
