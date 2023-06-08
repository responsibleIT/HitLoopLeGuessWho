import {ref, reactive} from 'vue';
export const createSequenceArray = (count) => {
  const indices = ref([])
  for (let i = 0; i < count; i++) {
    indices.value.push(i)
  }
  return indices.value
}

export const createSampleObject = (sequenceData) => {
  const sampleObject = reactive({})
  sequenceData.forEach((obj) => {
    sampleObject[obj.sample] = obj.url
  })
  return sampleObject
}