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
import BaseIcon from '@/components/BaseIcon.vue'
const store = useSequenceStore()

const { bpm } = storeToRefs(store)

const { moreBPM, lessBPM } = store
</script>

<template>
  <div>
    <button @click="lessBPM"><BaseIcon name="remove" /></button>
    <input id="bpm" type="number" min="20" max="300" v-model.number="bpm" />
    <button @click="moreBPM"><BaseIcon name="add" /></button>
  </div>
</template>

<style lang="scss" scoped>
div {
  display: flex;
  flex-direction: row;
  gap: 1em;
  align-items: center;
}

button {
  font-size: 1.5em;
  border: 0;
  padding: 0;
  margin: 0;
}
</style>
