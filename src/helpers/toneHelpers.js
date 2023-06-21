import { ref, reactive } from 'vue'
export const createSequenceArrayIndex = (count) => {
  const indices = ref([])
  for (let i = 0; i < count; i++) {
    indices.value.push(i)
  }
  return indices.value
}

export const createSequenceArraySteps = (count) => {
  return Array(count).fill(false)
}
export const createSampleObject = (sequenceData) => {
  const sampleObject = reactive({})
  if (sequenceData) {
    sequenceData.forEach((obj) => {
      sampleObject[obj.sample] = obj.url
    })
  }
  return sampleObject
}
