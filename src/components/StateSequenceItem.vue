<script setup>
import SequenceItemSelect from '@/components/SequenceItemSelect.vue'
import SequenceItemArc from '@/components/SequenceItemArc.vue'

import { useSequenceStore } from '@/stores/sequence.js'
import { storeToRefs } from 'pinia';
import getSampleData from '@/composables/getSampleData';
const apiBaseURL = import.meta.env.VITE_API_BASE
const props = defineProps({
  sampleTypeList: Array,
  item: Object,
  url: String,
  highlighted: Number,
  id: Number,
  columns: Number,
  row: Object,
  col: Number,
  selectedValue: String
})
console.log(props)
const store = useSequenceStore()
console.log(store)
// store values to vuejs ref
const {
  doubleCount,
  samplePack,
  currentStepIndex,
  sequenceData
} = storeToRefs(store)
console.log(sequenceData)
console.log(store.value)

const { toggleStep, updateSequenceURL, addSequence, togglePlayPause, setCurrentStepIndex } = store

const sampleData = await getSampleData(apiBaseURL, 'b', 'list')
console.log(props)
</script>
<template>
  <div class="sequence-item">
    <slot name="select">
      <SequenceItemSelect
              :selectedValue="selectedValue"
              @update:url="updateSequenceURL(id, $event)"
              :item="item"
              :sampleTypeList="sampleTypeList"
              :sampleData="sampleData"
            />
    </slot>
    <slot></slot>
    <slot name="arc">
      <SequenceItemArc
              :columns="columns"
              :row="item"
              :highlighted="highlighted"
              @toggle-step="toggleStep"
            />
    </slot>
  </div>
</template>

<style lang="scss" scoped>
.sequence-item {
  border: 1px solid var(--color-background-mute);
  padding: 1em;
  display: flex;
  gap: 1em;
  flex-direction: column;
  align-items: center;
  border-radius: 1em;
}
</style>
