import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useSequenceStore = defineStore('sequence', () => {
  const bpm = ref(130)
  const state = reactive({
    bpm: 130
  })
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment, bpm, state }
})
