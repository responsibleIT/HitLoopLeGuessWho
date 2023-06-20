<script setup>
const store = useSequenceStore()
import { Suspense } from 'vue'

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

// Pack with sample names
import { useSequenceStore } from '@/stores/sequence.js'
import AnimateSequencer from '@/components/AnimateSequencer.vue'


// store values to vuejs ref
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
  isStarted,
  bpm
} = storeToRefs(store)

const {
  toggleStep,
  setStarted,
  updateSequenceURL,
  addSequence,
  togglePlayPause,
  setCurrentStepIndex
} = store



</script>

<template>
  <main>
    <Suspense>
      <AnimateSequencer v-if="sampleObject" :sampleObject="sampleObject" />
    </Suspense>
  </main>
</template>
<style scoped></style>
