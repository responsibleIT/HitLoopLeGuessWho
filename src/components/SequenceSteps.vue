<script setup>
import { useSequenceStore } from '@/stores/sequence'
import { storeToRefs } from 'pinia'
import { ref, TransitionGroup } from 'vue'

const store = useSequenceStore()

const props = defineProps({
  id: Number,
  item: Object,
  color: String,
  highlighted: Number
})

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
  width: 2rem;
  height: 2rem;
  border-radius: 100%;
  background: var(--color-background-transparent);
  transition: all 0.5s;
}
.active {
  background-color: var(--color-green);
  transform: scale(1.25);
  transition: all 0.3s;
}

.highlighted {
  background-color: var(--color-text);
}

.highlighted.active {
  border: 2px solid black;
  transform: scale(1.75);
  transition-duration: 0.2s;
}

.steps-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
