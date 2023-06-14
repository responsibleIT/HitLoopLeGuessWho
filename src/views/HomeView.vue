<script setup>
import { Suspense } from 'vue'
import StateSequencer from '@/components/StateSequencer.vue'
</script>

<template>
  <main>
    <Suspense>
      <StateSequencer />
    </Suspense>
  </main>
</template>
<style scoped></style>
