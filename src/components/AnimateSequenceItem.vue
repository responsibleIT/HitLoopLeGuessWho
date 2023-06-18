<script setup>
import SequenceItemSelect from '@/components/SequenceItemSelect.vue'
import SequenceItemArc from '@/components/SequenceItemArc.vue'

import { useSequenceStore } from '@/stores/sequence.js'
import { storeToRefs } from 'pinia'
import getSampleData from '@/composables/getSampleData'
import AnimateSequenceItemSteps from './AnimateSequenceItemSteps.vue'
const apiBaseURL = import.meta.env.VITE_API_BASE
const props = defineProps({
  item: Object,
  url: String,
  highlighted: Number,
  id: Number,
  columns: Number,
  row: Object,
  col: Number,
  selectedValue: String,
  empty: Boolean
})

const store = useSequenceStore()
// store values to vuejs ref
const { doubleCount, samplePack, currentStepIndex, sequenceData, sampleTypeList } =
  storeToRefs(store)

const { toggleStep, updateSequenceURL, addSequence, togglePlayPause, setCurrentStepIndex } = store

const sampleData = await getSampleData(apiBaseURL, 'b', 'list')

</script>
<template>
  <div class="sequence-item">
    <slot name="select" v-if="!empty">
      <SequenceItemSelect class="sample-select"
        :selectedValue="selectedValue"
        @update:url="updateSequenceURL(id, $event)"
        :item="item"
      />
    </slot>
    <slot></slot>
    <slot name="steps">
      <AnimateSequenceItemSteps v-if="!empty"
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
  // border: 1px solid var(--color-background-mute);
  // padding: 1em;
  display: flex;
  // gap: 1em;
  justify-items: stretch;
  flex-direction: row;
  // align-items: center;
  border-radius: 1em;
}

.sample-select {
  width: 12em;
}

</style>
