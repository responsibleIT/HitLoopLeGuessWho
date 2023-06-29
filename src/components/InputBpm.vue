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
  <div class="input-group-v">
    <label for="bpm">BPM</label>
    <div>
      <button @click="lessBPM"><BaseIcon name="remove" /></button>
      <input id="bpm" type="number" min="20" max="300" step=".01" v-model.number="bpm" />
      <button @click="moreBPM"><BaseIcon name="add" /></button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
input#bpm {
  appearance: none;
  border: 0;
  background-color: --color;
}

.input-group-v {
  display: flex;
  flex-direction: column;
}

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
