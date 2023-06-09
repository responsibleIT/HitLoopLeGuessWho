<script setup>
import { useAttrs } from 'vue'
import BaseIcon from './BaseIcon.vue'

defineProps({
  name: String,
  icon: String
})
</script>

<template>
  <button class="btn-icon" v-if="icon">
    <BaseIcon class="icon" :name="icon" />
  </button>
  <button class="btn" v-else>
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
.btn-icon {
  font-size: 1.5em;
  width: 4rem;
  height:4rem;
  display: flex;
  align-items: center;
  justify-items: center;
  text-align: center;
  justify-content: center;

  span {
    text-align: center;
    font-size: 2em;
    // display: block;
    align-self: center;
  }
}


</style>
