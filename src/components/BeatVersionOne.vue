<script setup>
import StepSequencer from '@/components/StepSequencer.vue'
defineProps({
  playPause: Boolean
})
</script>

<template>
  <div>
    <StepSequencer :playPause="playPause" />
  </div>
</template>

<style lang="scss" scoped></style>
