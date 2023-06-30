<script setup>
import Sequencer from '@/components/Sequencer.vue'
import { useSequenceStore } from '@/stores/sequence.js'
import { storeToRefs } from 'pinia'

const store = useSequenceStore()

const { isSampleDataReady } = storeToRefs(store)
</script>

<template>
  <main>
    <Suspense>
      <Sequencer v-if="isSampleDataReady" />
    </Suspense>
  </main>
</template>

<style scoped>
main {
  overflow: hidden;
  background-color: var(--color-background);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  width: 100%;
  min-height: 98vh;
  max-height: 100cqh;

  border-radius: 8px;
  padding: 8px;

  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
}
</style>
