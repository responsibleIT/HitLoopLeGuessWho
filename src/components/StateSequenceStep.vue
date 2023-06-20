<script setup>
import { useSequenceStore } from '@/stores/sequence'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const props = defineProps({
  id: Number,
  sampleTypeList: Array,
  sampleData: Array,
  item: Object,
  url: String,
  columns: Number,
  row: Object,
  highlighted: Number,
  col: Number
})

const store = useSequenceStore()
// store values to vuejs ref
const { currentStepIndex } = storeToRefs(store)

const { toggleStep } = store
</script>

<template>
  <div></div>
</template>

<style lang="scss" scoped></style>
