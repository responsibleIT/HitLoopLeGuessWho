<script setup>
import Sequencer from '@/components/Sequencer.vue'
</script>

<template>
  <main>
    <Suspense>
      <Sequencer />
    </Suspense>
  </main>
</template>
<style scoped>
main {
  overflow: hidden;
  background-color: var(--color-background-dark);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  width: 100%;
  height: 85vh;
  
  border-radius: 8px;
  padding: 8px;

  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
}

</style>
