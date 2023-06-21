<script setup>
import SampleSelect from '@/components/SampleSelect.vue'
import SequenceItemArc from '@/components/SequenceItemArc.vue'

import { useSequenceStore } from '@/stores/sequence.js'
import { storeToRefs } from 'pinia'
import SequenceSteps from '@/components/SequenceSteps.vue'
const apiBaseURL = import.meta.env.VITE_API_BASE
const props = defineProps({
  item: Object,
  id: Number,
  empty: Boolean
})

const store = useSequenceStore()
// store values to vuejs ref
const { samplePack, currentStepIndex, sequenceData, sampleTypeList } = storeToRefs(store)

const { toggleStep, updateSequenceURL } = store
</script>
<template>
  <div class="sequence-item">
    <slot name="select" v-if="!empty">
      <SampleSelect
        class="sample-select"
        @update:url="updateSequenceURL(id, $event)"
        :item="item"
        :id="id"
      />
    </slot>
    <slot></slot>
    <slot name="steps">
      <SequenceSteps v-if="!empty" :id="id" :item="item" :color="item.color" />
    </slot>
  </div>
</template>

<style lang="scss" scoped>
.sequence-item {
  border: 1px solid var(--color-background-mute);
  padding: 1em;
  display: flex;
  // gap: 1em;
  justify-items: center;
  flex-direction: row;
  align-items: center;
  align-content: center;

  border-radius: 1em;
  margin-bottom: 1em;
}

.sample-select {
  width: 12em;

  background: -var(--color-background-mute);
}
</style>
