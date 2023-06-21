<script setup>
import { useSequenceStore } from '@/stores/sequence'
import { storeToRefs } from 'pinia'
import { ref, TransitionGroup } from 'vue'

const props = defineProps({
  id: Number,
  item: Object,
  color: String
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
        v-for="(step, stepIndex) in item.steps"
        class="step-item"
        :key="stepIndex"
        :class="{ active: item.steps[stepIndex], highlighted: stepIndex === currentStepIndex }"
        @click="toggleStep(item, stepIndex)"
        :name="stepIndex"
      ></button>
    </TransitionGroup>
  </div>
</template>

<style lang="scss" scoped>
.step-item {
  // width: 2.5em;
  // height: 2.5em;
  // border-radius: 100%;
  // background-color: v-bind(color);
  // border: 2px solid red;
  width: 1rem;
  height: 1rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.12);
}
.active {
  // stroke-opacity: 50%;
  // background-color: #2ecd71;
  background-color: var(--color-green);
  transform: scale(2);
}

.highlighted {
  // opacity: 50%;
  background-color: var(--color-white);
  // stroke: green;
}

.highlighted.active {
  border: 2px solid black;
}

.steps-container {
  // margin-bottom: 1em;
  width: 100%;
  display: flex;
  // gap: 2em;
  // justify-content: stretch;
  // align-items: stretch;
  justify-content: space-between;
}
</style>
