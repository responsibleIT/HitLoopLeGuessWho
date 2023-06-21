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
// Pack with sample names
import { useSequenceStore } from '@/stores/sequence.js'
const store = useSequenceStore()

const { bpm } = storeToRefs(store)

const { moreBPM, lessBPM } = store
</script>

<template>
  <button @click="lessBPM">min</button>
  <input id="bpm" type="number" min="20" max="300" v-model.number="bpm" />
  <button @click="moreBPM">add</button>
</template>

<style lang="scss" scoped></style>
