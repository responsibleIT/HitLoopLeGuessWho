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
const sequence = useSequenceStore()
console.log(sequence)
// store values to vuejs ref
const {
  doubleCount,
  samplePack
} = storeToRefs(sequence)

console.log(sequence.value)

const { toggleStep, updateSequenceURL, addSequence, togglePlayPause, setCurrentStepIndex } = sequence

const sampleData = await getSampleData(apiBaseURL, 'b', 'list')

</script>
<template>
  <div class="sequence-item">
    <slot name="select">
      <SequenceItemSelect
              :selectedValue="item.url"
              @update:="updateSequenceURL(id, $event)"
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
