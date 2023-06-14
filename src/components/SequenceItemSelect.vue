<script setup>
import { storeToRefs } from 'pinia';
import { useSequenceStore } from '@/stores/sequence.js'
import { ref } from 'vue';
// import { ref,useAttrs } from 'vue';
defineProps({
  sampleTypeList: Array,
  item: Object,
  url: String,
  highlighted: Number,
  id: Number
})


const store = await useSequenceStore()
console.log(store)
// store values to vuejs ref
const {
  doubleCount,
  availableNotes,
  activeNotes,
  currentStepIndex,
  sequenceData,
  sampleData,
  isPlaying,
  columns
} = storeToRefs(store)

console.log(currentStepIndex)
console.log("seiwoufhewuipgheuity89epwhtore.activeNotes")
console.log(store.activeNotes)
const { toggleStep, updateSequenceURL, addSequence, togglePlayPause, setCurrentStepIndex } = store

const urlInput = ref()
console.log(urlInput)
</script>

<template>
  <select @input="$emit('update:url', $event.target.value)">
    <template v-for="(sampleType, i) in sampleTypeList" :key="i">
      <optgroup :label="sampleType">
        <template v-for="sample in sampleData">
          <option v-if="sample.type === sampleType" :key="sample" :value="sample.url">
            {{ sample.version }} - {{ sample.name }}
          </option>
        </template>
      </optgroup>
    </template>
  </select>
</template>

<style lang="scss" scoped></style>
