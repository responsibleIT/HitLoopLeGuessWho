<script setup>
import { useSequenceStore } from '@/stores/sequence'
import { storeToRefs } from 'pinia'
import { ref, TransitionGroup } from 'vue'

const props = defineProps({
  id: Number,
  sampleTypeList: Array,
  sampleData: Array,
  item: Object,
  url: String,
  columns: Number,
  row: Object,
  highlighted: Number,
  col: Number,
  color: String,
})

const store = useSequenceStore()
// store values to vuejs ref
const { currentStepIndex } = storeToRefs(store)

const { toggleStep } = store
</script>

<template>
  <div class="steps-container">
    <TransitionGroup>
      <button
        v-for="(step, stepIndex) in props.columns"
        class="step-item"
        :key="stepIndex"
        :class="{ active: row.steps[stepIndex], highlighted: stepIndex === currentStepIndex }"
        @click="toggleStep(row, stepIndex)"
        stroke-width="15"
        stroke="blue"
        fill="none"
        stroke-linecap="round"
        :name="stepIndex"
      ></button>
    </TransitionGroup>
  </div>
</template>

<style lang="scss" scoped>
.step-item {
  width: 2.5em;
  height: 2.5em;
  border-radius: 100%;
  background-color: v-bind(color);
  border: 2px solid red;
}
.active {
  stroke-opacity: 50%;
  background-color: #2ecd71;
}

.highlighted {
  opacity: 50%;

  // stroke: green;
}

.highlighted.active {
  border: 2px solid black;
}

.steps-container {
  width: 100%;
  display: flex;
  // justify-content: stretch;
  align-items: stretch;
  justify-content: space-between;
}
</style>
