<script setup>
import SampleSelect from '@/components/SampleSelect.vue'
import SequenceItemArc from '@/components/SequenceItemArc.vue'
defineProps({
  sampleTypeList: Array,
  sampleData: Array,
  item: Object,
  url: String,
  highlighted: Number,
  id: Number,
  columns: Number,
  row: Object,
  col: Number
})
</script>
<template>
  <div class="sequence-item">
    <slot name="select"></slot>
    <slot></slot>
    <slot name="arc"></slot>
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
