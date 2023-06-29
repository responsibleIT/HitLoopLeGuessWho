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
import BaseButton from '@/components/BaseButton.vue'
const store = useSequenceStore()

const { bpm } = storeToRefs(store)

const { moreBPM, lessBPM } = store
</script>

<template>
  <div class="input-group-v">
    <label for="bpm">BPM</label>
    <div>
      <BaseButton icon="remove" @click="lessBPM"/>
      <input id="bpm" type="number" min="20" max="300" step="5" v-model.number="bpm" />  
      <BaseButton icon="add" @click="moreBPM"/>
    </div>
    
  </div>
</template>

<style lang="scss" scoped>
input#bpm {
  appearance: none;
  border: 0;
  color: var(--color-text);
  background-color: var(--color-background);
  font-size: 1.2em;
  text-align: center;
  min-width: 2.5em;
  padding: .5em .5em;
  display: block;
  border-radius: 10px;
  font-weight: 600;
}
div div {
  font-size: 1em;
  flex-direction: row;
}
.input-group-v {
  display: flex;
  flex-direction: column;
  font-size: 1em;
  gap: .1em;
  position: relative;
  
}
label {
  font-size: .9em;
  display: block;
  flex-shrink: 2;
  position: absolute;
  top: -1.5em;
}
div {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  align-items: center;
}

button {
  font-size: 3em;
  border: 0;
  padding: 0;
  margin: 0;
}
</style>
